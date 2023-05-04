const express = require("express");
const router = express.Router();

const Dept = require('../models/deptModel');

router.get('/', (req, res) => {
    Dept.find()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/add', (req, res) => {
    Dept.findOne({ name: req.body.name }).then((depart) => {
        if (depart) {
            res.json({
                'status': 'error',
                'msg': 'The Department already exists!'
            })
        } else {
            Dept.create(req.body)
                .then((data) => {
                    if (data) {
                        res.json({
                            'status': 'success',
                            'msg': 'Department added successfully!'
                        })
                    } else {
                        res.json({
                            'status': 'error',
                            'msg': 'Something went wrong.. please try again later!'
                        })
                    }
                });
        }
    })
})

router.post('/delete/:id', (req, res) => {
    Dept.findByIdAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Department deleted successfully!'
                })
            } else {
                res.json({
                    'status': 'error',
                    'msg': 'Something went wrong..!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/edit/:dept_id', (req, res) => {
    Dept.findOneAndUpdate({ dept_Id: req.params.dept_id },
        { name: req.body.newName }
    )
        .then((data) => {
            if (data) {
                res.json({
                    "status": 'success',
                    'msg': 'Department updated successfully!'
                })
            }
            else {
                res.json({
                    'status': 'error',
                    'msg': 'Something went wrong..!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

module.exports = router;