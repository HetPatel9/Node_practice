module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.status = err.status || 'ERROR';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    nessage: err.message
  });
  next();
};
