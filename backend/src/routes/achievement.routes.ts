import { Router } from 'express';
import { AchievementController } from '../controllers/achievement.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/',              requireAuth, AchievementController.listAll);
router.get('/user/:userId',  requireAuth, AchievementController.listByUser);

export default router;
