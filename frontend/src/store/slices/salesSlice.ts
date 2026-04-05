import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesService } from '../../services/salesService';
import { extractApiError } from '../apiError';
import type { CreateSaleResponse } from '../../services/salesService';
import type { Sale } from '../../types';

interface SalesState { sales: Sale[]; loading: boolean; error: string | null; }
const initialState: SalesState = { sales: [], loading: false, error: null };

export const fetchSales = createAsyncThunk('sales/fetch', async (userId: number, { rejectWithValue }) => {
  try { return await salesService.getByUser(userId); }
  catch (err: unknown) { return rejectWithValue(extractApiError(err, 'Failed to fetch sales')); }
});

export const createSale = createAsyncThunk<
  CreateSaleResponse,
  { type: 'monetary'; value: number; description?: string; date: string }
  | { type: 'units'; value: number; description?: string; date: string }
>(
  'sales/create',
  async (data, { rejectWithValue }) => {
    try { return await salesService.create(data); }
    catch (err: unknown) { return rejectWithValue(extractApiError(err, 'Failed to create sale')); }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSales.fulfilled, (state, action) => { state.loading = false; state.sales = action.payload; })
      .addCase(fetchSales.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createSale.fulfilled, (state, action) => { state.sales.unshift(action.payload.sale); });
  },
});

export default salesSlice.reducer;
