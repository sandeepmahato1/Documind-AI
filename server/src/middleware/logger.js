const morgan = require('morgan');

// Custom sanitized token format without sensitive body tokens
const loggerMiddleware = morgan((tokens, req, res) => {
  return [
    `[HTTP]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms',
    `- ${tokens['remote-addr'](req, res)}`
  ].join(' ');
});

module.exports = loggerMiddleware;
