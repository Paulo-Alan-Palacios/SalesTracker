import bcrypt from 'bcryptjs';
import db from './index';

function seed() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('ana@example.com');
  if (existing) {
    console.log('Already seeded, skipping.');
    return;
  }

  const hash = bcrypt.hashSync('password123', 12);
  const user = db.prepare(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
  ).run('Ana', 'ana@example.com', hash);

  const now = new Date();
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  // Monetary goal
  db.prepare(
    'INSERT INTO goals (user_id, title, target, type, unit_label, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(user.lastInsertRowid, 'Monthly Revenue Goal', 10000, 'monetary', 'units', startDate, endDate);

  // Units goal
  db.prepare(
    'INSERT INTO goals (user_id, title, target, type, unit_label, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(user.lastInsertRowid, 'Monthly Contracts Goal', 20, 'units', 'contracts', startDate, endDate);

  console.log('Seed complete: user ana@example.com / password123');
}

seed();
