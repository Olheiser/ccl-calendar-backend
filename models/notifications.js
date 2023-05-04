const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: String, 
    title: String,
    message: String,
    url: String, 
    createdAt: {
        type: Date,
        default: Date.now,
    },
    metadata: mongoose.Schema.Types.Mixed,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;