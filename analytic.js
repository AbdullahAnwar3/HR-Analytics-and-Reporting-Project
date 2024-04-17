const express = require('express');
const {
    genderAnalytics, 
    salaryAnalytics, 
    ageAnalytics,
    residenceAnalytics  
} = require('../controllers/analyticsController');

const router = express.Router();
const authenticateRequest = require('../middleware/authorize');

// JSON WEB TOKEN validation. If valid, only then subsequent routes are invoked and access to controller functions is granted.
router.use(authenticateRequest);

// Analytics routes
router.get('/gender', genderAnalytics);
router.get('/salary', salaryAnalytics);
router.get('/age', ageAnalytics);
router.get('/residence', residenceAnalytics);  

module.exports = router;
