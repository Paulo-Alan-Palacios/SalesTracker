import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { GoalModel } from '../models/goal.model';
import { ValidationError, NotFoundError } from '../errors/AppError';

const createGoalSchema = z.object({
  title:      z.string().min(1),
  target:     z.number().positive(),
  type:       z.enum(['monetary', 'units']).default('monetary'),
  unit_label: z.string().min(1).default('units'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be YYYY-MM-DD'),
  end_date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be YYYY-MM-DD'),
}).refine(d => d.end_date > d.start_date, { message: 'end_date must be after start_date' });

export const GoalController = {
  create(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const result = createGoalSchema.safeParse(req.body);
      if (!result.success) throw new ValidationError(result.error.issues[0].message);

      // req.user is guaranteed by requireAuth middleware
      const userId = req.user!.sub;
      const { title, target, type, unit_label, start_date, end_date } = result.data;
      const goal = GoalModel.create({ user_id: userId, title, target, type, unit_label, start_date, end_date });
      res.status(201).json(goal);
    } catch (err) {
      next(err);
    }
  },

  getByUser(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const userId = parseInt(String(req.params.userId), 10);
      if (isNaN(userId)) throw new NotFoundError('Invalid user id');
      const goals = GoalModel.findByUserId(userId);
      res.json(goals);
    } catch (err) {
      next(err);
    }
  },
};
