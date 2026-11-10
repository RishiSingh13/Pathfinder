const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController');
const { requireAuth } = require('../../middleware/auth');
const { sanitizeInput } = require('../../validators/authValidators');

// All report submissions require authentication
router.use(requireAuth);
router.use(sanitizeInput);

router.post('/', reportController.submitReport);

module.exports = router;
