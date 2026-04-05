import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'salestracker.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS goals (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    target     REAL NOT NULL,
    type       TEXT NOT NULL DEFAULT 'monetary',
    unit_label TEXT NOT NULL DEFAULT 'units',
    start_date TEXT NOT NULL,
    end_date   TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    CHECK(end_date > start_date),
    CHECK(type IN ('monetary', 'units'))
  );

  CREATE TABLE IF NOT EXISTS sales (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'monetary',
    value       REAL NOT NULL,
    description TEXT,
    date        TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now')),
    CHECK(type IN ('monetary', 'units')),
    CHECK(value > 0)
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    rule_type   TEXT NOT NULL,
    rule_params TEXT NOT NULL DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS goal_achievements (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id        INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    achieved_at    TEXT DEFAULT (datetime('now')),
    UNIQUE(goal_id, achievement_id)
  );

  CREATE TABLE IF NOT EXISTS user_achievements (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    achieved_at    TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, achievement_id)
  );
`);

// --- Migrations ---
// Goals: add type + unit_label if missing
for (const sql of [
  `ALTER TABLE goals ADD COLUMN type TEXT NOT NULL DEFAULT 'monetary'`,
  `ALTER TABLE goals ADD COLUMN unit_label TEXT NOT NULL DEFAULT 'units'`,
]) {
  try { db.exec(sql); } catch { /* already exists */ }
}

// Sales: consolidate amount + quantity -> value
const salesCols = (db.pragma('table_info(sales)') as Array<{ name: string }>).map(c => c.name);
if (!salesCols.includes('value')) {
  // Add value, populate from whichever old column is meaningful per type
  db.exec(`ALTER TABLE sales ADD COLUMN value REAL NOT NULL DEFAULT 0`);
  db.exec(`UPDATE sales SET value = amount   WHERE type = 'monetary'`);
  db.exec(`UPDATE sales SET value = quantity WHERE type = 'units'`);
}
// Drop legacy columns if they still exist (SQLite 3.35+)
for (const col of ['amount', 'quantity']) {
  if ((db.pragma('table_info(sales)') as Array<{ name: string }>).some(c => c.name === col)) {
    try { db.exec(`ALTER TABLE sales DROP COLUMN ${col}`); } catch { /* older SQLite */ }
  }
}

// Achievements: clean up legacy schema variants.
// Case 1: old schema had only `threshold` — add rule_type/rule_params and backfill.
// Case 2: both `threshold` + `rule_type` exist (DROP COLUMN failed on older SQLite) — recreate.
// Case 3: narrow CHECK(rule_type IN (...)) exists — recreate without it.
// All cases resolved by recreating the table when any legacy indicator is present.
const achColNames = (db.pragma('table_info(achievements)') as Array<{ name: string }>).map(c => c.name);
const achSchemaSql = (db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='achievements'`).get() as { sql: string } | undefined)?.sql ?? '';
const needsRebuild = achColNames.includes('threshold') || achSchemaSql.includes('rule_type IN (');

if (needsRebuild) {
  // If rule_type/rule_params don't exist yet, add them and backfill first
  // so we don't lose data during the rebuild.
  if (!achColNames.includes('rule_type')) {
    db.exec(`ALTER TABLE achievements ADD COLUMN rule_type TEXT NOT NULL DEFAULT 'threshold'`);
    db.exec(`ALTER TABLE achievements ADD COLUMN rule_params TEXT NOT NULL DEFAULT '{}'`);
    const old = db.prepare('SELECT id, threshold FROM achievements').all() as Array<{ id: number; threshold: number }>;
    for (const row of old) {
      db.prepare(`UPDATE achievements SET rule_params = ? WHERE id = ?`)
        .run(JSON.stringify({ percent: row.threshold }), row.id);
    }
  }
  // Recreate the table without the legacy threshold column and without any
  // hardcoded CHECK on rule_type, so new rule types are always supported.
  db.pragma('foreign_keys = OFF');
  db.exec(`
    CREATE TABLE achievements_new (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL UNIQUE,
      rule_type   TEXT NOT NULL,
      rule_params TEXT NOT NULL DEFAULT '{}'
    );
    INSERT INTO achievements_new SELECT id, name, rule_type, rule_params FROM achievements;
    DROP TABLE achievements;
    ALTER TABLE achievements_new RENAME TO achievements;
  `);
  db.pragma('foreign_keys = ON');
}

// Migration: create user_achievements if it doesn't exist yet (for existing DBs)
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
      achieved_at    TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, achievement_id)
    )
  `);
} catch { /* already exists */ }

// Migration: add stable i18n key column to achievements
try { db.exec(`ALTER TABLE achievements ADD COLUMN key TEXT NOT NULL DEFAULT ''`); } catch { /* already exists */ }
// Backfill keys for existing rows (only updates rows where key is still empty)
db.prepare(`UPDATE achievements SET key = 'goal_completed' WHERE id = 1 AND key = ''`).run();
db.prepare(`UPDATE achievements SET key = 'super_fast'     WHERE id = 2 AND key = ''`).run();
db.prepare(`UPDATE achievements SET key = 'big_money'      WHERE id = 3 AND key = ''`).run();
db.prepare(`UPDATE achievements SET key = 'lightning'      WHERE id = 4 AND key = ''`).run();

// Seed exactly 4 achievements.
// INSERT OR IGNORE is critical here — INSERT OR REPLACE would DELETE the existing row
// first (even with the same id), triggering ON DELETE CASCADE on user_achievements
// and wiping every user's earned achievements on every server restart.
db.prepare(`INSERT OR IGNORE INTO achievements (id, name, key, rule_type, rule_params) VALUES (?, ?, ?, ?, ?)`)
  .run(1, 'Goal Completed', 'goal_completed', 'threshold',    JSON.stringify({ percent: 100 }));
db.prepare(`INSERT OR IGNORE INTO achievements (id, name, key, rule_type, rule_params) VALUES (?, ?, ?, ?, ?)`)
  .run(2, 'Super Fast!',    'super_fast',     'early_ratio',  JSON.stringify({ required_percent: 100, time_ratio: 0.5 }));
db.prepare(`INSERT OR IGNORE INTO achievements (id, name, key, rule_type, rule_params) VALUES (?, ?, ?, ?, ?)`)
  .run(3, 'Big Money',      'big_money',      'monetary_min', JSON.stringify({ min_amount: 10000 }));
db.prepare(`INSERT OR IGNORE INTO achievements (id, name, key, rule_type, rule_params) VALUES (?, ?, ?, ?, ?)`)
  .run(4, 'Lightning',      'lightning',      'same_day',     JSON.stringify({ required_percent: 100 }));
// Remove any legacy achievements beyond id 4
db.prepare(`DELETE FROM achievements WHERE id > 4`).run();

export default db;
