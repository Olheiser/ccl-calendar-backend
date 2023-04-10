const mongoose = require('mongoose');

const courtAttendanceSchema = new mongoose.Schema({
  courtSitting_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourtSitting',
    required: true,
  },
  user_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },/*
  court_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },*/
  court_type: {
    type: String,
    enum: ['Provincial Court', 'Kings Bench', 'Appeal Court'],
  },
  timePeriod: {
    type: String,
    enum: ['AM', 'PM', 'All Day'],
    required: true
  },
  time: String,
  courtRoom: Number,
  prosecutor: String,
  description: String,
});


courtAttendanceSchema.index({ courtSitting_ID: 1, date: 1 });
console.log(mongoose.modelNames());

// Ensure that each court attendance document has a unique combination of courtSitting_ID and user_ID
courtAttendanceSchema.index({ courtSitting_ID: 1, user_ID: 1 }, { unique: true });

// Before saving a court attendance document, ensure that the associated courtSitting and user documents exist
courtAttendanceSchema.pre('save', async function (next) {
  try {
    const courtSitting = await mongoose.model('CourtSitting').findById(this.courtSitting_ID);
    if (!courtSitting) {
      throw new Error('Invalid courtSitting_ID');
    }

    const user = await mongoose.model('Users').findById(this.user_ID);
    if (!user) {
      throw new Error('Invalid user_ID');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Before updating a court attendance document, ensure that the associated user is the same as the authenticated user
courtAttendanceSchema.pre('update', async function (next) {
  try {
    const courtAttendance = await this.model.findById(this.getFilter().id);
    if (!courtAttendance) {
      throw new Error('Invalid courtAttendance ID');
    }

    if (courtAttendance.user_ID.toString() !== this.getUpdate().$set.user_ID) {
      throw new Error('User is not authorized to update this court attendance document');
    }

    next();
  } catch (error) {
    next(error);
  }
});

const CourtAttendance = mongoose.model('CourtAttendance', courtAttendanceSchema);

module.exports = CourtAttendance;