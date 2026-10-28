import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import routes from './routes/index.js';
import asyncHandler from './utils/asyncHandler.js';

const app = express();

const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'https://expansetracker-htbx.vercel.app',
]
  .filter(Boolean)
  .flatMap((o) => String(o).split(','))
  .map((o) => o.trim().replace(/\/$/, ''));

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  })
);
app.use(express.json({ limit: '100kb' }));

// Every API request makes sure MongoDB is connected (reuses the live connection).
app.use(
  '/api',
  asyncHandler(async (_req, _res, next) => {
    await connectDB(env.mongoUri);
    next();
  })
);

app.use('/api', apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);

export default app;