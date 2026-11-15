const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/topicController');
const { optionalAuth } = require('../../middleware/auth');

// GET a single topic — optional auth so logged-in users get their progress status
// Strictly read-only: never mutates any progress record
router.get('/:slug/topics/:topicKey', optionalAuth, topicController.getTopic);

module.exports = router;
