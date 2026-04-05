import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.', code: 'RATE_LIMITED' },
});

const router = Router();
router.post('/login', loginLimiter, AuthController.login);
export default router;
