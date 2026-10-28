import app from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';
import { env } from '../backend/config/env.js';

export default async function handler(req, res) {
  try {
    await connectDB(env.mongoUri);
  } catch (err) {
    console.error('DB connect failed:', err.name, err.message);
    return res.status(500).json({
      message: 'Database connection failed',
      ...(env.debugErrors && { detail: `${err.name}: ${err.message}` }),
    });
  }
  // Safety net: Express routes are mounted under /api.
  if (!req.url.startsWith('/api')) req.url = `/api${req.url}`;
  return app(req, res);
}
