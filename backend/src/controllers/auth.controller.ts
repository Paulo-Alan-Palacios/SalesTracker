import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ValidationError } from '../errors/AppError';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) throw new ValidationError(result.error.issues[0].message);
      const data = await AuthService.login(result.data.email, result.data.password);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
