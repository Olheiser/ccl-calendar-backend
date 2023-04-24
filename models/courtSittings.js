const mongoose = require('mongoose');
const dayjs = require('dayjs');

const courtSittingSchema = new mongoose.Schema({
  court_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
  }, 
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  courtDate: {
    type: Date
  },
  courtAttendances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourtAttendance'
  }]
});

courtSittingSchema.pre('save', function(next) {
  const date = dayjs(`${this.year}-${this.month}-${this.day}`, 'DD-MM-YY');
  this.courtDate = date.toDate();
  next();
});


courtSittingSchema.virtual('date').get(function() {
  return new Date(this.year, this.month - 1, this.day);
});

courtSittingSchema.virtual('courtAttendanceDetails', {
  ref: 'CourtAttendance',
  localField: '_id',
  foreignField: 'courtSitting_ID',
  //localField: '_id',
  //foreignField: 'courtSitting_ID',
  justOne: false,
  populate: { path: 'user_ID', select: 'first_name last_name' }
})

// const CourtSitting = mongoose.model('CourtSitting', courtSittingSchema);
const CourtSittingSaskatchewan = mongoose.model('Saskatchewan_CourtSitting', courtSittingSchema);


// Choosing to separate month, day, year into different fields since it makes grouping data by specific parts of the date easier. 

module.exports = CourtSittingSaskatchewan;