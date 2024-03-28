const User = require('../models/userData');
const Leave = require('../models/leaveData');
const mongoose = require('mongoose');

const validator = require('validator');

// Search for requests
const searchRequests = async (req, res) => {
    const {email, name, category, startDate, endDate, standing, sort} = req.body;
    const leave = await Leave.find({email, name, category, startDate, endDate, standing}).sort({createdAt: sort});
    res.status(200).json(leave);
};

// GET leave request for user
const getLeaveRequests = async (req, res) => {

    const {_id} = req._id;

    const leave = await Leave.find({user_id : _id});

    if (leave)
        res.status(200).json(leave);
    else
        res.status(404).json({error : 'Unable to fetch leave requests'});
};

// POST a new leave request
const addLeaveRequest = async (req, res) => {

    const {_id} = req._id;
    let {category, startDate, endDate, description, attachment} = req.body;

    let errorFields = [];
    if(!category){
        errorFields.push('Category');
    }
    if(!startDate || !endDate){
        errorFields.push('Date');
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

    try{
        const user = await User.findOne({_id});
        const leave = await Leave.create({user_id : _id, name : user.fname + ' ' + user.lname, 
                                        photo: user.photo, category, startDate, endDate, description, attachment});
        res.status(200).json(leave);
    }
    catch (error){
        res.status(400).json({error : error.message, errorFields});
    }
};

// DELETE a  pending leave request
const deleteLeaveRequest = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such leave request exists in the database'});
    }

    const leave = await Leave.findByIdAndDelete({_id: id});

    if (leave)
        res.status(200).json(leave);
    else
        res.status(404).json({error : 'No such leave request exists in the database'});
};

// UPDATE standing/status of a leave request
const updateLeaveRequest = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such leave request exists in the database'});
    }
    
    const leave = await Leave.findByIdAndUpdate({_id: id}, {...req.body});

    if (leave)
        res.status(200).json(leave);
    else
        res.status(404).json({error : 'No such leave request exists in the database'});
};

module.exports = {
    searchRequests,
    getLeaveRequests,
    addLeaveRequest,
    deleteLeaveRequest,
    updateLeaveRequest,
}