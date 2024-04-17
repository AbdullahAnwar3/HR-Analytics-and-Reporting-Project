// // import cors from 'cors'
// // app.use(cors());

// require('dotenv').config();
// const express = require('express');
// const app = express();

// // Moongoose allows for schema creation. MongoDB alone is schema less.
// const mongoose = require('mongoose');

// // Middleware to add request body to response object to access in a function
// app.use(express.json({limit : '50mb'}));


// const loginRoutes = require('./routes/login.js');
// const signupRoute = require('./routes/signup.js');
// const courseRoutes = require('./routes/courses.js');
// const faqRoutes = require('./routes/faqs.js');
// const leaveRoutes = require('./routes/leave.js');
// const accountRoutes = require('./routes/account.js');

// // Middleware to log API route and method
// app.use((req,res,next) => {
//     console.log(req.path, req.method);
//     next();
// })

// // Middleware to use API routes
// app.use('/api/login', loginRoutes);
// app.use('/api/signup', signupRoute);
// app.use('/api/courses', courseRoutes);
// app.use('/api/faqs', faqRoutes);
// app.use('/api/leave', leaveRoutes);
// app.use('/api/account', accountRoutes);


// mongoose.connect(process.env.MONG_URI)
// .then(()=>{
//     app.listen(process.env.PORT, ()=>{
//     console.log(`listening on port ${process.env.PORT}`);
//     console.log("Connected to Database");
// })})
// .catch((error)=>{
//     console.log(error)
// })


/****************************************************Using WebSocket.io***********************************************/

const cors = require('cors')

require('dotenv').config();
const express = require('express');
const app = express();
app.use(cors(
    {
        // origin: ["https://hr-analytics-and-reporting-project-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

// Moongoose allows for schema creation. MongoDB alone is schema less.
const mongoose = require('mongoose');

// Middleware to add request body to response object to access in a function
app.use(express.json({limit : '50mb'}));

// Adding socket.io configuration
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const loginRoutes = require('./routes/login.js');
const signupRoute = require('./routes/signup.js');
const courseRoutes = require('./routes/courses.js');
const faqRoutes = require('./routes/faqs.js');
const leaveRoutes = require('./routes/leave.js');
const accountRoutes = require('./routes/account.js');
const surveyRoutes = require('./routes/survey.js');
const analyticRoutes = require('./routes/analytic.js');

// Middleware to log API route and method
app.use((req,res,next) => {
    console.log(req.path, req.method);
    next();
})

// Middleware to use API routes
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoute);
app.use('/api/courses', courseRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/analytics/', analyticRoutes);

io.on('connection', (socket) => {
    console.log('a user connected to a socket driven page', socket.id)
})

exports.io = io

mongoose.connect(process.env.MONG_URI)
.then(()=>{
    server.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
    console.log("Connected to Database");
})})
.catch((error)=>{
    console.log(error)
})

module.exports = app;

