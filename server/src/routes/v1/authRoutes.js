const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { requireAuth, optionalAuth } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');
const { sanitizeInput, validateRegister, validateLogin } = require('../../validators/authValidators');

router.post('/register', authLimiter, sanitizeInput, validateRegister, authController.register);
router.post('/login', authLimiter, sanitizeInput, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', optionalAuth, authController.getMe);
router.delete('/account', requireAuth, sanitizeInput, authController.deleteAccount);

module.exports = router;
