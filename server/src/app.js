const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const env = require('./config/env');
const { verifyCsrf } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { sendSuccess, sendError } = require('./utils/responseEnvelope');

// Route modules
const authRoutes = require('./routes/v1/authRoutes');
const roadmapRoutes = require('./routes/v1/roadmapRoutes');
const topicRoutes = require('./routes/v1/topicRoutes');
const progressRoutes = require('./routes/v1/progressRoutes');
const reportRoutes = require('./routes/v1/reportRoutes');
const adminRoutes = require('./routes/v1/adminRoutes');

const app = express();

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Security headers
app.use(helmet());

// CORS configuration supporting authenticated cookies
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Double-submit CSRF verification for state-changing HTTP requests
app.use(verifyCsrf);

// API v1 Health Check
app.get('/api/v1/health', (req, res) => {
  return sendSuccess(res, 200, {
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mount API v1 Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1/roadmaps', topicRoutes);   // topic detail lives under /roadmaps/:slug/topics/:topicKey
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);

// Catch-all 404 for unhandled API routes
app.all('/api/*', (req, res) => {
  return sendError(
    res,
    404,
    'NOT_FOUND',
    `Cannot ${req.method} ${req.originalUrl}. The requested endpoint does not exist.`,
    undefined,
    req
  );
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
