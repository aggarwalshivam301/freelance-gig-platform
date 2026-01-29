const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// Create bid
const createBid = async (req, res) => {
  try {
    const { gigId, proposalText, bidAmount, deliveryTime, milestones } = req.body;

    if (!gigId || !proposalText || !bidAmount || !deliveryTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already bid on this gig'
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      clientId: gig.clientId,
      proposalText,
      bidAmount,
      deliveryTime,
      milestones: milestones || []
    });

    gig.bidsCount += 1;
    await gig.save();

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting bid'
    });
  }
};

// Get bids for a gig
const getGigBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'displayName profileImage rating skills hourlyRate completedProjects')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    console.error('Get gig bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids'
    });
  }
};

// Get my bids
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget budgetType deadline status')
      .populate('clientId', 'displayName profileImage rating')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids'
    });
  }
};

// Update bid
const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    if (bid.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bid'
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update bid with status: ${bid.status}`
      });
    }

    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bid updated successfully',
      bid: updatedBid
    });
  } catch (error) {
    console.error('Update bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bid'
    });
  }
};

// Accept bid
const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    if (bid.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this bid'
      });
    }

    bid.status = 'accepted';
    await bid.save();

    const gig = await Gig.findById(bid.gigId);
    gig.status = 'in-progress';
    await gig.save();

    await Bid.updateMany(
      { 
        gigId: bid.gigId, 
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    res.status(200).json({
      success: true,
      message: 'Bid accepted successfully',
      bid
    });
  } catch (error) {
    console.error('Accept bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting bid'
    });
  }
};

// Reject bid
const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    if (bid.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this bid'
      });
    }

    bid.status = 'rejected';
    await bid.save();

    res.status(200).json({
      success: true,
      message: 'Bid rejected',
      bid
    });
  } catch (error) {
    console.error('Reject bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting bid'
    });
  }
};

module.exports = {
  createBid,
  getGigBids,
  getMyBids,
  updateBid,
  acceptBid,
  rejectBid
};
