const mongoose = require('mongoose');

const deptModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        dept_Id: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

const Dept = mongoose.model('departments', deptModel);
module.exports = Dept;