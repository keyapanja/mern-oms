const express = require("express");
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./dbConnect");
dotenv.config();

const cors = require("cors");

connectDB();

// var corsOptions = {
//     origin: "*"
// };

app.use((_, res, next) => {
    res.set('Access-Control-Allow-Origin', '*'); // or 'localhost:8888'
    res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    return next();
}); // sets headers before routes

// app.use(cors(corsOptions));

app.use(express.json());

const path = require('path')
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads/'))

const userRoutes = require('./routes/userRoutes');
const attnRoutes = require('./routes/attnRoutes');
const deptRoutes = require('./routes/deptRoutes');
const countRoutes = require('./routes/countRoutes');
const desgRoutes = require('./routes/desgRoutes');
const staffRoutes = require('./routes/staffRoutes');
const compRoutes = require('./routes/compRoutes');
const settingRoutes = require('./routes/settingRoutes');
const otherRoutes = require('./routes/otherRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notifRoutes = require('./routes/notifRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/users/', userRoutes);
app.use('/api/attendance/', attnRoutes);
app.use('/api/departments/', deptRoutes);
app.use('/api/count/', countRoutes);
app.use('/api/desgs/', desgRoutes);
app.use('/api/staff/', staffRoutes);
app.use('/api/company/', compRoutes);
app.use('/api/settings/', settingRoutes);
app.use('/api/others/', otherRoutes);
app.use('/api/projects/', projectRoutes);
app.use('/api/notifications/', notifRoutes);
app.use('/api/leaves/', leaveRoutes);
app.use('/api/reports/', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});