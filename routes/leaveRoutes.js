const express = require('express');
const router = express.Router();

const Leaves = require('../models/leaveModel');
const Notification = require('../models/notificationModel');

router.post('/apply-new-leave', (req, res) => {
    Leaves.create(req.body)
        .then((data) => {
            if (data) {
                Notification.create({
                    to: 'Admin',
                    by: req.body.staffID,
                    msg: `${req.body.staffName} has requested for leaves.`,
                    icon: 'fa fa-scroll bg-secondary rounded-pill',
                    type: 'Leave',
                    link: '/admin/leave-management'
                })

                res.json({
                    'status': 'success',
                    'msg': 'Your leave request has been sent to the administrators!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-leaves/:staffID', (req, res) => {
    Leaves.find({ staffID: req.params.staffID })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/edit-leave/:id', (req, res) => {
    Leaves.findOneAndUpdate({ _id: req.params.id }, {
        start: req.body.start,
        end: req.body.end,
        reason: req.body.reason,
        total: req.body.total
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Leave request updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-all-leaves', (req, res) => {
    Leaves.aggregate([
        {
            $sort: { createdAt: -1 }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/accept-request/:id', (req, res) => {
    Leaves.findOneAndUpdate({ _id: req.params.id }, { status: 'Approved' })
        .then((data) => {
            if (data) {
                Notification.create({
                    to: data.staffID,
                    by: 'Admin',
                    msg: 'Your leave request has been accepted!',
                    icon: 'fa fa-check-to-slot bg-success rounded-pill',
                    type: "Leave",
                    link: '/staff/leaves'
                })

                res.json({
                    'status': 'success',
                    'msg': 'Leave request accepted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/reject-request/:id', (req, res) => {
    Leaves.findOneAndUpdate({ _id: req.params.id }, { status: 'Rejected' })
        .then((data) => {
            if (data) {
                Notification.create({
                    to: data.staffID,
                    by: 'Admin',
                    msg: 'Your leave request has been rejected!',
                    icon: 'fa fa-ban bg-danger rounded-pill',
                    type: "Leave",
                    link: '/staff/leaves'
                })

                res.json({
                    'status': 'success',
                    'msg': 'Leave request rejected successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

module.exports = router