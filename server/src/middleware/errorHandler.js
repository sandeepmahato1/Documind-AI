/**
 * Standard Success Response Helper
 */
const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Standard Error Response Helper & Centralized Middleware
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log] ${req.method} ${req.url} - Error:`, err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = process.env.NODE_ENV === 'development' ? err.stack : null;

  return sendError(res, statusCode, message, errors);
};

module.exports = {
  sendSuccess,
  sendError,
  errorHandler
};
