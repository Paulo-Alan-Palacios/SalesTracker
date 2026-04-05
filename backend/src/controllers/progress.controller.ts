import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProgressService } from '../services/progress.service';
import { AchievementModel } from '../models/achievement.model';
import { NotFoundError } from '../errors/AppError';

// NOTE: GET /progreso/:userId originally returned only goal progress.
// GET /logros/user/:userId was a separate endpoint returning achievement unlock status.
// Both have been combined here to match the design document requirement:
// "GET /progreso/:userId — Get current progress, goal, and unlocked achievements"
export const ProgressController = {
  getProgress(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const userId = parseInt(String(req.params.userId), 10);
      if (isNaN(userId)) throw new NotFoundError('Invalid user id');
      const goals        = ProgressService.getProgress(userId);
      const achievements = AchievementModel.findByUserId(userId);
      res.json({ goals, achievements });
    } catch (err) {
      next(err);
    }
  },
};
