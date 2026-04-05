import db from '../db';

export type GoalType = 'monetary' | 'units';

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  target: number;
  type: GoalType;
  unit_label: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const GoalModel = {
  findByUserId(userId: number): Goal[] {
    return db.prepare('SELECT * FROM goals WHERE user_id = ?').all(userId) as Goal[];
  },
  create(data: {
    user_id: number;
    title: string;
    target: number;
    type: GoalType;
    unit_label: string;
    start_date: string;
    end_date: string;
  }): Goal {
    const result = db.prepare(
      'INSERT INTO goals (user_id, title, target, type, unit_label, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(data.user_id, data.title, data.target, data.type, data.unit_label, data.start_date, data.end_date);
    return db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid) as Goal;
  },
};
