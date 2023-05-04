const mongoose = require('mongoose');

const fileModel = mongoose.Schema(
    {
        name: {
            type: String,
        },
        path: {
            type: String,
        },
        projectID: {
            type: String,
        },
        uploadedBy: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const Files = mongoose.model('files', fileModel);
module.exports = Files;