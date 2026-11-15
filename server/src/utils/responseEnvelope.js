/**
 * Unified API Response Envelopes
 * Ensures all API responses strictly adhere to the contract in Document 04 and 05:
 * Success: { success: true, data: ..., meta: ... }
 * Error:   { success: false, error: { code, message, fields, requestId } }
 */

function sendSuccess(res, statusCode = 200, data = {}, meta = undefined) {
  const payload = {
    success: true,
    data,
  };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

function sendError(res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'An unexpected error occurred.', fields = undefined, req = undefined) {
  const errorObj = {
    code,
    message,
  };
  if (fields && Array.isArray(fields) && fields.length > 0) {
    errorObj.fields = fields;
  }
  if (req && req.id) {
    errorObj.requestId = req.id;
  }
  return res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
