import app from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';
import { env } from '../backend/config/env.js';

let dbPromise;

export default async function handler(req, res) {
  try {
    dbPromise ??= connectDB(env.mongoUri);
    await dbPromise;
  } catch (err) {
    dbPromise = undefined; // next request-la retry
    console.error('DB connect failed:', err.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
  return app(req, res);
}