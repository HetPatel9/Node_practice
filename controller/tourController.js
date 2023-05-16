const Tour = require('./../models/tourModel');

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

exports.getAllTour = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    console.log(req.query, queryObj);

    const tours = await Tour.find(queryObj);

    // const tours = await Tour.find({
    //   difficulty: 'easy',
    //   price: 3333
    // });

    // const tours = await Tour.find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('price')
    //   .equals(3333);

    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  // BY USING MONGOOSE
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data set'
    });
  }

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
};

exports.deleteTour = async (req, res) => {
  // USING mongoose
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }

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
};
