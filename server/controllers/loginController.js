const User = require('../models/userData');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JSON WEB TOKENS contain Headers, Payload, Signature
// Header: Contains algorithm used for jwt.
// Payload: Contains non-sensitive user data (e.g. user_id)
// Signature: Used to verify token by Server. (Ecrpytion of Header and Payload using a private key)

// The following function creates jwt for login and signup
const generateTokens = (id) => {
    // Method below generated a token. First argument : payload, Second argument : secret key, Third argument : options 
    return jwt.sign({_id: id}, process.env.SYM_KEY, {expiresIn: '1d'})
    // Once created 3 dots seperate the Header, Payload and Signature
}

// Login a user
const loginRequest = async (req, res) => {
    const {email, password} = req.body;

    let errorFields = [];
    if(!email){
        errorFields.push('Email');
    }
    if(!password){
        errorFields.push('Password');
    }
    if(errorFields.length != 0)
    {
        return res.status(400).json({error : 'Please fill out all the fields', errorFields});
    }

    try{
        const user = await User.findOne({email})
        if (!user) 
        {
            errorFields.push('Email');
            return res.status(400).json({error : 'Incorrect email', errorFields});
        }
        
        // if(password === user.password)
        const compare = await bcrypt.compare(password, user.password);
        if (compare)
        {
            const userToken = generateTokens(user._id);
            res.status(200).json({email, occupation: user.occupation, userToken});
        }
        else 
        {
            errorFields.push('Password');
            res.status(400).json({error : 'Incorrect password', errorFields}); 
        }
    }
    catch (error){
        res.status(400).json({error: error.message, errorFields});
    }
};

module.exports = {
    loginRequest
}
