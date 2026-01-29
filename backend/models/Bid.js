const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposalText: {
    type: String,
    required: [true, 'Proposal text is required']
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [1, 'Bid amount must be at least 1']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Delivery time is required'],
    min: [1, 'Delivery time must be at least 1 day']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  milestones: [{
    description: String,
    amount: Number,
    dueDate: Date
  }]
}, {
  timestamps: true
});

// Indexes
bidSchema.index({ gigId: 1, status: 1 });
bidSchema.index({ freelancerId: 1 });
bidSchema.index({ clientId: 1 });

module.exports = mongoose.model('Bid', bidSchema);
