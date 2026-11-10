const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { sendError } = require('../utils/responseEnvelope');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // 20 authentication requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'RATE_LIMITED',
      'Too many authentication attempts. Please wait 15 minutes and try again.',
      undefined,
      req
    );
  },
});

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'RATE_LIMITED',
      'Too many requests. Please slow down and try again shortly.',
      undefined,
      req
    );
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
