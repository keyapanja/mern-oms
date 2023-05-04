const mongoose = require('mongoose');

const timingModel = mongoose.Schema(
    {
        timings: {
            type: Object,
            default: null
        },
        totalHours: {
            type: String,
            default: 0
        },
        minWorkHours: {
            type: String,
            default: 0
        },
        maxBreakHours: {
            type: String,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Timings = mongoose.model('timings', timingModel);
module.exports = Timings;