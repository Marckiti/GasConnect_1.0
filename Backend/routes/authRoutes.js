const express = require('express');
const router = express.Router();
const { registerUser, loginUser, profileUser, forgotPassword, resetPassword, confirmEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, profileUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/confirm/:token', confirmEmail);

module.exports = router;