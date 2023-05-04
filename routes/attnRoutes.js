const express = require("express");
const router = express.Router();

const Attendance = require('../models/attendanceModel');
const Staff = require('../models/staffModel');

router.post('/start-session', (req, res) => {
    Attendance.findOne({ staffID: req.body.staffID, date: new Date().toDateString() })
        .then((attn) => {
            if (attn) {
                res.json({
                    'status': 'error',
                    'msg': 'Your session is already running for today!'
                })
            }
            else {
                Attendance.create(req.body)
                    .then((data) => {
                        if (data) {
                            res.json({
                                'status': 'success',
                                'msg': 'Session started successfully!'
                            })
                        }
                    })
                    .catch((err) => res.json({
                        'status': 'error',
                        'msg': err.message
                    }))
            }
        })
})

router.get('/get-today-session/:staffID', (req, res) => {
    Attendance.findOne({ staffID: req.params.staffID, date: new Date().toDateString() })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/start-break/:staffID', (req, res) => {
    Attendance.findOne({ staffID: req.params.staffID, date: new Date().toDateString() })
        .then((data) => {
            if (data) {
                Attendance.findOneAndUpdate({ _id: data._id }, {
                    $push: {
                        breaks: req.body.breakTime
                    }
                })
                    .then((attn) => {
                        if (attn) {
                            res.json({
                                'status': 'success',
                                'msg': 'Break started... Enjoy your time!'
                            })
                        }
                    })
                    .catch((err) => res.json({
                        'status': 'error',
                        'status': err.message
                    }))
            } else {
                res.json({
                    'status': 'error',
                    'msg': "Please mark your today's attendance to start breaks too!"
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/end-break/:staffID', (req, res) => {
    Attendance.findOne({ staffID: req.params.staffID, date: new Date().toDateString() })
        .then((data) => {
            if (data) {
                Attendance.updateOne({ 'breaks.end': '' }, { 'breaks.$.end': req.body.end, 'breaks.$.total': req.body.total })
                    .then((attn) => {
                        if (attn) {
                            res.json({
                                'status': 'success',
                                'msg': 'Break ended... Welcome back!'
                            })
                        }
                    })
            } else {
                res.json({
                    'status': 'error',
                    'msg': "Please mark your today's attendance to start or end breaks too!"
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/stop-session/:staffID', (req, res) => {
    Attendance.findOne({ staffID: req.params.staffID, date: new Date().toDateString() })
        .then((data) => {
            if (data) {
                Attendance.findOneAndUpdate({ _id: data._id }, {
                    endTime: req.body.endTime,
                    totalWorkHours: req.body.totalHours
                })
                    .then((attn) => {
                        if (attn) {
                            res.json({
                                'status': 'success',
                                'msg': 'Session ended successfully... See you soon!'
                            })
                        }
                    })
                    .catch((err) => res.json({
                        'status': 'error',
                        'msg': err.message
                    }))
            }
        })
        .catch((err) => res.json({
            'status': 'success',
            'msg': err.message
        }))
})

router.get('/get-attendance/:staffID', (req, res) => {
    Attendance.aggregate([
        { $match: { staffID: req.params.staffID } },
        { $sort: { _id: -1 } }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/staff-attendance', (req, res) => {
    Staff.aggregate([
        {
            $match: { status: 'active' }
        },
        {
            $lookup: {
                from: 'attendances',
                localField: 'staffID',
                foreignField: 'staffID',
                as: 'attnList'
            }
        }
    ])
        .then((data) => {
            var newdata = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const obj = {
                    staffID: element.staffID,
                    name: element.fullname,
                    attnToday: element.attnList.find(item => item.date === new Date().toDateString())
                }
                newdata.push(obj);
            }
            res.json(newdata);
        })
        .catch((err) => res.json(err))
})

router.post('/filter-by-date/:staffID', (req, res) => {
    Attendance.find({
        staffID: req.params.staffID,
        createdAt: {
            $gte: new Date(req.body.from),
            $lt: new Date(new Date(req.body.to).getTime() + (3600 * 24 * 1000))
        }
    })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

module.exports = router;