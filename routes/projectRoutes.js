const express = require("express");
const Project = require("../models/projectModel");
const Tasks = require("../models/taskModel");
const Notifications = require('../models/notificationModel');
const Files = require("../models/fileModel");
const router = express.Router();

router.post('/check-projectID/:projectID', (req, res) => {
    Project.findOne({ projectID: req.params.projectID })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'orange',
                    'msg': 'Project ID already exists... Please choose another!'
                })
            } else {
                res.json({
                    'status': 'success',
                    'msg': 'Project ID available!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/add', (req, res) => {
    Project.create(req.body)
        .then((data) => {
            if (data) {

                const team = req.body.team;
                const notifArr = [];
                team.forEach(element => {
                    const obj = {
                        to: element.staffID,
                        by: "Admin",
                        msg: `You're added to a project "${req.body.name}".`,
                        type: 'Project',
                        icon: 'fa fa-users bg-success rounded-pill',
                        link: `/staff/view-project?project_id=${req.body.projectID}`
                    }
                    notifArr.push(obj);
                });
                Notifications.insertMany(notifArr)

                res.json({
                    'status': 'success',
                    'msg': 'Project added successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-projects', (req, res) => {
    Project.aggregate([
        {
            $sort: { createdAt: -1 }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/get-project/:id', (req, res) => {
    Project.findOne({ projectID: req.params.id })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/edit/:id', (req, res) => {
    Project.findOneAndUpdate({ projectID: req.params.id }, {
        name: req.body.name,
        desc: req.body.desc,
        budget: req.body.budget,
        currency: req.body.currency,
        client: req.body.client,
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Project data updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/update-team/:id', (req, res) => {
    Project.findOneAndUpdate({ projectID: req.params.id }, {
        team: req.body.newTeam
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Team updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.post('/add-task', (req, res) => {
    Tasks.insertMany(req.body.tasks)
        .then((data) => {
            if (data) {

                const notifArr = [];
                const tasks = req.body.tasks;
                tasks.forEach(element => {
                    const obj = {
                        to: element.staffID,
                        by: req.body.by,
                        msg: `You're assigned a new task on "${req.body.projectName}" !`,
                        icon: 'fa fa-clipboard-check bg-success rounded-pill',
                        type: 'Project',
                        link: `/staff/tasks`
                    }
                    notifArr.push(obj);
                });

                Notifications.insertMany(notifArr)

                res.json({
                    'status': 'success',
                    'msg': 'Tasks added successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-project-tasks/:projectID', (req, res) => {
    Tasks.aggregate([
        {
            $match: { projectID: req.params.projectID }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/delete-project/:projectID', (req, res) => {
    Project.findOneAndDelete({ projectID: req.params.projectID })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Project deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/get-tasks/:staffID', (req, res) => {
    Tasks.aggregate([
        {
            $match: { staffID: req.params.staffID }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/projects-by-staff/:staffID', (req, res) => {
    Project.find({
        team: {
            $elemMatch: {
                staffID: req.params.staffID
            }
        }
    })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/task-completed/:id', (req, res) => {
    Tasks.updateOne({ _id: req.params.id }, { status: 'Completed' })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Task is marked as completed!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

const multer = require('multer');

router.post('/upload-file/:projectID/:customName/:uploadedBy', (req, res) => {
    const projectID = req.params.projectID;
    const customName = req.params.customName;
    const uploadedBy = req.params.uploadedBy;

    // Set multer file storage folder
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/uploads/projects/`);
        },
        filename: (req, file, cb) => {
            const ext = file.originalname.split('.');
            cb(null, `${projectID}-${customName}.${ext[1]}`);
        },
    });

    const upload = multer({
        storage: multerStorage,
    }).single('file');

    upload(req, res, function (err) {
        if (err) {
            res.json({
                'status': 'error',
                'msg': err.message
            })
        } else {
            Files.create({
                'path': res.req.file.filename,
                'projectID': projectID,
                'name': customName,
                'uploadedBy': uploadedBy
            })
                .then((data) => {
                    if (data) {
                        res.json({
                            'status': 'success',
                            'msg': 'File uploaded successfully!'
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

router.get('/get-files/:projectID', (req, res) => {
    Files.find({ projectID: req.params.projectID })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.json(err))
})

router.post('/delete-file/:id', (req, res) => {
    Files.deleteOne({ _id: req.params.id })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'File deleted successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/recent-projects', (req, res) => {
    Project.aggregate([
        {
            $sort: { createdAt: -1 }
        }
    ]).limit(5)
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.get('/staff-recent-projects/:staffID', (req, res) => {
    Project.aggregate([
        {
            $sort: { createdAt: -1 }
        },
        {
            $match: {
                team: {
                    $elemMatch: {
                        staffID: req.params.staffID
                    }
                }
            }
        }
    ]).limit(5)
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

router.post('/change-status/:id', (req, res) => {
    Project.findOneAndUpdate({ projectID: req.params.id }, {
        status: req.body.status
    })
        .then((data) => {
            if (data) {
                res.json({
                    'status': 'success',
                    'msg': 'Project status updated successfully!'
                })
            }
        })
        .catch((err) => res.json({
            'status': 'error',
            'msg': err.message
        }))
})

router.get('/projects-by-status/:status', (req, res) => {
    Project.find({ status: req.params.status })
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
})

module.exports = router;