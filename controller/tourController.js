const Tour = require('./../models/tourModel');
const APIFeature = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour Id: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Failed',
//       message: 'Tour Not found',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,duration,price,summary,difficulty,ratingAverage';
  next();
};

exports.getAllTour = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await feature.query;

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})
  console.log(tour);
  if (!tour) {
    return next(new appError('No tour found for that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save();

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // BY USING MONGOOSE
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new appError('No tour found for that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// BY USING FS MODULE
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// for (field in req.body.data) {
//   tour[field] = req.body.data[field];
//   console.log(field);
// }
// fs.writeFile(
//   `${__dirname}/../dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   }
// );

exports.deleteTour = catchAsync(async (req, res, next) => {
  // USING mongoose

  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new appError('No tour found for that ID', 404));
  }
  res.status(204).json({
    status: 'Success',
    data: null
  });
});

//  USING FS MODULE
// const id = req.params.id * 1;
// let i;
// function findindex() {
//   for (i = 0; i < tours.length; i++) {
//     if (tours[i].id === id) {
//       return i;
//     } else {
//       i++;
//     }
//   }
// }
// const index = findindex();
// tours.splice(index, 1);
// fs.writeFile(
//   `${__dirname}/../dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(204);
//   }
// );

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalTour: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTour: { $sum: 1 },
        name: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { totalTour: 1 }
    }
    // {
    //   $limit: 6
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan
    }
  });
});
