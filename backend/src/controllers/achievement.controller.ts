import { Request, Response, NextFunction } from 'express';
import { AchievementModel } from '../models/achievement.model';
import { NotFoundError, ForbiddenError } from '../errors/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

export const AchievementController = {
  /** GET /logros — list all available achievements */
  listAll(_req: Request, res: Response, next: NextFunction): void {
    try {
      res.json(AchievementModel.findAll());
    } catch (err) {
      next(err);
    }
  },

  /** GET /logros/user/:userId — all achievements with unlock status for a user */
  listByUser(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const userId = parseInt(req.params['userId'] as string, 10);
      if (isNaN(userId)) throw new NotFoundError('Invalid user id');
      if (userId !== req.user!.sub) throw new ForbiddenError();
      res.json(AchievementModel.findByUserId(userId));
    } catch (err) {
      next(err);
    }
  },
};

