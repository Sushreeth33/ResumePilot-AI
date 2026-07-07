import type { CorsOptions } from 'cors';
import { env } from './env.js';

function parseOrigins(value: string) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://[::1]:5173',
  ...parseOrigins(env.FRONTEND_ORIGINS),
]);

export const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
};
