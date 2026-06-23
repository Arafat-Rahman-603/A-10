const express = require('express');
const router = express.Router();
const {
  createOpportunity, getAllOpportunities, getOpportunity,
  getOpportunitiesByStartup, getMyOpportunities,
  updateOpportunity, deleteOpportunity, getFeaturedOpportunities
} = require('../controllers/opportunityController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');




router.get('/featured', getFeaturedOpportunities);


router.get('/founder/my-opportunities', auth, authorize('founder'), getMyOpportunities);


router.get('/startup/:startupId', getOpportunitiesByStartup);


router.get('/', getAllOpportunities);


router.get('/:id', getOpportunity);
router.post('/', auth, authorize('founder'), createOpportunity);
router.put('/:id', auth, authorize('founder'), updateOpportunity);
router.delete('/:id', auth, authorize('founder', 'admin'), deleteOpportunity);

module.exports = router;
