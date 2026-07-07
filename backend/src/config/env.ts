import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const backendRoot = path.resolve(currentDirectory, '../..');

const dotenvResult = dotenv.config({
  path: path.join(backendRoot, '.env'),
});
const envFile = dotenvResult.parsed ?? {};

function getEnvValue(key: string, fallback = '', preferEnvFile = false) {
  const value = preferEnvFile
    ? (envFile[key] ?? process.env[key])
    : (process.env[key] ?? envFile[key]);

  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  return value.trim();
}

export const env = {
  NODE_ENV: getEnvValue('NODE_ENV', 'development'),
  PORT: Number(getEnvValue('PORT', '5000')),
  MONGODB_URI: getEnvValue('MONGODB_URI', 'mongodb://127.0.0.1:27017/resumepilot_ai', true),
  FRONTEND_URL: getEnvValue('FRONTEND_URL', 'http://localhost:5173'),
  FRONTEND_ORIGINS: getEnvValue('FRONTEND_ORIGINS', ''),
  JWT_SECRET: getEnvValue('JWT_SECRET', '', true),
  JWT_EXPIRES_IN: getEnvValue('JWT_EXPIRES_IN', '1d', true),
};
