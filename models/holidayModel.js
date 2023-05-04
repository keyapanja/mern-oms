const mongoose = require('mongoose');

const holidayModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Holiday = mongoose.model('holidays', holidayModel);
module.exports = Holiday;