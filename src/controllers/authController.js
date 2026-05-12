const express = require("express")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const { sendEmail } = require("../util/mail")
const crypto = require("crypto")

const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const newToken = JWT.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            token: newToken
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized Access',
            error: error.message
        });
    }
}

const Subscription = require("../models/Subscription")
const plans = require("../config/plans")

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all the fields"
            })
        }
        if (password.length < 8) {
            return res.status(400).send({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: "User already Registered plese login"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userInfo = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Create Default Free Subscription
        await Subscription.create({
            user: userInfo._id,
            plan: "Free",
            limits: plans.Free,
            usage: {
                businessesUsed: 0,
                knowledgeEntriesUsed: 0,
                chatsUsedThisMonth: 0,
                aiRepliesUsedThisMonth: 0,
                teamMembersUsed: 0
            }
        });

        // Send Welcome Email
        try {
            await sendEmail(
                email,
                "Welcome to SupportAI!",
                `Hi ${name}, welcome to SupportAI! We're excited to have you on board.`,
                `<h1>Welcome to SupportAI!</h1><p>Hi ${name},</p><p>We're excited to have you on board. You can now start setting up your business and AI chatbot.</p>`
            );
        } catch (mailError) {
            console.error("Failed to send welcome email:", mailError);
        }

        const token = JWT.sign({ userId: userInfo._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            token,
            User: {
                id: userInfo._id,
                name,
                email,
                role: userInfo.role
            }
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Registering User",
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all the fields"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not Registered plese Register"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password"

            })
        }

        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "User Logged In Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Logging In User",
            error: error.message
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in fetching user profile",
            error: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        try {
            await sendEmail(
                email,
                "Password Reset Code",
                `Your password reset code is: ${resetCode}`,
                `<h1>Password Reset</h1><p>Your password reset code is: <strong>${resetCode}</strong></p><p>This code will expire in 10 minutes.</p>`
            );
            res.status(200).json({ success: true, message: "Reset code sent to email" });
        } catch (error) {
            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ success: false, message: "Email could not be sent" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
        }

        res.status(200).json({ success: true, message: "Code verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resetPasswordWithCode = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser, refreshToken, forgotPassword, resetPassword, getMe, verifyResetCode, resetPasswordWithCode }
