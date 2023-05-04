const express = require("express");
const router = express.Router();

const Currency = require('../models/currencyModel');
const Timings = require("../models/timingModel");

router.post('/add-currency', (req, res) => {
    Currency.findOne({ currency: req.body.currency })
        .then((cur) => {
            if (cur) {
                res.json({
                    'status': 'success',
                    'msg': 'Already exists!'
                })
            } else {
                Currency.create(req.body)
                    .then((data) => {
                        if (data) {
                            res.json({
                                'status': 'success',
                                'msg': 'Currency added successfully!'
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
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-currencies', (req, res) => {
    Currency.find()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/edit-currency/:id', (req, res) => {
    Currency.findOneAndUpdate({ _id: req.params.id }, {
        currency: req.body.currency
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Currency updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'success',
            'msg': err.message
        }))
})

router.post('/delete-currency/:id', (req, res) => {
    Currency.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Currency deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/add-timings', (req, res) => {
    Timings.findOne()
        .then((data) => {
            if (data) {
                Timings.findOneAndUpdate({ _id: data._id }, {
                    timings: req.body.timings,
                    totalHours: req.body.totalHours,
                    minWorkHours: req.body.minWorkHours,
                    maxBreakHours: req.body.maxBreakHours
                })
                    .then((time) => {
                        if (time) {
                            res.json({
                                'status': 'success',
                                'msg': 'Timings updated successfully!'
                            })
                        }
                    })
                    .catch((err) => res.json({
                        'status': 'error',
                        'msg': err.message
                    }))
            } else {
                Timings.create(req.body)
                    .then((time) => {
                        if (time) {
                            res.json({
                                'status': 'success',
                                'msg': "Timings added successfully!"
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
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/fetch-timings', (req, res) => {
    Timings.findOne()
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

module.exports = router;