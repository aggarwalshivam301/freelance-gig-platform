const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs
} = require('../controllers/gigController');

router.get('/', getAllGigs);
router.get('/my-gigs', protect, authorize('client'), getMyGigs);
router.get('/:id', getGig);
router.post('/', protect, authorize('client'), createGig);
router.put('/:id', protect, authorize('client'), updateGig);
router.delete('/:id', protect, authorize('client'), deleteGig);

module.exports = router;
