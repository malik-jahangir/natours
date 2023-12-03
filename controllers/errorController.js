/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const AppError = require('../utils/appError');

const handleDuplicateFileDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field values: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('Error 💥', err);
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      sendErrorProd(handleCastErrorDB(err), res);
    } else if (err.code === 11000) {
      sendErrorProd(handleDuplicateFileDB(err), res);
    } else if (err.name === 'ValidationError') {
      sendErrorProd(handleValidationErrorDB(err), res);
    } else if (err.name === 'JsonWebTokenError') {
      sendErrorProd(handleJWTError(), res);
    } else if (err.name === 'TokenExpiredError') {
      sendErrorProd(handleJWTExpiredError(), res);
    } else {
      sendErrorProd(err, res);
    }
  }
};
