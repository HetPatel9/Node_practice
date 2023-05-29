const express = require('express');
const morgan = require('morgan');

const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log('hii from 1st middleware');
  next();
});

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

app.all('*', (req, res, next) => {
  // const err = new Error(`Page ${req.originalUrl} not Found`);
  // err.status = 'failed';
  // err.statusCode = 404;
  next(new appError(`Page ${req.originalUrl} not Found`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
