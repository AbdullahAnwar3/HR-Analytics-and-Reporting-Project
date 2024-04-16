const express = require('express');
const {
    getSurveysAdmin,
    getSurveysEmployee,
    addSurvey,
    addComment,
    deleteSurvey,
    surveyVisibility
} = require('../controllers/surveysController');

const router = express.Router();
const authenticateRequest = require('../middleware/authorize');

// JSON WEB TOKEN validation. If valid only then subsequent routes are invoked and access to controller functions is granted.
router.use(authenticateRequest);

// GET all surveys for admin
router.get('/', getSurveysAdmin);

// GET all surveys for employee
router.get('/employee', getSurveysEmployee);

// POST a new survey
router.post('/', addSurvey);

// Add comment
router.patch('/comment/:id', addComment);

// DELETE a survey
router.delete('/:id', deleteSurvey);

// DELETE a survey
router.patch('/:id', surveyVisibility);

module.exports = router;