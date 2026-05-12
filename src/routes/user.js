const express = require('express');
const { registerUser, loginUser, refreshToken, forgotPassword, resetPassword, getMe, verifyResetCode, resetPasswordWithCode } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password-with-code', resetPasswordWithCode);
router.post('/reset-password/:resetToken', resetPassword);
router.get('/me', authMiddleware, getMe);

module.exports = router;