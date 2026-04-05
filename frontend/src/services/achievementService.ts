import api from './api';
import type { AchievementStatus } from '../types';

export const achievementService = {
  getByUser: (userId: number) =>
    api.get<AchievementStatus[]>(`/logros/user/${userId}`).then(r => r.data),
};

