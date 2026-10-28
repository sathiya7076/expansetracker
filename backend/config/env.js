import 'dotenv/config';
import path from 'node:path';

const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 16) {
  console.error('JWT_SECRET must be at least 16 characters. Use a long random value.');
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  // Vercel's project folder is read-only; /tmp is the only writable place (and it is temporary).
  uploadDir: process.env.VERCEL ? '/tmp/uploads' : path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  // Temporary: set DEBUG_ERRORS=1 in Vercel to see the real error message in API responses.
  debugErrors: process.env.DEBUG_ERRORS === '1',
};
