import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import salesRoutes from './routes/sales.routes';
import progressRoutes from './routes/progress.routes';
import goalRoutes from './routes/goal.routes';
import achievementRoutes from './routes/achievement.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/ventas', salesRoutes);
app.use('/progreso', progressRoutes);
app.use('/metas', goalRoutes);
app.use('/logros', achievementRoutes);

app.use(errorHandler);

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

export default app;
