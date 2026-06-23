const express = require('express');
const router = express.Router();
const {
  createStartup, getAllStartups, getAllStartupsAdmin,
  getStartup, getMyStartup, updateStartup,
  deleteStartup, approveStartup, getFeaturedStartups
} = require('../controllers/startupController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');




router.get('/featured', getFeaturedStartups);


router.get('/user/my-startup', auth, authorize('founder'), getMyStartup);


router.get('/admin/all', auth, authorize('admin'), getAllStartupsAdmin);


router.get('/', getAllStartups);


router.get('/:id', getStartup);
router.post('/', auth, authorize('founder'), createStartup);
router.put('/:id', auth, authorize('founder', 'admin'), updateStartup);
router.delete('/:id', auth, authorize('founder', 'admin'), deleteStartup);
router.patch('/:id/approve', auth, authorize('admin'), approveStartup);

module.exports = router;
