const Course = require('../models/coursesData');
const mongoose = require('mongoose');
const urlValidation  = require('url-validation');

// GET all courses
const getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find({}).sort({createdAt: -1});
        res.status(200).json(courses);
    }
    catch (error){
        res.status(400).json({error : 'Error occured while fetching all courses'});
    }
};

// POST a new course
const addCourse = async (req, res) => {
    const {title, description, website} = req.body;

    let errorFields = [];
    if(!title){
        errorFields.push('Title');
    }
    if(!description){
        errorFields.push('Description');
    }
    if(!website){
        errorFields.push('Url');
    }
    if(errorFields.length != 0)
    {
        return res.status(400).json({error : 'Please fill out all the fields', errorFields});
    }

    if(!urlValidation(website))
    {
        errorFields.push('Url');
        return res.status(400).json({error : 'Invalid course link provided', errorFields});
    }

    try{
        const course = await Course.create({title, description, website});
        res.status(200).json(course);
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

// DELETE a course
const deleteCourse = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such course exists in the database'});
    }

    try{
        const course = await Course.findByIdAndDelete({_id: id});
        if (course)
        {
            res.status(200).json(course);
        }
        else
            res.status(404).json({error : 'No such course exists in the database'});
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

module.exports = {
    getAllCourses,
    addCourse,
    deleteCourse
}
