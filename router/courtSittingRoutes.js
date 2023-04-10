const express = require('express');
const courtSittingRouter = express.Router();
const {getCourtSittings, createCourtSitting, getCourtSittingById, getAllCourtSittingsByCourtID, updateCourtSitting, deleteCourtSitting, deleteAllCourtSittings, getAllCourtSittingsSortedByDate} = require('./../controllers/courtSittingController');

courtSittingRouter.route('/')
  .get(getCourtSittings)
  .post(createCourtSitting)
  .delete(deleteAllCourtSittings);

courtSittingRouter.route('/:id')
  .get(getCourtSittingById)
  .patch(updateCourtSitting)
  .delete(deleteCourtSitting);

courtSittingRouter.route('/date')
  .get(getAllCourtSittingsSortedByDate);

courtSittingRouter.route('/city/:court_ID')
  .get(getAllCourtSittingsByCourtID);

module.exports = courtSittingRouter;