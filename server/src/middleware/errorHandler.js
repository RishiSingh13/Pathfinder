const { sendError } = require('../utils/responseEnvelope');

function errorHandler(err, req, res, next) {
  // If response has already started streaming, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue || {});
    const field = keys[0] || 'field';
    return sendError(
      res,
      409,
      'CONFLICT',
      `A record with this ${field} already exists.`,
      [{ path: field, message: `Duplicate value: "${err.keyValue[field]}"` }],
      req
    );
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors || {}).map((path) => ({
      path,
      message: err.errors[path].message,
    }));
    return sendError(
      res,
      400,
      'VALIDATION_ERROR',
      'The submitted data failed validation requirements.',
      fields,
      req
    );
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(
      res,
      400,
      'INVALID_ID',
      `Invalid identifier format for field "${err.path}".`,
      [{ path: err.path, message: `Could not cast value "${err.value}" to ObjectId.` }],
      req
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(
      res,
      401,
      'UNAUTHENTICATED',
      'Invalid or expired session token. Please sign in again.',
      undefined,
      req
    );
  }

  // Default internal server error (never leak raw stack trace in responses)
  const isProd = process.env.NODE_ENV === 'production';
  console.error(`[Error] Request ID ${req.id || 'N/A'}:`, err);

  return sendError(
    res,
    err.status || 500,
    err.code || 'INTERNAL_ERROR',
    isProd ? 'An internal server error occurred.' : (err.message || 'An internal server error occurred.'),
    undefined,
    req
  );
}

module.exports = errorHandler;
