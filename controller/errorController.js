const appError = require('./../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new appError(message, 400);
};

const handleDuplicateFieldDB = (error) => {
  const message = `Duplicate field value:${error.keyValue.name}. Please use another Value `;
  return new appError(message, 400);
};

const handleValidatioDB = (error) => {
  console.log(error);
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid Input Data: ${errors.join('. ')}`;
  return new appError(message, 400);
};

const handleJWTError = () =>
  new appError('Invalid token. Please login again!', 401);

const handleJWTExpiresError = () =>
  new appError('Token Expires. Please login again!', 401);

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log('********ERROR********', err);
    res.status(500).json({
      status: 'Error',
      message: 'something went wrong'
    });
  }
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'ERROR';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError') error = handleValidatioDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiresError();
    sendErrorProd(error, res);
  }
  next();
};
