const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).send(res.__('access_denied_no_token'));
  }
  
  if (token.startsWith('Bearer')) {
    token = token.split(' ')[1] || token.slice(6).trim(); // Check for both 'Bearer token' and 'Bearer<token>'
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send(res.__('invalid_token'));
  }
};

module.exports = authMiddleware;


//freeapi.app
