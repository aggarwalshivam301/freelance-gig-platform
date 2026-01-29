const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBid,
  getGigBids,
  getMyBids,
  updateBid,
  acceptBid,
  rejectBid
} = require('../controllers/bidController');

router.post('/', protect, authorize('freelancer'), createBid);
router.get('/gig/:gigId', protect, getGigBids);
router.get('/my-bids', protect, authorize('freelancer'), getMyBids);
router.put('/:id', protect, authorize('freelancer'), updateBid);
router.put('/:id/accept', protect, authorize('client'), acceptBid);
router.put('/:id/reject', protect, authorize('client'), rejectBid);

module.exports = router;
