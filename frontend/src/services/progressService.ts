import api from './api';
import type { GoalProgress, AchievementStatus } from '../types';

export interface ProgressResponse {
  goals: GoalProgress[];
  achievements: AchievementStatus[];
}

export const progressService = {
  getByUser: (userId: number): Promise<ProgressResponse> =>
    api.get<ProgressResponse>(`/progreso/${userId}`).then(r => r.data),
};
