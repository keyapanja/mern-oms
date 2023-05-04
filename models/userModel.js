const mongoose = require('mongoose');

const userModel = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            required: true,
            default: 'staff'
        },
        email: {
            type: String,
        },
        staffID: {
            type: String
        }
    }
)

const User = mongoose.model("users", userModel);
module.exports = User;