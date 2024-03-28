const express = require('express');
const {
    searchRequests,
    getLeaveRequests,
    addLeaveRequest,
    deleteLeaveRequest,
    updateLeaveRequest,
} = require('../controllers/leaveController')

const router = express.Router();
const authenticateRequest = require('../middleware/authorize');

// JSON WEB TOKEN validation. If valid only then subsequent routes are invoked and access to controller functions is granted.
router.use(authenticateRequest);

// Search for requests
router.post('/', searchRequests);

// GET all user requests
router.get('/', getLeaveRequests);

// POST a new leave request
router.post('/add', addLeaveRequest)

// DELETE a leave request
router.delete('/:id', deleteLeaveRequest);

// UPDATE a leave request
router.patch('/:id', updateLeaveRequest);

module.exports = router
