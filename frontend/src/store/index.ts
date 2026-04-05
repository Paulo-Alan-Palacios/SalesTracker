import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';
import progressReducer from './slices/progressSlice';

// NOTE: achievementSlice was removed when the /logros/user/:userId endpoint was
// merged into /progreso/:userId. Achievements now live in progress state.
export const store = configureStore({
  reducer: {
    auth:     authReducer,
    sales:    salesReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
