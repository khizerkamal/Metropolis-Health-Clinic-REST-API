class AppError extends Error {
    constructor(message, statusCode) {
      // super(message) -> to call super class's constructor
      //which is Error and it accepts only message as an arg
      super(message)
  
      this.statusCode = statusCode
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
      this.isOperational = true
  
        Error.captureStackTrace(this,this.constructor);
    }
  }
  
  module.exports = AppError