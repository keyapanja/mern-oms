const mongoose = require('mongoose');

const notificationModel = mongoose.Schema(
    {
        to: {
            type: String,
            required: true
        },
        by: {
            type: String,
            required: true
        },
        msg: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        icon: {
            type: String
        },
        link: {
            type: String
        },
        status: {
            type: String,
            default: 'delivered'
        },
        ondate: {
            type: String,
            default: new Date().toISOString().slice(0, 10)
        }
    },
    {
        timestamps: true
    }
)

const Notifications = mongoose.model('notifications', notificationModel);
module.exports = Notifications;