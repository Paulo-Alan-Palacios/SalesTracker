import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { SalesService } from '../services/sales.service';
import { AchievementService } from '../services/achievement.service';
import { ValidationError, NotFoundError } from '../errors/AppError';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createSaleSchema = z.discriminatedUnion('type', [
  z.object({
    type:        z.literal('monetary'),
    value:       z.number().positive(),
    description: z.string().optional(),
    date:        z.string().regex(dateRegex, 'Date must be YYYY-MM-DD'),
  }),
  z.object({
    type:        z.literal('units'),
    value:       z.number().int().positive(),
    description: z.string().optional(),
    date:        z.string().regex(dateRegex, 'Date must be YYYY-MM-DD'),
  }),
]);

export const SalesController = {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = createSaleSchema.safeParse(req.body);
      if (!result.success) throw new ValidationError(result.error.issues[0].message);

      const sale = SalesService.createSale({ ...result.data, user_id: req.user!.sub });

      const awarded = AchievementService.checkAndAward(req.user!.sub);
      const newAchievements = awarded.map(a => ({ id: a.achievement.id, name: a.achievement.name, key: a.achievement.key }));

      res.status(201).json({ sale, newAchievements });
    } catch (err) {
      next(err);
    }
  },

  async getByUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(String(req.params.userId), 10);
      if (isNaN(userId)) throw new NotFoundError('Invalid user id');
      const sales = SalesService.getSalesByUser(userId);
      res.json(sales);
    } catch (err) {
      next(err);
    }
  },
};
