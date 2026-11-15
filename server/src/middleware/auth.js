const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');
const User = require('../models/User');
const { sendError } = require('../utils/responseEnvelope');

const COOKIE_NAME = 'auth_token';
const CSRF_COOKIE = 'csrf_token';

const isProd = env.NODE_ENV === 'production';

/**
 * Sets signed HTTP-only auth cookie and client-readable double-submit CSRF cookie.
 */
function setAuthCookies(res, user) {
  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const csrfToken = crypto.randomBytes(24).toString('hex');

  // Secure HTTP-only authentication cookie
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Client-readable cookie for double-submit CSRF header matching
  res.cookie(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { token, csrfToken };
}

/**
 * Clears session and CSRF cookies on logout or account deletion.
 */
function clearAuthCookies(res) {
  const cookieOpts = {
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  };
  res.clearCookie(COOKIE_NAME, { ...cookieOpts, httpOnly: true });
  res.clearCookie(CSRF_COOKIE, { ...cookieOpts, httpOnly: false });
}

/**
 * Double-submit CSRF protection middleware for unsafe HTTP methods.
 */
function verifyCsrf(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Requests explicitly passing Bearer tokens in Authorization header bypass CSRF
  // because browsers do not attach custom authorization headers automatically
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // If session cookie is present on state-changing requests, enforce CSRF token header
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    const cookieCsrf = req.cookies[CSRF_COOKIE];
    const headerCsrf = req.headers['x-csrf-token'];

    if (!cookieCsrf || !headerCsrf || cookieCsrf !== headerCsrf) {
      return sendError(
        res,
        403,
        'CSRF_MISMATCH',
        'Invalid or missing CSRF token. Please refresh the page and try again.',
        undefined,
        req
      );
    }
  }

  next();
}

/**
 * Authentication requirement middleware.
 * Verifies JWT token and attaches fresh database user to req.user.
 */
async function requireAuth(req, res, next) {
  try {
    let token = req.cookies ? req.cookies[COOKIE_NAME] : null;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(
        res,
        401,
        'UNAUTHENTICATED',
        'Authentication required. Please sign in to access this resource.',
        undefined,
        req
      );
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      clearAuthCookies(res);
      return sendError(
        res,
        401,
        'UNAUTHENTICATED',
        'User account no longer exists or session has expired.',
        undefined,
        req
      );
    }

    req.user = user;
    next();
  } catch (err) {
    clearAuthCookies(res);
    return sendError(
      res,
      401,
      'UNAUTHENTICATED',
      'Session expired or invalid. Please sign in again.',
      undefined,
      req
    );
  }
}

/**
 * Optional authentication middleware for public endpoints that can personalize responses.
 */
async function optionalAuth(req, res, next) {
  try {
    let token = req.cookies ? req.cookies[COOKIE_NAME] : null;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid/expired token and proceed as guest
  }
  next();
}

/**
 * Role-based authorization middleware (verifies persisted user role).
 */
function requireRole(requiredRole) {
  return function (req, res, next) {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHENTICATED', 'Authentication required.', undefined, req);
    }

    if (req.user.role !== requiredRole) {
      return sendError(
        res,
        403,
        'FORBIDDEN',
        `Access denied. You must be an administrator to perform this action.`,
        undefined,
        req
      );
    }

    next();
  };
}

const requireAdmin = requireRole('admin');

module.exports = {
  COOKIE_NAME,
  CSRF_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  verifyCsrf,
  requireAuth,
  optionalAuth,
  requireRole,
  requireAdmin,
};
