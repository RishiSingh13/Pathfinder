const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const reportController = require('../../controllers/reportController');
const { requireAuth, requireAdmin } = require('../../middleware/auth');
const { sanitizeInput } = require('../../validators/authValidators');

// All admin routes strictly enforce active authentication and persisted admin role
router.use(requireAuth);
router.use(requireAdmin);
router.use(sanitizeInput);

// Roadmap management
router.get('/roadmaps', adminController.listRoadmaps);
router.get('/roadmaps/:id', adminController.getRoadmap);
router.post('/roadmaps', adminController.createRoadmap);
router.patch('/roadmaps/:id', adminController.updateRoadmap);
router.put('/roadmaps/:id', adminController.updateRoadmap);

// Module management
router.post('/roadmaps/:id/modules', adminController.createModule);
router.post('/modules', adminController.createModule);
router.patch('/modules/:id', adminController.updateModule);
router.put('/modules/:id', adminController.updateModule);
router.put('/roadmaps/:id/modules/order', adminController.reorderModules);
router.put('/modules/reorder', adminController.reorderModules);

// Topic management
router.post('/modules/:id/topics', adminController.createTopic);
router.post('/topics', adminController.createTopic);
router.patch('/topics/:id', adminController.updateTopic);
router.put('/topics/:id', adminController.updateTopic);
router.put('/modules/:id/topics/order', adminController.reorderTopics);
router.put('/topics/reorder', adminController.reorderTopics);
router.patch('/topics/:id/archive', adminController.archiveTopic);
router.put('/topics/:id/archive', adminController.archiveTopic);

// Curator issue report queue
router.get('/reports', reportController.listReports);
router.patch('/reports/:id', reportController.updateReport);
router.put('/reports/:id', reportController.updateReport);

module.exports = router;
