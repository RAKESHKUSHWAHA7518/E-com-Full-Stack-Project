const mongoose = require('mongoose');
const reviewModel = require('../../models/reviewModel');
const productModel = require('../../models/productModel');
const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel');

// ─── Aggregation Helper ───────────────────────────────────────────────────────

async function recalculateAggregates(productId) {
  const result = await reviewModel.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        breakdown: { $push: '$rating' }
      }
    }
  ]);

  if (result.length === 0) {
    await productModel.findByIdAndUpdate(productId, {
      averageRating: 0, reviewCount: 0,
      'ratingBreakdown.1': 0, 'ratingBreakdown.2': 0,
      'ratingBreakdown.3': 0, 'ratingBreakdown.4': 0, 'ratingBreakdown.5': 0
    });
    return;
  }

  const { averageRating, reviewCount, breakdown } = result[0];
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  breakdown.forEach(r => counts[r]++);

  await productModel.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
    'ratingBreakdown.1': counts[1],
    'ratingBreakdown.2': counts[2],
    'ratingBreakdown.3': counts[3],
    'ratingBreakdown.4': counts[4],
    'ratingBreakdown.5': counts[5]
  });
}

// ─── Create Review ────────────────────────────────────────────────────────────

async function createReview(req, res) {
  try {
    const userId = req.userId;
    const { productId, rating, reviewText } = req.body;

    // Verified purchase check - accept paid or pending (webhook may be delayed)
    const paidOrder = await orderModel.findOne({
      userId,
      status: { $in: ['paid', 'pending'] },
      'products.productId': productId
    });

    if (!paidOrder) {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'You must purchase this product before reviewing'
      });
    }

    // Duplicate review check
    const existing = await reviewModel.findOne({ userId, productId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: true,
        message: 'You have already reviewed this product'
      });
    }

    const review = new reviewModel({ userId, productId, rating, reviewText });
    await review.save();
    await recalculateAggregates(productId);

    const populated = await reviewModel
      .findById(review._id)
      .populate('userId', 'name profilePic');

    return res.status(201).json({ success: true, error: false, data: populated });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: true, message: error.message });
    }
    console.error('createReview error:', error);
    return res.status(500).json({ success: false, error: true, message: 'Server error' });
  }
}

// ─── Get Product Reviews ──────────────────────────────────────────────────────

async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sort = req.query.sort === 'helpfulVotes' ? { helpfulVotes: -1 } : { createdAt: -1 };

    const skip = (page - 1) * pageSize;
    const totalCount = await reviewModel.countDocuments({ productId });

    const reviews = await reviewModel
      .find({ productId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('userId', 'name profilePic')
      .lean();

    const product = await productModel
      .findById(productId)
      .select('averageRating reviewCount ratingBreakdown')
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: {
        reviews,
        aggregates: {
          averageRating: product?.averageRating || 0,
          reviewCount: product?.reviewCount || 0,
          ratingBreakdown: product?.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        }
      }
    });

  } catch (error) {
    console.error('getProductReviews error:', error);
    return res.status(500).json({ success: false, error: true, message: 'Server error' });
  }
}

// ─── Update Review ────────────────────────────────────────────────────────────

async function updateReview(req, res) {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: true, message: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false, error: true,
        message: 'You are not authorized to modify this review'
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;

    await review.save();
    await recalculateAggregates(review.productId);

    const populated = await reviewModel
      .findById(review._id)
      .populate('userId', 'name profilePic');

    return res.status(200).json({ success: true, error: false, data: populated });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: true, message: error.message });
    }
    console.error('updateReview error:', error);
    return res.status(500).json({ success: false, error: true, message: 'Server error' });
  }
}

// ─── Delete Review ────────────────────────────────────────────────────────────

async function deleteReview(req, res) {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: true, message: 'Review not found' });
    }

    const user = await userModel.findById(userId);
    const isOwner = review.userId.toString() === userId.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false, error: true,
        message: 'You are not authorized to delete this review'
      });
    }

    const productId = review.productId;
    await reviewModel.findByIdAndDelete(reviewId);
    await recalculateAggregates(productId);

    return res.status(200).json({ success: true, error: false, message: 'Review deleted successfully' });

  } catch (error) {
    console.error('deleteReview error:', error);
    return res.status(500).json({ success: false, error: true, message: 'Server error' });
  }
}

// ─── Toggle Helpful Vote ──────────────────────────────────────────────────────

async function toggleHelpfulVote(req, res) {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: true, message: 'Review not found' });
    }

    const alreadyVoted = review.helpfulVotedBy.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyVoted) {
      // Remove vote
      review.helpfulVotedBy = review.helpfulVotedBy.filter(
        id => id.toString() !== userId.toString()
      );
      review.helpfulVotes = review.helpfulVotedBy.length;
      await review.save();
      return res.status(200).json({ success: true, error: false, data: review, voted: false });
    } else {
      // Add vote
      review.helpfulVotedBy.push(userId);
      review.helpfulVotes = review.helpfulVotedBy.length;
      await review.save();
      return res.status(200).json({ success: true, error: false, data: review, voted: true });
    }

  } catch (error) {
    console.error('toggleHelpfulVote error:', error);
    return res.status(500).json({ success: false, error: true, message: 'Server error' });
  }
}

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleHelpfulVote
};
