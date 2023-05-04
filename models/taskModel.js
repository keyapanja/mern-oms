const mongoose = require('mongoose');

const taskModel = mongoose.Schema(
    {
        staffID: {
            type: String,
            required: true
        },
        projectID: {
            type: String,
            required: true
        },
        task: {
            type: String,
            required: true
        },
        name: {
            type: String
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

const Tasks = mongoose.model('tasks', taskModel);
module.exports = Tasks