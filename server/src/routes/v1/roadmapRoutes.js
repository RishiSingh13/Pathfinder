const express = require('express');
const router = express.Router();
const roadmapController = require('../../controllers/roadmapController');
const { optionalAuth } = require('../../middleware/auth');
const { sanitizeInput } = require('../../validators/authValidators');

router.get('/', sanitizeInput, roadmapController.getCatalogue);
router.get('/:slug', optionalAuth, sanitizeInput, roadmapController.getRoadmapPreview);

module.exports = router;
