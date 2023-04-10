const express = require('express');
const {findUserByEmail, createNewUser} = require('../controllers/userController');
const {authentication, random} = require('../helpers/');

exports.register = async(req, res) => {
  try {
    const { email, password, first_name, last_name, province, city } = req.body;
    console.log(`Email: ${email} Password: ${password}`)
    // Check to see if any of these fields are missing
    if (!email || !password) {
      console.log("Email and or Pass is missing")
      return res.sendStatus(400);
    }
    
    // Check for existing user
    const existingUser = await findUserByEmail(email);
    console.log(`Existing User: ${existingUser}`)

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createNewUser({
      first_name,
      last_name,
      province, 
      city,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      }
    });

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await findUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);
    
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
/*
module.exports = {
  register,
  login
}*/