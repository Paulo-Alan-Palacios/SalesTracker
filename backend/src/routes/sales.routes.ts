import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';
import { requireAuth } from '../middleware/auth.middleware';
const router = Router();
router.post('/', requireAuth, SalesController.create);
router.get('/:userId', requireAuth, SalesController.getByUser);
export default router;
