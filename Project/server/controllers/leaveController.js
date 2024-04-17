const User = require('../models/userData');
const Leave = require('../models/leaveData');
const mongoose = require('mongoose');

const validator = require('validator');

// Check if email exists in database
const searchEmail = async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email}).select('email');
        if (user)
            res.status(200).json({mssg : 'Email Found'});
        else
            res.status(404).json({error : 'Email not found'});
    }
    catch (error){
        res.status(400).json({error : 'Error occured while searching email'});
    }
}


// Search for requests
const searchRequests = async (req, res) => {

    let {email : email_id, createdAt, standing, sort} = req.body;
    let filter = {};
    let order = 1;

    if (email_id)
        filter.email_id = email_id;
    if (createdAt)
    {
        let rangeOne = new Date(createdAt);
        let rangeTwo = new Date(createdAt);
        rangeTwo.setDate(rangeOne.getDate() + 1);
        filter.createdAt = {$gte: rangeOne, $lt: rangeTwo};
    }
    if (standing)
        filter.standing = standing;
    if (sort === true)
        order = -1;
    
    try{
        const result = await Leave.aggregate([
            {
                $match : filter
            },
            {
            $lookup: {
                from: 'users',
                localField: 'email_id',
                foreignField: 'email',
                pipeline: [{$project : {fname : 1, lname : 1, photo : 1}}],
                as: 'profile',
            },
            }
        ]).sort({createdAt: order});
        res.status(200).json(result);
    }
    catch (error){
        res.status(400).json({error : error.message})
    }

};

// GET leave request for user
const getLeaveRequests = async (req, res) => {

    try{
        const {email} = req.email;
        const leave = await Leave.find({email_id : email}).sort({createdAt: -1});
        const user = await User.findOne({email}).select('email fname lname photo');
        
        if (leave)
        {
            if(user)
                res.status(200).json({leave,user});
        }
        else
        {
            res.status(404).json({error : 'Unable to fetch leave requests'});
        }
    }
    catch (error){
        res.status(400).json({error : error.message});
    }

};

// POST a new leave request
const addLeaveRequest = async (req, res) => {
    try{
        const {email : email_id} = req.email;
        let {startDate, endDate, description, attachment} = req.body;

        let errorFields = [];
        if(!startDate || !endDate){
            errorFields.push('Date');
        }
        if(!description){
            errorFields.push('Description');
        }
        if(errorFields.length != 0)
        {
            return res.status(400).json({error : 'Please fill out all the required fields', errorFields});
        }

        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        if(!validator.isDate(startDate) || !validator.isDate(endDate))
        {
            errorFields.push('Date');
            return res.status(400).json({error : 'Invalid date', errorFields});  
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        if(endDate < startDate || startDate < today)
        {
            errorFields.push('Date');
            return res.status(400).json({error : 'Please select available dates', errorFields});
        }

        const user = User.findOne({email : email_id});
        if (user)
        {
            const leave = await Leave.create({email_id, startDate, endDate, description, attachment, standing: 'pending'});
            res.status(200).json(leave);
        }
        else
            res.status(400).json({error : 'User account not found', errorFields});
    }
    catch (error){
        res.status(400).json({error : 'Account not found, contact admin'});
    }
};

// UPDATE standing/status of a leave request
const updateLeaveRequest = async (req, res) => {
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error : 'No such leave request exists in the database'});
        }
    
        const leave = await Leave.findOneAndUpdate({_id: id, standing : 'pending'}, {...req.body});
    
        if (leave)
            res.status(200).json(leave);
        else
            res.status(404).json({error : 'No such leave request exists in the database'});
    }
    catch (error){
        res.status(400).json({error : error.message});   
    }

};

module.exports = {
    searchEmail,
    searchRequests,
    getLeaveRequests,
    addLeaveRequest,
    updateLeaveRequest,
}