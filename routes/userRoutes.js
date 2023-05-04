const express = require("express");
const router = express.Router();

const User = require('../models/userModel');
const Staff = require('../models/staffModel');

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

router.get('/test-mail', (req, res) => {
    var mailOptions = {
        from: 'keya31002@gmail.com',
        to: 'webdomnet.keya@gmail.com',
        subject: 'Test Mail',
        body: 'Hey, this is a test mail!'
    }
    sendmail(mailOptions, function (err, reply) {
        if (err) {
            res.send(err)
        } else {
            res.send({
                "status": "success",
                "msg": "Mail sent!",
            })
        }
    });
})

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username })
        .then((data) => {
            if (data && data.userType === 'staff') {
                Staff.findOne({ staffID: data.staffID })
                    .then((staffData) => {
                        if (staffData.status === 'active') {
                            if (data.password === req.body.password || data.password === btoa(req.body.password)) {
                                res.json({
                                    'status': 'success',
                                    'msg': 'Successfully logged in!',
                                    'data': {
                                        'username': data.username,
                                        'usertype': data.userType,
                                        'staffID': data.staffID,
                                    }
                                })
                            } else {
                                res.json({
                                    'status': 'error',
                                    'msg': 'Wrong password!'
                                })
                            }
                        } else {
                            res.json({
                                'status': 'error',
                                'msg': 'Access restricted!'
                            })
                        }
                    })
            } else if (data && data.userType === 'admin') {
                if (data.password === req.body.password || data.password === btoa(req.body.password)) {
                    res.json({
                        'status': 'success',
                        'msg': 'Successfully logged in!',
                        'data': {
                            'username': data.username,
                            'usertype': data.userType,
                            'staffID': data.staffID,
                        }
                    })
                } else {
                    res.json({
                        'status': 'error',
                        'msg': 'Wrong password!'
                    })
                }
            } else {
                res.json({
                    'status': 'error',
                    'msg': 'User not found!'
                })
            }
        })
        .catch((err) => {
            res.json({
                'status': 'error',
                'message': err.message
            })
        })
})

router.get('/get-users', (req, res) => {
    User.find()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.get('/get-user-by-staffID/:staffID', (req, res) => {
    User.findOne({ staffID: req.params.staffID })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/create-account', (req, res) => {
    User.findOne({ username: req.body.username })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'error',
                    'msg': 'Username already exists... Please try another!'
                })
            } else {
                User.create(req.body)
                    .then((data) => {
                        var mailOptions = {
                            from: 'keya31002@gmail.com',
                            to: req.body.email,
                            subject: `new Staff Account Created!`,
                            html: `Hello! <br><br> 
                            Welcome to the Webdomnet family! Your staff account has been created successfully! 
                            <br> Here are your login credentials:
                            <br>Username: ${data.username}
                            <br>Password: ${atob(data.password)}
                            <br><br>
                            You can access your account from the following link:
                            <br>${process.env.FRONTEND}`
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
                                    "msg": "Your account has been created successfully!",
                                })
                            }
                        });
                    })
            }
        })
})

router.get('/logged-user-data/:username', (req, res) => {
    User.findOne({ username: req.params.username })
        .then((data) => {
            Staff.aggregate([
                {
                    $match: { staffID: data.staffID }
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
                .then((stf) => res.json(stf))
                .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
})

module.exports = router;