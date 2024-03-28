// import cors from 'cors'
// app.use(cors());

require('dotenv').config();
const express = require('express');
const app = express();

// Moongoose allows for schema creation. MongoDB alone is schema less.
const mongoose = require('mongoose');

// Middleware to add request body to response object to access in a function
app.use(express.json());


const loginRoutes = require('./routes/login.js');
const signupRoute = require('./routes/signup.js');
const courseRoutes = require('./routes/courses.js');
const faqRoutes = require('./routes/faqs.js');
const leaveRoutes = require('./routes/leave.js')

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


mongoose.connect(process.env.MONG_URI)
.then(()=>{
    app.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
    console.log("Connected to Database");
})})
.catch((error)=>{
    console.log(error)
})

