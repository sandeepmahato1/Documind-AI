const { sendError } = require('./errorHandler');

const validateRequiredFields = (fields = []) => {
  return (req, res, next) => {
    const missing = [];
    fields.forEach((field) => {
      if (!req.body || req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return sendError(res, 400, `Missing required request parameters: ${missing.join(', ')}`);
    }

    next();
  };
};

module.exports = {
  validateRequiredFields
};
