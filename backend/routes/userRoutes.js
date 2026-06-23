const express = require('express');
const router = express.Router();
const { getAllUsers, blockUser, unblockUser, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.get('/', auth, authorize('admin'), getAllUsers);
router.patch('/:id/block', auth, authorize('admin'), blockUser);
router.patch('/:id/unblock', auth, authorize('admin'), unblockUser);
router.put('/profile', auth, updateProfile);

module.exports = router;
