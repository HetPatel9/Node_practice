const express = require('express');

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// router.param('id', tourController.checkId);
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getToursStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);

router
  .route('/')
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
