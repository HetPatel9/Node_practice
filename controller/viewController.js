const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.timepass }).populate({
    path: 'views',
    fields: 'review rating user'
  });
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour
  });
});
