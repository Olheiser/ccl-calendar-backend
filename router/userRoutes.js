const express = require('express');
const userRouter = express.Router();

const {getUsers, getUserById, createUser, updateUser, deleteUser, savePushSubscription, disablePushSubscription} = require('./../controllers/userController');
const { isAuthenticated, isOwner } = require('../middlewares/index');

userRouter.route('/')
  //.get(isAuthenticated, getUsers)
  .get(getUsers)
  .post(createUser);

userRouter.route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);
  //.get(isAuthenticated, getUserById)
  //.patch(isAuthenticated, isOwner, updateUser)
  //.delete(isAuthenticated, isOwner, deleteUser);

userRouter.route('/:id/push-subscription')
  .post(savePushSubscription)
  .patch(disablePushSubscription);

module.exports = userRouter;