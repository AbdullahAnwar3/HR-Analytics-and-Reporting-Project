const Survey = require('../models/surveysData');
const mongoose = require('mongoose');

// GET all surveys
const getSurveys = async (req, res) => {
    try{
        const surveys = await Survey.find({}).sort({createdAt: -1});
        res.status(200).json(surveys);
    }
    catch (error){
        res.status(400).json({error : 'Error occured while fetching all surveys for admin'});
    }
};

// Create a new survey
const addSurvey = async (req, res) => {
    const {title, description} = req.body;

    let errorFields = [];
    if(!title){
        errorFields.push('Title');
    }
    if(!description){
        errorFields.push('Description');
    }

    if(errorFields.length != 0)
    {
        return res.status(400).json({error : 'Please fill out all the fields', errorFields});
    }

    try{
        const survey = await Survey.create({title, description, visibility : 'true'});
        res.status(200).json(survey);
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

// Add comment
const addComment = async (req, res) => {
    try{
        console.log('here')
        const {id} = req.params;
        const {email} = req.email;
        const {response} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error : 'No such survey exists in the database'});
        }

        let errorFields = [];
        if(!response){
            errorFields.push('Response');
            return res.status(400).json({error : 'Please fill out the comment field', errorFields});
        }

        let response_append = email + ';' + response;

        const survey = await Survey.findOneAndUpdate({_id: id},{ $push: { responses: response_append } } );
        if (survey)
        {
            const comment = await Survey.findOne({_id: id});
            res.status(200).json(comment);
        }
        else
            res.status(404).json({error : 'No such survey exists in the database'});
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

// Delete a survey
const deleteSurvey = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such survey exists in the database'});
    }

    try{
        const survey = await Survey.findByIdAndDelete({_id: id});
        if (survey)
            res.status(200).json(survey);
        else
            res.status(404).json({error : 'No such survey exists in the database'});
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

// update a survey
const surveyVisibility = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such survey exists in the database'});
    }

    try{
        const survey = await Survey.findOneAndUpdate({_id: id}, {...req.body});
        if (survey)
            res.status(200).json({mssg : 'Survey updated'});
        else
            res.status(404).json({error : 'No such survey exists in the database'});
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

module.exports = {
    getSurveys,
    addSurvey,
    addComment,
    deleteSurvey,
    surveyVisibility
}
