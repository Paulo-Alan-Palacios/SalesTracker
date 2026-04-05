import db from '../db';

export type SaleType = 'monetary' | 'units';

export interface Sale {
  id: number;
  user_id: number;
  type: SaleType;
  value: number;
  description: string | null;
  date: string;
  created_at: string;
}

export const SaleModel = {
  create(data: { user_id: number; type: SaleType; value: number; description?: string; date: string }): Sale {
    const result = db.prepare(
      'INSERT INTO sales (user_id, type, value, description, date) VALUES (?, ?, ?, ?, ?)'
    ).run(data.user_id, data.type, data.value, data.description ?? null, data.date);
    return db.prepare('SELECT * FROM sales WHERE id = ?').get(result.lastInsertRowid) as Sale;
  },
  findByUserId(userId: number): Sale[] {
    return db.prepare(
      'SELECT * FROM sales WHERE user_id = ? ORDER BY date DESC, created_at DESC'
    ).all(userId) as Sale[];
  },
  sumValueByTypeAndDateRange(userId: number, type: SaleType, startDate: string, endDate: string): number {
    const row = db.prepare(
      'SELECT COALESCE(SUM(value), 0) as total FROM sales WHERE user_id = ? AND type = ? AND date BETWEEN ? AND ?'
    ).get(userId, type, startDate, endDate) as { total: number };
    return row.total;
  },
};
