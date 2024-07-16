const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(4).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
 
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const phoneSignInSchema = Joi.object({
  phone: Joi.string().regex(/^\d{10}$/).required(),  
});

const otpVerificationSchema = Joi.object({
  phone: Joi.string().regex(/^\d{10}$/).required(), 
  code: Joi.string().required(),
});


const otpEmailVerificationSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required()
});
module.exports = { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema, phoneSignInSchema, otpVerificationSchema ,otpEmailVerificationSchema};