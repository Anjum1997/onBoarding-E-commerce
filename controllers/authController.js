const Auth = require('../models/Auth');
const Otp = require('../models/Otp');
const client = require('../utilis/Twilio');
const bcrypt = require('bcryptjs');
const validationschema = require('../utilis/validation');
const jwt = require('../utilis/jwt');
const { sendOtpEmail, sendResetPasswordEmail } = require('../utilis/nodeMailer');
const CustomError = require('../utilis/customError');

// Register a new user  
exports.registerUser = async (req, res, next) => {
  const { error } = validationschema.registerSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));                                        
  }

  try {
    let user = await Auth.findOne({ email: req.body.email });
    if (user) {
      return next(new CustomError(res.__('user_exists'), 400));
    }

    user = new Auth({ ...req.body, isVerified: false });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otp = new Otp({ email: req.body.email, code: otpCode, expiresAt });
    await otp.save();

    await sendOtpEmail(req.body.email, otpCode);
    await user.save();

    return res.success({ msg: res.__('user_registered'), user });
  } catch (err) {
    next(err);
  }
};

// Verify email OTP
exports.verifyEmailOtp = async (req, res, next) => {
  const { error } = validationschema.otpEmailVerificationSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  try {
    const otp = await Otp.findOne({ email: req.body.email, code: req.body.code });
    if (!otp) {
      return next(new CustomError(res.__('invalid_otp'), 400));
    }

    if (otp.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otp._id });
      return next(new CustomError(res.__('expired_otp'), 400));
    }

    let user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError(res.__('user_not_found'), 400));
    }

 user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otp._id });
    
    return  res.success({ msg: res.__('email_verified'), user });
  } catch (err) {
    next(err);
  }
};

// Login a user
exports.loginUser = async (req, res, next) => {
  const { error } = validationschema.loginSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError(res.__('invalid_credentials'), 400));
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return next(new CustomError(res.__('invalid_credentials'), 400));
    }

    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    return res.success({ msg: res.__('login_successful'), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new CustomError(res.__('no_token_provided'), 401));
  }

  try {
    const user = await jwt.verifyRefreshToken(token);
    if (!user) {
      return next(new CustomError(res.__('invalid_refresh_token'), 403));
    }

    const accessToken = jwt.generateAccessToken(user);
    const newRefreshToken = jwt.generateRefreshToken(user);

    return res.success({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
  const { error } = validationschema.requestPasswordResetSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError(res.__('no_user_found'), 400));
    }

    const token = jwt.generatePasswordResetToken(user);
    await sendResetPasswordEmail(user.email, token);

    return  res.success({ msg: res.__('password_reset_email_sent', { email: user.email }), token });
  } catch (err) {
    next(err);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  const { error } = validationschema.resetPasswordSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  try {
    const decoded = await jwt.verifyPasswordResetToken(req.body.token);
    const user = await Auth.findById(decoded.id);

    if (!user) {
      return next(new CustomError(res.__('invalid_or_expired_token'), 400));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();

    return  res.success({ msg: res.__('password_reset_success') });
  } catch (err) {
    next(err);
  }
};

// Generate OTP and send it via SMS
exports.signInWithPhone = async (req, res, next) => {
  const { error } = validationschema.phoneSignInSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const otp = new Otp({ phone: req.body.phone, code: otpCode, expiresAt });
    await otp.save();

    await client.messages.create({
      body: res.__('otp_message', { code: otpCode }),
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${req.body.phone}` 
    });

    return  res.success({ msg: res.__('otp_sent') });
  } catch (err) {
    next(err);
  }
};

// Verify OTP and authenticate user
exports.verifyOtp = async (req, res, next) => {
  const { error } = validationschema.otpVerificationSchema.validate(req.body);

  if (error) {
    return next(new CustomError(res.__('validation_error', { message: error.details[0].message }), 400));
  }

  try {
    const otp = await Otp.findOne({ phone: req.body.phone, code: req.body.code });
    if (!otp) {
      return next(new CustomError(res.__('invalid_otp'), 400));
    }

    if (otp.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otp._id });
      return next(new CustomError(res.__('expired_otp'), 400));
    }

    let user = await Auth.findOne({ phone: req.body.phone });
    if (!user) {
      user = new Auth({ phone: req.body.phone, isVerified: true });
      await user.save();
    }

    const token = jwt.generateAccessToken(user);

    return  res.success({ msg: res.__('authentication_successful'), token });
  } catch (err) {
    next(err);
  }
};
