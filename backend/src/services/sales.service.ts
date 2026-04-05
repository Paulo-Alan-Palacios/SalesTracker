import { SaleModel } from '../models/sale.model';
import type { Sale, SaleType } from '../models/sale.model';
import { UserModel } from '../models/user.model';
import { NotFoundError } from '../errors/AppError';

export const SalesService = {
  createSale(data: { user_id: number; type: SaleType; value: number; description?: string; date: string }): Sale {
    return SaleModel.create(data);
  },
  getSalesByUser(userId: number): Sale[] {
    const user = UserModel.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return SaleModel.findByUserId(userId);
  },
};
