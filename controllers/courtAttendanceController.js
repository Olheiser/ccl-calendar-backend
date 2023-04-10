const CourtAttendance = require('../models/courtAttendance');
const CourtSitting = require('../models/courtSittings');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

exports.getAllCourtAttendances = async (req, res) => {
    try {
      const courtAttendances = await CourtAttendance.find().populate('courtSitting_ID user_ID');
      return res.json(courtAttendances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
  };

exports.getCourtAttendancesByDate = async (req, res) => {
  const { year, month, day, courtSitting_ID } = req.params;
  const date = new Date(year, month - 1, day);
  try {
    const courtAttendances = await CourtAttendance.find({
      courtSitting_ID: courtSitting_ID,
      date: date,
    }).populate('user_ID');
    return res.json(courtAttendances);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred'});
  }
}

exports.getCourtAttendanceById = async (req, res) => {
    const { id } = req.params;

    try {
        const courtAttendance = await CourtAttendance.findById(id).populate('courtSitting_ID user_ID');
        if (!courtAttendance) {
        return res.status(404).json({ message: 'Court attendance not found' });
        }

        return res.json(courtAttendance);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

exports.getCourtAttendanceByUserId = async (req, res) => {
    const { user_id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
      const courtAttendance = await CourtAttendance.find({ user_ID: user_id })
      .populate([
        {
          path: 'courtSitting_ID',
          populate: [
            {
              path: 'court_ID',
            },
            {
              path: 'courtAttendances',
              model: 'CourtAttendance',
              populate: {
                path: 'user_ID',
                model: 'Users',
              },
            },
          ],
        },
        {
          path: 'user_ID',
        },
      ]);
  
      if (!courtAttendance || courtAttendance.length === 0) {
        return res.status(404).json({ message: 'No court attendance found for user' });
      }
  
      return res.status(200).json(courtAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
};

exports.getCourtAttendanceByCity = async (req, res) => {
    const { city } = req.params;
  
    try {
      //const courtSittings = await CourtSitting.find({ city: city }, '_id');
      const courtSittings = await CourtSitting.find()
        .populate('court_ID')
        .exec();
      console.log("--- courtSittings ---");
  
      const filteredCourtSittings = courtSittings.filter(courtSitting => {
        console.log(`courtSitting: ${courtSitting}`)
        console.log(`courtSitting.court_ID: ${courtSitting.court_ID}`)
        console.log(`courtSitting.court_ID.city: ${courtSitting.court_ID.city}`)
        return courtSitting.court_ID.city === city;
      });
      console.log("--- filteredCourtSittings ---");
      console.log(filteredCourtSittings);

      //if (!courtSittings || courtSittings.length === 0) {
      if (!filteredCourtSittings || filteredCourtSittings.length === 0) {
        return res.status(404).json({ message: 'No court sittings found for city' });
      }
  
      const courtSittingIds = filteredCourtSittings.map(courtSitting => courtSitting._id);
  
      const courtAttendance = await CourtAttendance.find({ courtSitting_ID: { $in: courtSittingIds } }).populate('courtSitting_ID user_ID');
  
      if (!courtAttendance || courtAttendance.length === 0) {
        return res.status(404).json({ message: 'No court attendance found for city' });
      }
  
      return res.status(200).json(courtAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error occurred' });
    }
};

/*
exports.createCourtAttendance = async (req, res) => {
    //const { courtSitting_ID, user_ID, prosecutor, description } = req.body;
  
    try {
      const courtAttendance = new CourtAttendance(req.body);
      const savedCourtAttendance = await courtAttendance.save();
      return res.status(201).json(savedCourtAttendance);
      //const courtAttendance = new CourtAttendance({ courtSitting_ID, user_ID, prosecutor, description });
      //await courtAttendance.save();
      //return res.json(courtAttendance);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({ message: 'Court attendance already exists' });
        }
      return res.sendStatus(500);
    }
};*/
exports.createCourtAttendance = async (req, res) => {
  try {
    const courtAttendance = new CourtAttendance(req.body);
    const savedCourtAttendance = await courtAttendance.save();
    const courtSitting = await CourtSitting.findByIdAndUpdate(
      courtAttendance.courtSitting_ID,
      { $push: { courtAttendances: savedCourtAttendance._id } },
      { new: true }
    );
    return res.status(201).json(savedCourtAttendance);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ message: 'Court attendance already exists' });
    }
    return res.sendStatus(500);
  }
};

exports.createCourtAttendanceWidget = async (req, res) => {
  try {
    const { date, city } = req.body;
    const dateObj = new Date(date);
    console.log(`Month: ${dateObj.getMonth() + 1} Day: ${ dateObj.getDate()} Year: ${dateObj.getFullYear()}`)

    // I think I need to find all courtsittings that match the month, day, year, populate the city field, then use the fineOne
    const courtSitting = await CourtSitting.findOne({
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate() + 1,
      year: dateObj.getFullYear()
    })
    .populate({
      path: 'court_ID',
      match: { city: city }
    })
    .exec();
    
    if (!courtSitting) {
      return res.status(400).json({ message: 'Court sitting not found' });
    }
    const courtAttendance = new CourtAttendance({
      courtSitting_ID: courtSitting._id,
      ...req.body
    });
    const savedCourtAttendance = await courtAttendance.save();
    const updatedCourtSitting = await CourtSitting.findByIdAndUpdate(
      courtSitting._id,
      { $push: { courtAttendances: savedCourtAttendance._id } },
      { new: true }
    );
    return res.status(201).json(savedCourtAttendance);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ message: 'Court attendance already exists' });
    }
    return res.sendStatus(500);
  }
};

exports.updateCourtAttendance = async (req, res) => {
    const { id } = req.params;
    const { courtSitting_ID, user_ID, prosecutor, description } = req.body;
  
    try {
      const courtAttendance = await CourtAttendance.findByIdAndUpdate(
        id,
        { courtSitting_ID, user_ID, prosecutor, description },
        { new: true },
      );
  
      if (!courtAttendance) {
        return res.status(404).json({ message: 'Court attendance not found' });
      }
  
      return res.json(courtAttendance);
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      if (error.name === 'MongoError' && error.code === 11000) {
        return res.status(400).json({ message: 'Court attendance already exists' });
      }
      return res.sendStatus(500);
    }
};

exports.deleteCourtAttendance = async (req, res) => {
    const { id } = req.params;
  
    try {
      const courtAttendance = await CourtAttendance.findById(id);

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      if (!courtAttendance) {
        return res.status(404).json({ message: 'Court attendance not found' });
      }
  
      await courtAttendance.deleteOne();
      return res.status(204).json({ message: 'Court attendance deleted' });
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };