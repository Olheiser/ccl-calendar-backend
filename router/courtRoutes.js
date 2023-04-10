const express = require('express');
const router = express.Router();

const { getCourts, createCourt, getCourtById, updateCourt, deleteCourt } = require('./../controllers/courtController');

router.route('/')
  .get(getCourts)
  .post(createCourt);

router.route('/:id')
  .get(getCourtById)
  .patch(updateCourt)
  .delete(deleteCourt);

module.exports = router;