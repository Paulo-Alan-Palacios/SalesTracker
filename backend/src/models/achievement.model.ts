import db from '../db';

// --- Rule parameter shapes (one per rule_type) ---
export interface ThresholdParams      { percent: number }
export interface EarlyCompletionParams { required_percent: number; days_before: number }
export interface OvershootParams      { percent: number }
export interface EarlyRatioParams     { required_percent: number; time_ratio: number }
export interface MonetaryMinParams    { min_amount: number }
export interface SameDayParams        { required_percent: number }

export type RuleType = 'threshold' | 'early_completion' | 'overshoot' | 'early_ratio' | 'monetary_min' | 'same_day';
export type RuleParams = ThresholdParams | EarlyCompletionParams | OvershootParams | EarlyRatioParams | MonetaryMinParams | SameDayParams;

export interface Achievement {
  id: number;
  name: string;
  key: string;
  rule_type: RuleType;
  rule_params: RuleParams;
}

/** Achievement merged with the user's unlock status */
export interface AchievementStatus extends Achievement {
  unlocked: boolean;
  achieved_at: string | null;
}

/** Row shape as stored in SQLite (rule_params is raw JSON string) */
interface AchievementRow {
  id: number;
  name: string;
  key: string;
  rule_type: RuleType;
  rule_params: string;
}

function parseRow(row: AchievementRow): Achievement {
  try {
    return { ...row, rule_params: JSON.parse(row.rule_params) as RuleParams };
  } catch {
    throw new Error(`Achievement ${row.id} has malformed rule_params JSON: "${row.rule_params}"`);
  }
}

export const AchievementModel = {
  findAll(): Achievement[] {
    return (db.prepare('SELECT * FROM achievements ORDER BY id').all() as AchievementRow[]).map(parseRow);
  },

  findById(id: number): Achievement | undefined {
    const row = db.prepare('SELECT * FROM achievements WHERE id = ?').get(id) as AchievementRow | undefined;
    return row ? parseRow(row) : undefined;
  },

  /**
   * Returns all achievements with the user's unlock status merged in.
   * Unlocked achievements include their achieved_at timestamp.
   */
  findByUserId(userId: number): AchievementStatus[] {
    const rows = db.prepare(`
      SELECT a.id, a.name, a.key, a.rule_type, a.rule_params,
             CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END AS unlocked,
             ua.achieved_at
      FROM achievements a
      LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
      ORDER BY a.id
    `).all(userId) as (AchievementRow & { unlocked: number; achieved_at: string | null })[];

    return rows.map(r => ({
      ...parseRow(r),
      unlocked: r.unlocked === 1,
      achieved_at: r.achieved_at ?? null,
    }));
  },

  /**
   * Award an achievement to a user.
   * Uses INSERT OR IGNORE so duplicate awards are silently skipped.
   * Returns true if the achievement was newly granted, false if already existed.
   */
  awardToUser(userId: number, achievementId: number): boolean {
    const result = db.prepare(
      'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)'
    ).run(userId, achievementId);
    return result.changes > 0;
  },
};

