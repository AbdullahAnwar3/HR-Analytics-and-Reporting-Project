const User = require('../models/userData');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const validator = require('validator');
const generator = require('generate-password');
// const jwt = require('jsonwebtoken');

const {sendCredentials} = require('./mailer/sendCredentials')

// Signup a user
const signupRequest = async (req, res) => {

    let {email, password, fname, lname, salary, occupation} = req.body;

    let errorList = {};
    let emptyMsg = 'Please complete this required field.';

    email = email.trim();
    fname = fname.trim();
    lname = lname.trim();
    salary = salary.trim();
    occupation = occupation.trim();
    
    // Validating input fields
    if(!email)
    {
        errorList.email = emptyMsg;
    }
    else if (!validator.isEmail(email)) 
    {
        errorList.email = 'Email entered is invalid.';
    }
    else
    {
        try{
            const contains = await User.findOne({email})
            if (contains) 
            {
                errorList.email = 'Email already in use.';
            }
        }
        catch (error){
            errorList.email = 'Email already in use.';
        }
    }

    if(!fname)
        errorList.fname = emptyMsg;
    else if(!validator.isAlpha(fname))
        errorList.fname = 'Name entered is invalid.';

    if(!lname)
        errorList.lname = emptyMsg;
    else if(!validator.isAlpha(lname))
        errorList.lname = 'Name entered is invalid.';

    if(!salary)
        errorList.salary = emptyMsg;
    else if(!validator.isNumeric(salary) || salary < 0)
    {
        errorList.salary = 'Salary entered is invalid.';
    }

    if(!occupation)
        errorList.occupation = emptyMsg;
    else if(occupation != 'admin' && occupation != 'employee')
        errorList.occupation = 'Occupation entered is invalid.'

    if(Object.keys(errorList).length != 0){
        return res.status(400).json({error: 'Error with input fields', errorList});
    }

    // Generating a random password
    const passcode = generator.generate({
        length: 8,
        uppercase: true,
        lowercase: true,
        numbers: true,
        strict: true
    });

    // sendCredentials(email, password);

    try{

        // Adding randon nonce to generate unique hash for same passwords
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({email, password : hash, fname, lname, salary, occupation});
        // const user = await User.create({email, password, fname, lname, salary, occupation});

        res.status(200).json({email, user})
    }
    catch (error){
        res.status(400).json({error: error.message, errorList});
    }
};

module.exports = {
    signupRequest
}
