const express = require('express');
const Notifications = require('../models/notificationModel');
const router = express.Router();

router.get('/get-notifications/:staffID', (req, res) => {
    Notifications.aggregate([
        {
            $match: { to: req.params.staffID }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
                records: {
                    $push: "$$ROOT"
                },
            }
        },
        {
            $sort: { _id: -1 }
        }
    ])
        .then((data) => {
            res.json(data)
        })
        .catch((err) => res.json(err))
})

router.post('/mark-all-as-read/:staffID', (req, res) => {
    Notifications.updateMany({ to: req.params.staffID }, { status: 'read' })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'All the unseen notifications are marked as read!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/mark-as-read/:id', (req, res) => {
    Notifications.updateOne({ _id: req.params.id }, { status: 'read' })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

module.exports = router;