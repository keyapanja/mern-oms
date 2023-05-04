const express = require("express");
const router = express.Router();

const Company = require('../models/companyModel');

//Nodemailer for sending email
// var nodemailer = require('nodemailer');

//Setting up Email Configuration
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'testmailinfo9@gmail.com',
//         pass: 'ezmsueahhmmxrvzg'
//     }
// });

router.get('/', (req, res) => {
    Company.findOne()
        .then((data) => res.json(data))
        .catch((err) => res.json(err));
})

router.post('/add', (req, res) => {
    Company.create(req.body)
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Company data has been saved!'
                })
            }
        })
})

router.post('/update', (req, res) => {
    Company.findOne()
        .then((data) => {
            if (data) {
                Company.findOneAndUpdate({ _id: data._id },
                    {
                        company_name: req.body.company_name,
                        company_mail: req.body.company_mail,
                        address: req.body.address,
                        logo: req.body.logo,
                        company_url: req.body.company_url
                    })
                    .then((comp) => {
                        if (comp) {
                            res.json({
                                'status': 'success',
                                'msg': 'Company data updated successfully!'
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

// Import multer like the other dependencies
const multer = require('multer')

// Set multer file storage folder

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/uploads/company/`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `company_logo.${ext}`);
    },
});

const upload = multer({
    storage: multerStorage,
}).single('logo');

router.post('/upload-logo', (req, res) => {
    Company.findOne()
        .then((data) => {
            if (data) {
                upload(req, res, function (err) {
                    if (err) {
                        res.json({
                            'status': 'error',
                            'msg': err.message
                        })
                    } else {
                        Company.findOneAndUpdate({ _id: data._id }, {
                            logo: res.req.file.filename
                        })
                            .then(() => {
                                res.json({
                                    'status': 'success',
                                    'msg': 'Logo uploaded successfully!'
                                })
                            })
                    }
                })
            } else {
                res.json({
                    'status': 'error',
                    'msg': 'Please fill in the Company details first!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

module.exports = router;
