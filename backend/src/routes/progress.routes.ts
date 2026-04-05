import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { requireAuth } from '../middleware/auth.middleware';
const router = Router();
router.get('/:userId', requireAuth, ProgressController.getProgress);
export default router;
