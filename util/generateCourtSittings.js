const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const CourtSitting = require('./models/courtSittings');

dayjs.extend(utc);

const MONGO_URL = 'mongodb+srv://npradmin:IwaAtlassaur49@nprobinson.7yutoqh.mongodb.net/CanadaCriminalLawyer';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB database')
}).catch((err) => {
  console.error(err);
  process.exit(1);
})

// Function to check if a day is a stat holiday in Canada
function checkIfStatHoliday(date) {
  const year = date.year();
  const month = date.month();
  const day = date.date();
  const weekday = date.day();

  // New Year's Day (Jan 1st)
  if (month === 0 && day === 1) {
    return true;
  }

  // Family Day (third Monday of February)
  if (month === 1 && weekday === 1 && day > 14 && day < 22) {
    return true;
  }

  // Good Friday (two days before Easter Sunday)
  if (date.isSame(dayjs([year, 2, 1]).add(58 + (year % 4 === 0 ? 1 : 0), 'day').subtract(1, 'day'))) {
    return true;
  }

  // Victoria Day (last Monday before May 25th)
  if (month === 4 && weekday === 1 && day > 17 && day < 25) {
    return true;
  }

  // Canada Day (July 1st)
  if (month === 6 && day === 1) {
    return true;
  }

  // Civic Holiday (first Monday of August)
  if (month === 7 && weekday === 1 && day < 8) {
    return true;
  }

  // Labour Day (first Monday of September)
  if (month === 8 && weekday === 1 && day < 8) {
    return true;
  }

  // Thanksgiving Day (second Monday of October)
  if (month === 9 && weekday === 1 && day > 7 && day < 15) {
    return true;
  }

  // Remembrance Day (Nov 11th)
  if (month === 10 && day === 11) {
    return true;
  }

  // Christmas Day (Dec 25th)
  if (month === 11 && day === 25) {
    return true;
  }

  // Boxing Day (Dec 26th)
  if (month === 11 && day === 26) {
    return true;
  }

  return false;
}

const courtIds = [
    new mongoose.Types.ObjectId('64267202275fdf945fad68dd'),
    new mongoose.Types.ObjectId('642672e0275fdf945fad68df'),
    new mongoose.Types.ObjectId('642672ff275fdf945fad68e1'),
    new mongoose.Types.ObjectId('64267314275fdf945fad68e3'),
    new mongoose.Types.ObjectId('6426731e275fdf945fad68e5'),
    new mongoose.Types.ObjectId('64267329275fdf945fad68e7'),
    new mongoose.Types.ObjectId('6426734a275fdf945fad68e9'),
    new mongoose.Types.ObjectId('64267356275fdf945fad68eb'),
    new mongoose.Types.ObjectId('64267367275fdf945fad68ed'),
    new mongoose.Types.ObjectId('64267371275fdf945fad68ef'),
    new mongoose.Types.ObjectId('64267379275fdf945fad68f1'),
    new mongoose.Types.ObjectId('6426738a275fdf945fad68f3'),
];

const populateCourtSitting = async () => {
    for (const courtId of courtIds) {
      const startDate = dayjs().startOf('week');
      const endDate = dayjs('2023-12-31'); // End date set to Dec 31, 2023
      let currentDay = startDate.clone();
  
      while (currentDay.isBefore(endDate)) {
        const dayOfWeek = currentDay.day();
        const isStatHoliday = checkIfStatHoliday(currentDay); // Implement this function to check if the current day is a stat holiday
  
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isStatHoliday) {
          const courtSitting = new CourtSitting({
            court_ID: courtId,
            month: currentDay.month() + 1,
            day: currentDay.date(),
            year: currentDay.year(),
          });
          await courtSitting.save();
        }
  
        currentDay = currentDay.add(1, 'day');
      }
    }
  }


populateCourtSitting();