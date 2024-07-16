class CustomError extends Error {
    constructor(message, statusCode , errors=[], ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.data = null;
      this.success = false;
       this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
    module.exports = CustomError;