const mongoose = require('mongoose');

const noticeModel = mongoose.Schema(
    {
        title: {
            type: String,
        },
        desc: {
            type: String,
            required: true
        },
        postedBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Notices = mongoose.model('notices', noticeModel);
module.exports = Notices;