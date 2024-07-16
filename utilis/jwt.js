const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Auth = require('../models/Auth');
dotenv.config();

const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone
    
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const verifyRefreshToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await Auth.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const generatePasswordResetToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email
  };
  return jwt.sign(payload, process.env.PASSWORD_RESET_SECRET, { expiresIn: '1h' });
};

const verifyPasswordResetToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
    return decoded;
  } catch (err) {
    throw err;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken, generatePasswordResetToken, verifyPasswordResetToken };
