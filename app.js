const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const sanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// Set security http header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again after an hour'
});
app.use('/api', limiter);

//  Body parsser,  reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSql query injection
app.use(sanitize());

// Data sanitization against XSS
app.use(xss());

//  parameter
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'difficulty',
      'maxGroupSize',
      'price'
    ]
  })
);

// Serving static file
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log('hii from 1st middleware');
  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

// ROUTERS
// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Page ${req.originalUrl} not Found`);
  // err.status = 'failed';
  // err.statusCode = 404;
  next(new appError(`Page ${req.originalUrl} not Found`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
