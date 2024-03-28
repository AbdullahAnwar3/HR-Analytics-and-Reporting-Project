const User = require('../models/userData');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const authenticateRequest = async (req, res, next) => {

    const {authorization} = req.headers;

    if (!authorization) 
        return res.status(401).json({error : 'Authorization data not found'});

    // JSON WEB TOKENS structure is as follows 'Bearer djef3iojfoi4fn4jfo4jfofj4ifjfj3f3fn3ofj3'.
    // String with a single space with second substring being the actual token.

    try{
        let jsonToken = authorization.split(' ')[1];
        const {_id} = jwt.verify(jsonToken, process.env.SYM_KEY);

        // Now attaching this _id to req object so that it is avaiable for subsequent API calls
        req._id = await User.findOne({_id}).select('_id');

        next();
    }
    catch (error){
        console.log(error);
        res.status(401).json({error: 'Access denied'});
    }
}

module.exports = authenticateRequest