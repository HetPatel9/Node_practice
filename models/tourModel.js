const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name have to max 50 character'],
      minlength: [10, 'Name have to minimum 10 character']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty must be: easy ,medium or hard'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'rating should be less then 5'],
      min: [1, 'rating should be more then 1']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        messsage: 'Discount price should be less then price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have Summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    timepass: String,
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

// mongoose middleware { also called hooks}
// DOCUMENT MIDDLEWARE - works on .save() and .create() operation
tourSchema.pre('save', function (next) {
  this.timepass = this.name.replaceAll(' ', '-');
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('saving the documet......');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log('Document saved and here it is ..........');
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // this.find({ secretTour: { $ne: true } });
  // console.log('your query is processing............');
  this.time = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query processing time ${Date.now() - this.time}`);
  next();
});

// AGGREGATE MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
