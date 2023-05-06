const mongoose = require('mongoose');

const projectModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        projectID: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        team: [{
            type: Object,
        }],
        budget: {
            type: String
        },
        currency: {
            type: String
        },
        client: {
            type: String
        },
        status: {
            type: String,
            default: 'Yet to Start'
        }
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model('projects', projectModel);
module.exports = Project;