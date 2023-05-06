const express = require("express");
const router = express.Router();

const Staff = require('../models/staffModel');
const User = require("../models/userModel");

//Nodemailer for sending email
var nodemailer = require('nodemailer');

//Setting up Email Configuration
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testmailinfo9@gmail.com',
        pass: 'ezmsueahhmmxrvzg'
    }
});

router.get('/', (req, res) => {
    Staff.aggregate([
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
    Staff.create(req.body)
        .then((data) => {
            if (data) {

                var mailOptions = {
                    from: 'testmailinfo9@gmail.com',
                    to: req.body.email,
                    subject: `New Employee joined!`,
                    html: `Hello ${req.body.fullname}! <br><br> 
                    Welcome to the Webdomnet family! Your data has been added to our Office Management System. Now you can create your login credentials (username and password) as per your choice. 
                    <br> Please visit the following link to create your staff account on our system: <br>
                    ${process.env.FRONTEND + 'create-staff-account?email=' + req.body.email + '&staff_id=' + data.staffID}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.json({
                            "status": "error",
                            "msg": error
                        })
                    } else {
                        res.json({
                            "status": "success",
                            "msg": "The employee has been added and an email has been sent to the given email address!",
                        })
                    }
                });
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/delete/:id', (req, res) => {
    Staff.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            if (data) {
                User.findOneAndDelete({ staffID: data.staffID })
                    .then((newdata) => {
                        res.json({
                            'status': 'success',
                            'msg': 'Staff deleted successfully!'
                        })
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

router.post('/edit/:id', (req, res) => {
    Staff.findOneAndUpdate({ staffID: req.params.id }, {
        'fullname': req.body.fullname,
        'father': req.body.father,
        'gender': req.body.gender,
        'dob': req.body.dob,
        'qualification': req.body.qualification,
        'course': req.body.course,
        'address': req.body.address,
        'mobile': req.body.mobile,
        'email': req.body.email,
        'department': req.body.department,
        'designation': req.body.designation,
        'joiningDate': req.body.joiningDate,
        'salary': req.body.salary,
        'currency': req.body.currency,
        'salaryType': req.body.salaryType,
        'skills': req.body.skills,
        'ExpLevel': req.body.ExpLevel,
        'ExpYears': req.body.ExpYears
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Staff data updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-staff/:id', (req, res) => {
    Staff.aggregate([
        {
            $match: { staffID: req.params.id }
        },
        {
            $lookup: {
                from: 'departments',
                localField: 'department',
                foreignField: 'dept_Id',
                as: 'Dept'
            }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/add-company-mail/:id', (req, res) => {
    Staff.findOneAndUpdate({ staffID: req.params.id }, {
        CompanyMail: req.body.CompanyMail
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Email added successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/change-status/:id', (req, res) => {
    Staff.findOneAndUpdate({ staffID: req.params.id }, { status: req.body.status })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Status updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

// Import multer like the other dependencies
const multer = require('multer');

router.post('/change-pfp/:staffID', (req, res) => {

    const staffID = req.params.staffID;
    // Set multer file storage folder
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/uploads/staff/`);
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split("/")[1];
            cb(null, `${staffID}-pfp.${ext}`);
        },
    });

    const upload = multer({
        storage: multerStorage,
    }).single('pfp');

    Staff.findOne({ staffID: req.params.staffID })
        .then((data) => {
            upload(req, res, function (err) {
                if (err) {
                    res.json({
                        'status': 'error',
                        'msg': err.message
                    })
                } else {
                    Staff.findOneAndUpdate({ staffID: req.params.staffID }, {
                        pfp: res.req.file.filename
                    })
                        .then((data) => {
                            if (data) {
                                res.json({
                                    'status': 'success',
                                    'msg': 'Profile picture updated!'
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
})

router.post('/add-permissions/:staffID', (req, res) => {
    Staff.findOneAndUpdate({ staffID: req.params.staffID }, {
        $set: {
            permissions: []
        }
    })
        .then((data) => {
            if (data) {
                Staff.findOneAndUpdate({ staffID: req.params.staffID }, {
                    $push: {
                        permissions: {
                            $each: req.body.permissions
                        }
                    }
                })
                    .then((final) => {
                        if (final) {
                            res.json({
                                'status': 'success',
                                'msg': 'Permissions updated successfully!'
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

module.exports = router;