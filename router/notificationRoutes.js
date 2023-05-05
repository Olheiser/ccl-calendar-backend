const express = require('express');
const notificationRouter = express.Router();

const {getUserNotifications} = require('./../controllers/notificationController')

notificationRouter.route('/user/:id')
    .get(getUserNotifications)


module.exports = notificationRouter;
// import the controllers

// notificationRouter.route('')
//  .get(controller)

// module.exports = notificationRouter