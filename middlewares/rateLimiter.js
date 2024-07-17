const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 8 * 60 * 1000, // 8 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    msg: 'Too many requests, please try again later after  some time.'
  },
  headers: true,
});

module.exports = rateLimiter;
