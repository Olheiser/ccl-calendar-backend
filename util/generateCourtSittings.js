const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const mongoose = require('mongoose');
const CourtSittingSaskatchewan = require('./../models/courtSittings');

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
  new mongoose.Types.ObjectId('6445e63028982bf3fb686af1'),
  new mongoose.Types.ObjectId('6445e68028982bf3fb686aff'),
  new mongoose.Types.ObjectId('6445e68528982bf3fb686b01'),
  new mongoose.Types.ObjectId('6445e68b28982bf3fb686b03'),
  new mongoose.Types.ObjectId('6445e68f28982bf3fb686b05'),
  new mongoose.Types.ObjectId('6445e63628982bf3fb686af3'),
  new mongoose.Types.ObjectId('6445e63a28982bf3fb686af5'),
  new mongoose.Types.ObjectId('6445e64128982bf3fb686af7'),
  new mongoose.Types.ObjectId('6445e67028982bf3fb686af9'),
  new mongoose.Types.ObjectId('6445e67528982bf3fb686afb'),
  new mongoose.Types.ObjectId('6445e67b28982bf3fb686afd'),
  new mongoose.Types.ObjectId('6445e28028982bf3fb686a72'),
  new mongoose.Types.ObjectId('6445e31528982bf3fb686a74'),
  new mongoose.Types.ObjectId('6445e31c28982bf3fb686a76'),
  new mongoose.Types.ObjectId('6445e32328982bf3fb686a78'),
  new mongoose.Types.ObjectId('6445e32a28982bf3fb686a7a'),
  new mongoose.Types.ObjectId('6445e33128982bf3fb686a7c'),
  new mongoose.Types.ObjectId('6445e33828982bf3fb686a7e'),
  new mongoose.Types.ObjectId('6445e34128982bf3fb686a80'),
  new mongoose.Types.ObjectId('6445e34728982bf3fb686a82'),
  new mongoose.Types.ObjectId('6445e34e28982bf3fb686a84'),
  new mongoose.Types.ObjectId('6445e35728982bf3fb686a86'),
  new mongoose.Types.ObjectId('6445e35f28982bf3fb686a88'),
  new mongoose.Types.ObjectId('6445e36628982bf3fb686a8a'),
  new mongoose.Types.ObjectId('6445e37228982bf3fb686a8c'),
  new mongoose.Types.ObjectId('6445e3a828982bf3fb686a8e'),
  new mongoose.Types.ObjectId('6445e3ae28982bf3fb686a90'),
  new mongoose.Types.ObjectId('6445e3b428982bf3fb686a92'),
  new mongoose.Types.ObjectId('6445e3be28982bf3fb686a94'),
  new mongoose.Types.ObjectId('6445e3c728982bf3fb686a96'),
  new mongoose.Types.ObjectId('6445e3cd28982bf3fb686a98'),
  new mongoose.Types.ObjectId('6445e3d528982bf3fb686a9a'),
  new mongoose.Types.ObjectId('6445e3d928982bf3fb686a9c'),
  new mongoose.Types.ObjectId('6445e3df28982bf3fb686a9e'),
  new mongoose.Types.ObjectId('6445e3e528982bf3fb686aa0'),
  new mongoose.Types.ObjectId('6445e3ea28982bf3fb686aa2'),
  new mongoose.Types.ObjectId('6445e3f128982bf3fb686aa4'),
  new mongoose.Types.ObjectId('6445e43728982bf3fb686aa6'),
  new mongoose.Types.ObjectId('6445e43d28982bf3fb686aa8'),
  new mongoose.Types.ObjectId('6445e44328982bf3fb686aaa'),
  new mongoose.Types.ObjectId('6445e44a28982bf3fb686aac'),
  new mongoose.Types.ObjectId('6445e45028982bf3fb686aae'),
  new mongoose.Types.ObjectId('6445e45828982bf3fb686ab0'),
  new mongoose.Types.ObjectId('6445e45d28982bf3fb686ab2'),
  new mongoose.Types.ObjectId('6445e46328982bf3fb686ab4'),
  new mongoose.Types.ObjectId('6445e48e28982bf3fb686ab8'),
  new mongoose.Types.ObjectId('6445e49728982bf3fb686aba'),
  new mongoose.Types.ObjectId('6445e49f28982bf3fb686abc'),
  new mongoose.Types.ObjectId('6445e4aa28982bf3fb686abe'),
  new mongoose.Types.ObjectId('6445e4ba28982bf3fb686ac1'),
  new mongoose.Types.ObjectId('6445e4c428982bf3fb686ac3'),
  new mongoose.Types.ObjectId('6445e4cf28982bf3fb686ac5'),
  new mongoose.Types.ObjectId('6445e4d728982bf3fb686ac7'),
  new mongoose.Types.ObjectId('6445e4e128982bf3fb686ac9'),
  new mongoose.Types.ObjectId('6445e4ea28982bf3fb686acb'),
  new mongoose.Types.ObjectId('6445e4f128982bf3fb686acd'),
  new mongoose.Types.ObjectId('6445e4f828982bf3fb686acf'),
  new mongoose.Types.ObjectId('6445e4fd28982bf3fb686ad1'),
  new mongoose.Types.ObjectId('6445e50428982bf3fb686ad3'),
  new mongoose.Types.ObjectId('6445e50928982bf3fb686ad5'),
  new mongoose.Types.ObjectId('6445e50f28982bf3fb686ad7'),
  new mongoose.Types.ObjectId('6445e51828982bf3fb686ada'),
  new mongoose.Types.ObjectId('6445e51f28982bf3fb686adc'),
  new mongoose.Types.ObjectId('6445e55b28982bf3fb686ade'),
  new mongoose.Types.ObjectId('6445e56d28982bf3fb686ae0'),
  new mongoose.Types.ObjectId('6445e57828982bf3fb686ae3'),
  new mongoose.Types.ObjectId('6445e58128982bf3fb686ae5'),
  new mongoose.Types.ObjectId('6445e58828982bf3fb686ae7'),
  new mongoose.Types.ObjectId('6445e59928982bf3fb686ae9'),
  new mongoose.Types.ObjectId('6445e5e528982bf3fb686aeb'),
  new mongoose.Types.ObjectId('6445e5ee28982bf3fb686aed'),
  new mongoose.Types.ObjectId('6445e5f428982bf3fb686aef'),
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
          const courtSitting = new CourtSittingSaskatchewan({
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