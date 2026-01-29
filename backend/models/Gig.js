const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['web-development', 'mobile-development', 'design', 'writing', 'marketing', 'data-entry', 'other']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [1, 'Budget must be at least 1']
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'closed'],
    default: 'open'
  },
  bidsCount: {
    type: Number,
    default: 0
  },
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
gigSchema.index({ clientId: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Gig', gigSchema);
