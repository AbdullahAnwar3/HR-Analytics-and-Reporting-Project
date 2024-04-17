const express = require('express');

const User = require('../models/userData');

const genderAnalytics = async (req, res) => {
    try {
        const genderCount = await User.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json(genderCount);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gender data', error: error });
    }
};



const salaryAnalytics = async (req, res) => {
    try {
        const salaryList = await User.find({}).select('salary');

        res.status(200).json(salaryList);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching salary data', error: error });
    }
};

const ageAnalytics = async (req, res) => {
    const today = new Date();
    try {
        const ageRanges = await User.aggregate([
            {
                $project: {
                    age: {
                        $floor: {
                            $divide: [{ $subtract: [today, "$dob"] }, (365 * 24 * 60 * 60 * 1000)]
                        }
                    }
                }
            },
            {
                $bucket: {
                    groupBy: "$age",
                    boundaries: [ 0, 18, 30, 45, 60],
                    default: "120+",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        res.status(200).json(ageRanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching age data', error: error });
    }
};



const residenceAnalytics = async (req, res) => {
    try {
        const residenceCount = await User.aggregate([
            {
                $match: { "residence": { $ne: null } }  // Ensure the residence field is not null
            },
            {
                $group: {
                    _id: '$residence',  // Group by residence
                    count: { $sum: 1 }  // Count the number of users in each residence
                }
            },
            {
                $sort: { count: -1 }  // Optional: Sort by count in descending order
            }
        ]);
        res.status(200).json(residenceCount);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching residence data', error: error });
    }
};


module.exports = {
    genderAnalytics,
    salaryAnalytics,
    ageAnalytics,
    residenceAnalytics

}

