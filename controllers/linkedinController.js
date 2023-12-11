import express from 'express';
import Linked from '../models/linkedinModel.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';

export const skills = asyncHandler(async (req, res) => {
    try {
        const {
            given_name,
            email,
            picture,
            skills,
            experience,
            location
        } = req.body;

        // Calculate rating based on the number of skills (assuming skills.length determines the rating)
        const rating = Array.isArray(skills) ? Math.min(10, Math.ceil(skills.length / 2)) : 0;

        // Create a new LinkedIn user
        const linkedinUser = new Linked({
            given_name,
            email,
            picture,
            skills,
            experience,
            location,
            rating
        });

        // Save the user to the database
        const savedUser = await linkedinUser.save();
        console.log(linkedinUser)
        console.log("Rating : ", rating)
        // Send JSON response with the saved user details
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: savedUser
        });
    } catch (error) {
        // Handle error and send a JSON response
        res.status(400).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});


