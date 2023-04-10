const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: String,
  user_type: {type: String, default: 'lawyer'},
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
    confirmed: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
  }
}, {
  timestamps: true
});

const User = mongoose.model("Users", userSchema);


module.exports = User;
// move these to your controller file maybe and export from there...
/* I don't know if a return statement ruins this.
const findUserByEmail = (email) => {
  return User.findOne({ email });
}

const createNewUser = (values) => {
  return new User(values).save().then((user) => user.toObject());
}

const getUserBySession = (sessionToken) => {
  return User.findOne({ 'authentication.sessionToken': sessionToken });
}

module.exports = {
  User,
  findUserByEmail,
  createNewUser,
  getUserBySession
}*/

/* select: false means that when you use a controller to fetch a user, you don't want to fetch the authentication object by accident */