const Gig = require('../models/Gig');
const Bid = require('../models/Bid');

// Get all gigs
exports.getAllGigs = async (req, res) => {
  try {
    const { category, search, minBudget, maxBudget, status } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'open';
    
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const gigs = await Gig.find(query)
      .populate('clientId', 'displayName profileImage rating')
      .sort('-createdAt')
      .lean();
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs'
    });
  }
};

// Get single gig
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('clientId', 'displayName email profileImage rating totalReviews');
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gig'
    });
  }
};

// Create gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, category, budget, budgetType, deadline, skills } = req.body;

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const gig = await Gig.create({
      clientId: req.user._id,
      title,
      description,
      category,
      budget,
      budgetType: budgetType || 'fixed',
      deadline,
      skills: skills || []
    });
    
    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig
    });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating gig'
    });
  }
};

// Update gig
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    if (gig.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }
    
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      gig: updatedGig
    });
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gig'
    });
  }
};

// Delete gig
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    if (gig.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }
    
    await Gig.findByIdAndDelete(req.params.id);
    await Bid.deleteMany({ gigId: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gig'
    });
  }
};

// Get my gigs
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ clientId: req.user._id })
      .sort('-createdAt')
      .lean();
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs'
    });
  }
};
