const express = require('express');
const router = express.Router();
const progressController = require('../../controllers/progressController');
const { requireAuth } = require('../../middleware/auth');
const { sanitizeInput } = require('../../validators/authValidators');

// All progress endpoints require active authentication
router.use(requireAuth);
router.use(sanitizeInput);

router.get('/dashboard', progressController.getDashboard);
router.post('/enrolments/:slug', progressController.enroll);
router.patch('/enrolments/:slug', progressController.updateEnrolment);
router.delete('/enrolments/:slug', progressController.unenroll);
router.put('/roadmaps/:slug/topics/:topicKey', progressController.setTopicProgress);

module.exports = router;
