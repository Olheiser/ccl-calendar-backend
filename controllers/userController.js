const User = require('./../models/user');

exports.getUsers = async (req, res) => {
  try {
    console.log('We are here');
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.getUserByEmail = (req, res) => {
  const {email} = req.params;
  User.findOne({email});
}

exports.findUserByEmail = (email) => {
  return User.findOne({ email });
}

exports.createNewUser = (values) => {
  return new User(values).save().then((user) => user.toObject());
}

// Use this to confirm whether user is logged in or not
exports.getUserBySessionToken = (req, res) => {
  const {sessionToken} = req.params;
  UserModel.findOne({
    'authentication.sessionToken': sessionToken,
  });
}

exports.getUserById = (req, res) => {
  const {id} = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: 'Server error occurred'
      });
    });
};

exports.createUser = (req, res) => {
  const user = new User(req.body);
  user.save()
    .then((user) => res.json(user))
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: 'Server error occurred'
      });
    });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { values } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
  /*
  User.findByIdAndUpdate(id, values, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: 'Server error occurred'
      });
    });*/
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      return res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: 'Server error occurred'
      });
    });
};

exports.fetchUserWithNotifications = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate({
      path: 'userNotifications',
      populate: {
        path: 'notificationId',
        model: 'Notification',
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
}