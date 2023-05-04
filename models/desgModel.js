const mongoose = require('mongoose');

const desgModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        dept_Id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Desgs = mongoose.model("designations", desgModel);
module.exports = Desgs;