const express = require('express');
const router = express.Router();
const { getAdminStats, getFounderStats, getCollaboratorStats } = require('../controllers/statsController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.get('/admin', auth, authorize('admin'), getAdminStats);
router.get('/founder', auth, authorize('founder'), getFounderStats);
router.get('/collaborator', auth, authorize('collaborator'), getCollaboratorStats);

module.exports = router;
