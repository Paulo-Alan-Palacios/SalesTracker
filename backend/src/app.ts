import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import salesRoutes from './routes/sales.routes';
import progressRoutes from './routes/progress.routes';
import goalRoutes from './routes/goal.routes';
import achievementRoutes from './routes/achievement.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Global rate limit: 200 req / 15 min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/ventas', salesRoutes);
app.use('/progreso', progressRoutes);
app.use('/metas', goalRoutes);
app.use('/logros', achievementRoutes);

app.use(errorHandler);

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

export default app;
