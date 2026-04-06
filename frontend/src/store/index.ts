import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';
import progressReducer from './slices/progressSlice';

// NOTE: achievementSlice was removed when the /logros/user/:userId endpoint was
// merged into /progreso/:userId. Achievements now live in progress state.

// Esto se hizo para cumplir los requisitos especícos del entregable (3 endpoints)
export const store = configureStore({
  reducer: {
    auth:     authReducer,
    sales:    salesReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
