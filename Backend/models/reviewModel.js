const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  reviewText: {
    type: String,
    default: '',
    maxlength: [2000, 'Review text cannot exceed 2000 characters'],
    trim: true
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  helpfulVotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, { timestamps: true });

// Enforce one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;
