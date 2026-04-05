import api from './api';
import type { Sale, AchievementStatus } from '../types';

type CreateSalePayload =
  | { type: 'monetary'; value: number; description?: string; date: string }
  | { type: 'units';    value: number; description?: string; date: string };

export interface CreateSaleResponse {
  sale: Sale;
  newAchievements: Pick<AchievementStatus, 'id' | 'name' | 'key'>[];
}

export const salesService = {
  create: (data: CreateSalePayload): Promise<CreateSaleResponse> =>
    api.post<CreateSaleResponse>('/ventas', data).then(r => r.data),
  getByUser: (userId: number): Promise<Sale[]> =>
    api.get<Sale[]>(`/ventas/${userId}`).then(r => r.data),
};
