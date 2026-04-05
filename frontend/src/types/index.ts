export interface User {
  id: number;
  username: string;
  email: string;
}

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

export type GoalType = 'monetary' | 'units';

/** A single achievement from the catalog, merged with the user's unlock status */
export interface AchievementStatus {
  id: number;
  name: string;
  key: string;
  rule_type: string;
  rule_params: Record<string, number>;
  unlocked: boolean;
  achieved_at: string | null;
}

export interface GoalProgress {
  goalId: number;
  title: string;
  target: number;
  type: GoalType;
  unit_label: string;
  start_date: string;
  end_date: string;
  total: number;
  percentage: number;
  isActive: boolean;
}

