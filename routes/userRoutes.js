const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup Route
router.post(
    "/signup",
    [
        check("username").not().isEmpty().withMessage("Username is required"),
        check("email").isEmail().withMessage("Valid email is required"),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        try {
            const newUser = await User.create({ username, email, password });
            res.status(201).json({
                message: "User created successfully.",
                user_id: newUser._id,
            });
        } catch (error) {
            res.status(400).json({ message: "Error creating user." });
        }
    }
);

// Login Route
router.post(
    "/login",
    [
        check("email").isEmail().withMessage("Valid email is required"),
        check("password").not().isEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid email or password.",
                });
            }

            // Check if password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid email or password.",
                });
            }

            // If login is successful, send a success message
            res.status(200).json({
                message: "Login successful.",
                user_id: user._id,
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

module.exports = router;
