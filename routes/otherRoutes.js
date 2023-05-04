const express = require('express');
const Holiday = require('../models/holidayModel');
const router = express.Router();

const Notices = require('../models/noticeModel');
const Staff = require('../models/staffModel');
const Notifications = require('../models/notificationModel');

router.post('/post-notice', (req, res) => {
    Notices.create(req.body)
        .then((data) => {
            if (data) {

                Staff.find({ status: 'active' })
                    .then((staff) => {
                        var notifArr = [];
                        staff.forEach((item) => {
                            const Obj = {
                                to: item.staffID,
                                by: 'Admin',
                                type: 'Notice',
                                msg: "There's a new notice for you!",
                                icon: 'fa fa-bullhorn bg-info rounded-pill',
                                link: '/staff/notices'
                            };
                            notifArr.push(Obj);
                        })
                        if (notifArr.length > 0) {
                            Notifications.insertMany(notifArr);
                        }
                    })

                res.json({
                    'status': 'success',
                    'msg': 'Notice posted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-notices', (req, res) => {
    Notices.aggregate([
        {
            $sort: {
                createdAt: -1
            }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.get('/recent-notices', (req, res) => {
    Notices.aggregate([
        {
            $sort: {
                createdAt: -1
            }
        }
    ]).limit(5)
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/delete-notice/:id', (req, res) => {
    Notices.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Notice deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/edit-notice/:id', (req, res) => {
    Notices.findOneAndUpdate({ _id: req.params.id }, {
        title: req.body.title,
        desc: req.body.desc
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Notice updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/add-holiday', (req, res) => {
    Holiday.create(req.body)
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Holiday added successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/fetch-holidays', (req, res) => {
    Holiday.aggregate([
        {
            $sort: { createdAt: -1 }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/edit-holiday/:id', (req, res) => {
    Holiday.findOneAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        from: req.body.from,
        to: req.body.to,
        total: req.body.total
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Holiday updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/delete-holiday/:id', (req, res) => {
    Holiday.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Holiday deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

module.exports = router;