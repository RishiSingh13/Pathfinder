require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Strict validation of secrets in production
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : 'dev_jwt_secret_antigravity_curated_workspace_2026_local');
const COOKIE_SECRET = process.env.COOKIE_SECRET || (isProduction ? null : 'dev_cookie_secret_antigravity_curated_workspace_2026_local');

if (isProduction) {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be set and at least 32 characters long in production.');
  }
  if (!COOKIE_SECRET || COOKIE_SECRET.length < 32) {
    throw new Error('FATAL: COOKIE_SECRET must be set and at least 32 characters long in production.');
  }
  if (JWT_SECRET === COOKIE_SECRET) {
    throw new Error('FATAL: JWT_SECRET and COOKIE_SECRET must be distinct secrets.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('FATAL: MONGODB_URI must be configured in production.');
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roadmap_platform',
  USE_IN_MEMORY_DB_IF_LOCAL_FAILS: process.env.USE_IN_MEMORY_DB_IF_LOCAL_FAILS !== 'false',
  JWT_SECRET,
  COOKIE_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 150,
};
