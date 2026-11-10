const { sendError } = require('../utils/responseEnvelope');

/**
 * Strips dangerous MongoDB operator keys ($gt, $where, etc.) and dot notation
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

function sanitizeInput(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}

function validateRegister(req, res, next) {
  const { email, password, displayName } = req.body || {};
  const fields = [];

  if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 2 || displayName.trim().length > 60) {
    fields.push({ path: 'displayName', message: 'Display name must be between 2 and 60 characters.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    fields.push({ path: 'email', message: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    fields.push({ path: 'password', message: 'Password must be at least 8 characters long.' });
  }

  if (fields.length > 0) {
    return sendError(
      res,
      400,
      'VALIDATION_ERROR',
      'Please correct the indicated fields and try again.',
      fields,
      req
    );
  }

  req.body.email = email.trim().toLowerCase();
  req.body.displayName = displayName.trim();
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const fields = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    fields.push({ path: 'email', message: 'Email address is required.' });
  }

  if (!password || typeof password !== 'string') {
    fields.push({ path: 'password', message: 'Password is required.' });
  }

  if (fields.length > 0) {
    return sendError(
      res,
      400,
      'VALIDATION_ERROR',
      'Email and password are required to sign in.',
      fields,
      req
    );
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

module.exports = {
  sanitizeInput,
  validateRegister,
  validateLogin,
};
