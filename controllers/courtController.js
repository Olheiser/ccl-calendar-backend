const Court = require('../models/courts');

exports.getCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    return res.status(200).json(courts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};
//note
exports.createCourt = async (req, res) => {
  try {
    const court = new Court(req.body);
    const savedCourt = await court.save();
    return res.status(201).json(savedCourt);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.getCourtById = async (req, res) => {
  const { id } = req.params;

  try {
    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    return res.status(200).json(court);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.updateCourt = async (req, res) => {
  const { id } = req.params;

  try {
    const court = await Court.findByIdAndUpdate(id, req.body, { new: true });

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    return res.status(200).json(court);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.deleteCourt = async (req, res) => {
  const { id } = req.params;

  try {
    const court = await Court.findByIdAndDelete(id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    return res.status(200).json({ message: 'Court deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};