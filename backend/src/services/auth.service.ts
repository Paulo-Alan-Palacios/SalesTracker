import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { UnauthorizedError } from '../errors/AppError';
import { config } from '../config';

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
    const user = UserModel.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');

    const token = jwt.sign(
      { sub: user.id, email: user.email, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn, algorithm: 'HS256' } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  },
};
