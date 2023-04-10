const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  fax: {
    type: String,
    required: true
  }
});

const Court = mongoose.model('Court', courtSchema);

module.exports = Court;