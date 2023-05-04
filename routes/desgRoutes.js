const e = require("express");
const express = require("express");
const router = express.Router();

const Desgs = require('../models/desgModel');

router.get('/', (req, res) => {
    Desgs.aggregate([
        {
            $lookup:
            {
                from: "departments",
                localField: "dept_Id",
                foreignField: "dept_Id",
                as: "dept"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/add', (req, res) => {
    const desgArr = req.body.desgArr;

    var newArr = [];
    desgArr.forEach(element => {
        const obj = {
            'dept_Id': req.body.dept_Id,
            'name': element
        }
        newArr.push(obj);
    })

    Desgs.insertMany(newArr)
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Designations added successfully!'
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

router.post('/delete/:id', (req, res) => {
    Desgs.findByIdAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Designation deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/edit/:id', (req, res) => {
    Desgs.findOneAndUpdate({ _id: req.params.id },
        {
            name: req.body.name,
            dept_Id: req.body.dept_Id
        })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Designation updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

module.exports = router;