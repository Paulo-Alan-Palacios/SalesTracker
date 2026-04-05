import api from './api';
import type { User } from '../types';

interface LoginResponse { token: string; user: User; }

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),
};
