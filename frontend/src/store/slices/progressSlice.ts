import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/progressService';
import { extractApiError } from '../apiError';
import type { GoalProgress, AchievementStatus } from '../../types';

interface ProgressState {
  goals: GoalProgress[];
  achievements: AchievementStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = { goals: [], achievements: [], loading: false, error: null };

export const fetchProgress = createAsyncThunk('progress/fetch', async (userId: number, { rejectWithValue }) => {
  try { return await progressService.getByUser(userId); }
  catch (err: unknown) { return rejectWithValue(extractApiError(err, 'Failed to fetch progress')); }
});

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading      = false;
        state.goals        = action.payload.goals;
        state.achievements = action.payload.achievements;
      })
      .addCase(fetchProgress.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default progressSlice.reducer;
