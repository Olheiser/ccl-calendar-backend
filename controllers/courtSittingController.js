const CourtSitting = require('./../models/courtSittings');
const dayjs = require('dayjs');

const formatDate = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/*exports.getCourtSittings = async (req, res) => {
  try {
    const courtSittings = await CourtSitting.find().populate('court_ID', 'city province');
    return res.status(200).json(courtSittings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

// Retrieve all court sittings (cities) for a particular date
exports.getCourtSittingByDate = async (req, res) => {
  const courtSittings = await CourtSitting.find({ date: date });
}*/

exports.getCourtSittings = async (req, res) => {
  try {
    const courtSittings = await CourtSitting.find()
    .populate({
      path: 'courtAttendances',
      model: 'CourtAttendance',
      populate: {
        path: 'user_ID',
        model: 'Users',
        select: 'first_name last_name'
      }
    })
    .populate('court_ID');

      // Log the populated courtAttendance documents
      courtSittings.forEach(sitting => {
        console.log(sitting.courtAttendances);
      });
    return res.status(200).json(courtSittings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.getAllCourtSittingsByCourtID = async (req, res) => {
  try {
    const {court_ID} = req.params;
    const courtSittings = await CourtSitting.find({ court_ID: court_ID })
    res.status(200).json(courtSittings);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
  }
}

// Retrieve all court sittings (cities) for a particular date
exports.getCourtSittingByDate = async (req, res) => {
  const courtSittings = await CourtSitting.find({ date: date });
}

exports.getAllCourtSittingsSortedByDate = async (req, res) => {
  try {
    const courtSittings = await CourtSitting.find();

    // Create an object to store courtSittings grouped by date
    const courtSittingsByDate = {};

    // Iterate through all courtSittings and group by date
    courtSittings.forEach((sitting) => {
      const date = formatDate(sitting.courtDate);
      console.log(date);
      if (!courtSittingsByDate[date]) {
        courtSittingsByDate[date] = [sitting];
      } else {
        courtSittingsByDate[date].push(sitting);
      }
    });

    return res.status(200).json(courtSittingsByDate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.createCourtSitting = async (req, res) => {
  try {
    const courtSitting = new CourtSitting(req.body);
    const savedCourtSitting = await courtSitting.save();
    return res.status(201).json(savedCourtSitting);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.getCourtSittingById = async (req, res) => {
  const { id } = req.params;

  try {
    const courtSitting = await CourtSitting.findById(id)
      .populate({
        path: 'courtAttendances',
        model: 'CourtAttendance',
        populate: {
          path: 'user_ID',
          model: 'Users',
          select: 'first_name last_name'
        }
      })
      .populate('court_ID');
      
    if (!courtSitting) {
      return res.status(404).json({ message: 'Court sitting not found' });
    }
    console.log(dayjs(courtSitting.courtDate).format("DD-MM-YY"));
    return res.status(200).json(courtSitting);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.updateCourtSitting = async (req, res) => {
  const { id } = req.params;

  try {
    const courtSitting = await CourtSitting.findByIdAndUpdate(id, req.body, { new: true }).populate('court_ID', 'city province');

    if (!courtSitting) {
      return res.status(404).json({ message: 'Court sitting not found' });
    }

    return res.status(200).json(courtSitting);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.deleteCourtSitting = async (req, res) => {
    const { id } = req.params;
  
    try {
      const courtSitting = await CourtSitting.findByIdAndDelete(id);
  
      if (!courtSitting) {
        return res.status(404).json({ message: 'Court sitting not found' });
      }
  
      return res.status(204).json({ message: 'Court sitting deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
  };

  exports.deleteAllCourtSittings = async (req, res) => {
    try {
      await CourtSitting.deleteMany({});
      console.log("Deleted all court sittings");
      return res.status(204).json({ message: 'All court sittings deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
  };