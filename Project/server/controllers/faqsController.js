const Faqs = require('../models/faqsData');
const mongoose = require('mongoose');

// GET all faqs
const getAllFaqs = async (req, res) => {
    try{
        const faqs = await Faqs.find({}).sort({createdAt: -1});
        res.status(200).json(faqs);
    }
    catch (error){
        res.status(400).json({error : 'Error occured while fetching all faqs'});
    }
};

// POST a new faq
const addFaq = async (req, res) => {
    const {question, answer} = req.body;

    let errorFields = [];
    if(!question){
        errorFields.push('Question');
    }
    if(!answer){
        errorFields.push('Answer');
    }
    if(errorFields.length != 0)
    {
        return res.status(400).json({error : 'Please fill out all the fields', errorFields});
    }

    try{
        const faq = await Faqs.create({question, answer});
        res.status(200).json(faq);
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

// DELETE a Faq
const deleteFaq = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : 'No such faq exists in the database'});
    }

    try{
        const faq = await Faqs.findByIdAndDelete({_id: id});
        if (faq)
            res.status(200).json(faq);
        else
            res.status(404).json({error : 'No such faq exists in the database'});    
    }
    catch (error){
        res.status(400).json({error : error.message});
    }
};

module.exports = {
    getAllFaqs,
    addFaq,
    deleteFaq,
}
