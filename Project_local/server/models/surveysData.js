const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    responses: {
        type: [String]
    },
    visibility: {
        type: String,
        require: true
    }
}, {timestamps : true});

module.exports = mongoose.model('Survey', surveySchema);
