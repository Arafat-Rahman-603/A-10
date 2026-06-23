const express = require('express');
const router = express.Router();
const {
  apply, getMyApplications, getFounderApplications,
  acceptApplication, rejectApplication
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.post('/', auth, authorize('collaborator'), apply);
router.get('/my-applications', auth, authorize('collaborator'), getMyApplications);
router.get('/founder', auth, authorize('founder'), getFounderApplications);
router.patch('/:id/accept', auth, authorize('founder'), acceptApplication);
router.patch('/:id/reject', auth, authorize('founder'), rejectApplication);

module.exports = router;
