import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: { sub: number; email: string };
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing token', 'MISSING_TOKEN'));
  }
  const token = header.slice(7);
  try {
    // config.jwtSecret is validated at startup — no non-null assertion needed
    const payload = jwt.verify(token, config.jwtSecret) as unknown as { sub: number; email: string };
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN'));
  }
}
