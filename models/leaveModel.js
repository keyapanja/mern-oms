const mongoose = require('mongoose');

const leaveModel = mongoose.Schema(
    {
        staffID: {
            type: String,
            required: true
        },
        staffName: {
            type: String,
        },
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            required: true,
        },
        total: {
            type: String,
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
)

const Leaves = mongoose.model('leaves', leaveModel);
module.exports = Leaves;