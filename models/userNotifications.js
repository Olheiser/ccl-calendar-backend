const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
});

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

module.exports = UserNotification;