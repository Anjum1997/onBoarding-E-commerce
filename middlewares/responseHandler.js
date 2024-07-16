const CustomError = require('../utilis/customError');

 const successHandler = (req, res, next) => {
    res.success = (data, message = 'Success', statusCode = 200) => {
      res.status(statusCode).json({
         success: true, 
         message,
          data
         });
    };
    next();
  };
  
  const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let data = err.data ||'no data is found';
    let errors = err.errors || [];
   
    if (err instanceof CustomError) {
      statusCode = err.statusCode;
      message = err.message;
      data = err.data;
      errors = err.errors;
    }
    res.status(statusCode).json({
      success: false,
      message,
      data,
      errors,
    });
  };
  module.exports = { successHandler, errorHandler };

