const express = require('express');
const courtAttendanceRouter = express.Router();
const {
    getAllCourtAttendances, 
    getCourtAttendanceById, 
    createCourtAttendance, 
    updateCourtAttendance, 
    deleteCourtAttendance, 
    getCourtAttendanceByUserId, 
    getCourtAttendanceByCity, 
    getCourtAttendancesByDate, 
    createCourtAttendanceWidget
} = require('../controllers/courtAttendanceController');

courtAttendanceRouter.route('/')
  .get(getAllCourtAttendances)
  .post(createCourtAttendance);

courtAttendanceRouter.route('/widget')
  .post(createCourtAttendanceWidget);

courtAttendanceRouter.route('/:id')
  .get(getCourtAttendanceById)
  .patch(updateCourtAttendance)
  .delete(deleteCourtAttendance);

courtAttendanceRouter.route('/user/:user_id')
  .get(getCourtAttendanceByUserId);

courtAttendanceRouter.route('/city/:city')
  .get(getCourtAttendanceByCity);

courtAttendanceRouter.route('/courtSitting/:courtSitting_ID/attendanceDate/:year/:month/:day')
  .get(getCourtAttendancesByDate);

module.exports = courtAttendanceRouter;