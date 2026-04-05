import bcrypt from 'bcryptjs';
import db from './index';
import { AchievementService } from '../services/achievement.service';

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
  const userId = user.lastInsertRowid as number;

  const now      = new Date();
  const year     = now.getFullYear();
  const month    = now.getMonth() + 1; // 1-based

  // Current month window
  const currLastDay = new Date(year, month, 0).getDate();
  const currStart   = fmt(year, month, 1);
  const currEnd     = fmt(year, month, currLastDay);

  // Previous month window
  const prevMonth   = month === 1 ? 12 : month - 1;
  const prevYear    = month === 1 ? year - 1 : year;
  const prevLastDay = new Date(prevYear, prevMonth, 0).getDate();
  const prevStart   = fmt(prevYear, prevMonth, 1);
  const prevEnd     = fmt(prevYear, prevMonth, prevLastDay);

  const insertGoal = db.prepare(
    'INSERT INTO goals (user_id, title, target, type, unit_label, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertSale = db.prepare(
    'INSERT INTO sales (user_id, type, value, date, description) VALUES (?, ?, ?, ?, ?)'
  );

  // ── Past goals (previous month) ──────────────────────────────────────────
  // Goal: $8 000 revenue target — ends at 106% → awards "Goal Completed" only (total < $10 000 avoids Big Money)
  insertGoal.run(userId, 'Monthly Revenue Target',    8000, 'monetary', '$',     prevStart, prevEnd);
  // Goal: 30 product demos — ends at 60% (incomplete)
  insertGoal.run(userId, 'Product Demos Delivered',   30,    'units',    'demos', prevStart, prevEnd);

  // Monetary sales for past goal (total $8 500 → 106% of $8 000, but < $10 000)
  ([ [2, 1500, 'Enterprise deal'],
     [7, 2000, 'Quarterly contract'],
     [12, 1800, 'Partnership agreement'],
     [18, 2000, 'Renewal package'],
     [24, 1200, 'Consulting project'],
  ] as [number, number, string][]).forEach(([day, value, desc]) =>
    insertSale.run(userId, 'monetary', value, fmt(prevYear, prevMonth, day), desc)
  );

  // Unit sales for past goal (total 18 / 30)
  ([ [5,  5, 'Product walkthrough sessions'],
     [10, 4, 'Client onboarding demos'],
     [17, 6, 'Prospect presentations'],
     [25, 3, 'Follow-up demos'],
  ] as [number, number, string][]).forEach(([day, value, desc]) =>
    insertSale.run(userId, 'units', value, fmt(prevYear, prevMonth, day), desc)
  );

  // ── Active goals (current month) ─────────────────────────────────────────
  // Goal: $15 000 revenue target — seeded at ~68% ($10 200)
  insertGoal.run(userId, 'Monthly Revenue Target',    15000, 'monetary', '$',       currStart, currEnd);
  // Goal: 25 new clients — seeded at 80% (20/25), under 100% to avoid Super Fast!
  insertGoal.run(userId, 'New Client Acquisitions',   25,    'units',    'clients', currStart, currEnd);

  // Monetary sales for active goal (total $10 200, spread across first 5 days)
  ([ [1, 2500, 'Software license deal'],
     [2, 1800, 'Support package renewal'],
     [3, 3200, 'New enterprise account'],
     [4, 1500, 'Add-on services'],
     [5, 1200, 'Consulting hours'],
  ] as [number, number, string][]).forEach(([day, value, desc]) =>
    insertSale.run(userId, 'monetary', value, fmt(year, month, day), desc)
  );

  // Unit sales for active goal (total 20 / 25 = 80%, under 100% to avoid Super Fast!)
  ([ [1, 5, 'Trade show leads converted'],
     [2, 4, 'Inbound referrals closed'],
     [3, 5, 'Cold outreach closed'],
     [4, 3, 'Partnership referrals'],
     [5, 3, 'Demo to close'],
  ] as [number, number, string][]).forEach(([day, value, desc]) =>
    insertSale.run(userId, 'units', value, fmt(year, month, day), desc)
  );

  // Award achievements based on seeded data
  AchievementService.checkAndAward(userId);

  console.log('Seed complete.');
  console.log('  User:  ana@example.com / password123');
  console.log(`  Past:  Monthly Revenue (106% ✓ Goal Completed only) | Product Demos (60%)`);
  console.log(`  Active: Monthly Revenue (~68%) | New Client Acquisitions (80%)`);
}

function fmt(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

seed();

