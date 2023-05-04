const express = require("express");
const router = express.Router();

const Dept = require('../models/deptModel');
const Desgs = require('../models/desgModel');
const Staff = require('../models/staffModel');
const Project = require('../models/projectModel');
const Notifications = require("../models/notificationModel");
const Holiday = require("../models/holidayModel");

router.get('/departments', (req, res) => {
    Dept.count()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.get('/designations', (req, res) => {
    Desgs.count()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.get('/staff', (req, res) => {
    Staff.count({ status: 'active' })
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.get('/projects', (req, res) => {
    Project.count()
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/unread-notifications/:staffID', (req, res) => {
    Notifications.count({ to: req.params.staffID, status: { $ne: 'read' } })
        .then((data) => res.json(data)
        )
        .catch((err) => res.json(err))
})

router.post('/holiday-by-dates', (req, res) => {
    Holiday.find()
        .then((data) => {
            data.forEach((item) => {
                var count = 0;
                if (new Date(item.from).getTime() >= new Date(req.body.start).getTime()) {
                    count += item.total;
                }
                res.json(count)
            })
        })
})

module.exports = router;