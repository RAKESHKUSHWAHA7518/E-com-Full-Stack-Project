import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, editReview } from '../../store/reviewSlice';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { submitting, error } = useSelector(state => state.review);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }

    try {
      if (existingReview) {
        await dispatch(editReview({ reviewId: existingReview._id, rating, reviewText })).unwrap();
        toast.success('Review updated!');
      } else {
        await dispatch(submitReview({ productId, rating, reviewText })).unwrap();
        toast.success('Review submitted!');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Your Rating *</label>
        <StarRating rating={rating} interactive onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Review <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <p className="text-xs text-gray-400 text-right">{reviewText.length}/2000</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
