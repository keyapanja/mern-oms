const express = require('express');
const Project = require('../models/projectModel');
const Attendance = require('../models/attendanceModel');
const Holidays = require('../models/holidayModel');
const router = express.Router();

router.get('/projects', async (req, res) => {
    var date = new Date();
    var dates = [];
    for (let index = 0; index < 12; index++) {
        var firstDay = new Date(date.getFullYear(), index, 1);
        var lastDay = new Date(date.getFullYear(), index + 1, 0);
        const obj = {
            firstDay: firstDay,
            lastDay: lastDay
        }
        dates.push(obj);
    }
    if (dates.length > 0) {
        var results = [];
        for (let i = 0; i < dates.length; i++) {
            const item = dates[i];
            const count = await Project.find({
                createdAt: {
                    $gte: item.firstDay,
                    $lte: item.lastDay
                }
            })
            results.push(count.length)
        }

        res.json(results);
    }
})

router.get('/monthly-attendance/:staffID', (req, res) => {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    Attendance.count({
        staffID: req.params.staffID,
        createdAt: {
            $gte: new Date(firstDay),
            $lte: new Date(lastDay)
        }
    })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/yearly-attendance/:staffID', (req, res) => {

})

module.exports = router;