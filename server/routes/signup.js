const express = require('express');
const {
    signupRequest
} = require('../controllers/signupController')

const router = express.Router();
const authenticateRequest = require('../middleware/authorize');

// JSON WEB TOKEN validation. If valid only then subsequent routes are invoked and access to controller functions is granted.
router.use(authenticateRequest);

// Signup route
router.post('/', signupRequest);

module.exports = router