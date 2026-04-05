import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
router.post('/', requireAuth, GoalController.create);
router.get('/:userId', requireAuth, GoalController.getByUser);
export default router;
