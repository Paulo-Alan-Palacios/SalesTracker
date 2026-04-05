import { GoalModel } from '../models/goal.model';
import { SaleModel } from '../models/sale.model';

export const ProgressService = {
  getProgress(userId: number) {
    const goals = GoalModel.findByUserId(userId);
    const today = new Date().toISOString().split('T')[0];

    return goals.map(goal => {
      const total = SaleModel.sumValueByTypeAndDateRange(userId, goal.type, goal.start_date, goal.end_date);

      const percentage = goal.target > 0 ? (total / goal.target) * 100 : 0;
      const isActive = today >= goal.start_date && today <= goal.end_date;

      return {
        goalId: goal.id,
        title: goal.title,
        target: goal.target,
        type: goal.type,
        unit_label: goal.unit_label,
        start_date: goal.start_date,
        end_date: goal.end_date,
        total,
        percentage: Math.round(percentage * 100) / 100,
        isActive,
      };
    });
  },
};
