const Notification = require('./../models/notifications');
const User = require('./../models/user');
const UserNotification = require('../models/userNotifications');

async function checkNotificationExistence(articleID) {
    //const { id } = req.params;
    console.log(`Check notification existence invoked for ${articleID}`)
    try {
      const notification = await Notification.findOne({ articleID: articleID });
      return notification !== null;
    } catch (error) {
      console.error(error);
      return false;
    }
}

async function createNotification(notificationData) {
    console.log(`create notification invoked for ${notificationData}`)
    try {
        const newNotification = new Notification(notificationData);
        const savedNotification = await newNotification.save();
        console.log("Saved new notification")

        // Find all users and create new UserNotification documents
        const users = await User.find();
        const userNotifications = users.map(user => ({
            userId: user._id,
            notificationId: savedNotification._id,
        }));
        
        await UserNotification.insertMany(userNotifications);

        console.log(`Saved Notification: ${savedNotification}`);
        return savedNotification;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating notification');
    }
}

async function getUserNotifications(req, res) {
    const {id} = req.params;
    
    console.log("Received userId:", id); // Add this debugging log

    try {
        const userNotifications = await UserNotification.find({ userId: id }).populate('notificationId');
        console.log("UserNotifications found:", userNotifications); // Keep the debugging log
        const notifications = userNotifications.map(userNotification => userNotification.notificationId);
        console.log("Notifications extracted:", notifications); // Keep the debugging log

        return res.status(200).json({ notifications });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Server error occurred'
      });
    }
  }
  
module.exports = { checkNotificationExistence, createNotification, getUserNotifications };