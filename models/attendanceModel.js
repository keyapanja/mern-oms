const mongoose = require('mongoose');

const attendanceModel = mongoose.Schema(
    {
        staffID: {
            required: true,
            type: String
        },
        date: {
            type: String,
            default: new Date().toDateString()
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            default: ''
        },
        breaks: [{
            type: Object,
            default: null
        }],
        totalWorkHours: {
            type: String,
            default: '00:00'
        }
    },
    {
        timestamps: true
    }
)

const Attendance = mongoose.model('attendance', attendanceModel);
module.exports = Attendance;