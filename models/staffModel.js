const mongoose = require('mongoose');

const staffModel = mongoose.Schema(
    {
        staffID: {
            type: String,
            required: true,
            unique: true
        },
        fullname: {
            type: String,
            required: true
        },
        father: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        dob: {
            type: String,
            required: true
        },
        qualification: {
            type: String,
            required: true
        },
        course: {
            type: String,
        },
        address: {
            type: String,
            default: '-'
        },
        mobile: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        joiningDate: {
            type: String,
            required: true
        },
        salary: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        salaryType: {
            type: String,
            required: true
        },
        pfp: {
            type: String
        },
        CompanyMail: {
            type: String
        },
        skills: {
            type: String,
            default: '-'
        },
        ExpLevel: {
            type: String,
            required: true
        },
        ExpYears: {
            type: String
        },
        status: {
            type: String,
            default: 'active'
        },
        permissions: [{
            type: Object,
            default: ''
        }],
    },
    {
        timestamps: true
    }
)

const Staff = mongoose.model('staff', staffModel);
module.exports = Staff;