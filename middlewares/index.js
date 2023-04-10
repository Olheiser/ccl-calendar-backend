const express = require('express');
const { merge, get } = require('lodash');
const { getUserBySessionToken } = require('../models/user')

const isAuthenticated = async (req, res) => {
  try {
    const sessionToken = req.cookies['ANTONIO-AUTH'];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id');

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

module.exports = {
  isAuthenticated,
  isOwner
}