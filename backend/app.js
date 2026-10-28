import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import routes from './routes/index.js';

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
    origin: (origin, cb) => {
      // origin illa na (Postman, server-to-server) allow
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false); // error throw pannaama, CORS header illama block
    },
  })
);
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);

export default app;