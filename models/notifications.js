const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: String, 
    title: String,
    message: String,
    url: String, 
    articleID: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;