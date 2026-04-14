import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeReview, voteHelpful } from '../../store/reviewSlice';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { toast } from 'react-toastify';
import moment from 'moment';

const ReviewCard = ({ review, currentUserId }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);

  const isOwner = currentUserId && review.userId?._id === currentUserId;
  const hasVoted = review.helpfulVotedBy?.includes(currentUserId);

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await dispatch(removeReview(review._id)).unwrap();
      toast.success('Review deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete review');
    }
  };

  const handleHelpful = async () => {
    if (!currentUserId) { toast.error('Please login to vote'); return; }
    try {
      await dispatch(voteHelpful(review._id)).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to vote');
    }
  };

  if (editing) {
    return (
      <ReviewForm
        productId={review.productId}
        existingReview={review}
        onSuccess={() => setEditing(false)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {review.userId?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{review.userId?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{moment(review.createdAt).format('MMM DD, YYYY')}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.reviewText && (
        <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleHelpful}
          className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            hasVoted
              ? 'border-blue-400 text-blue-600 bg-blue-50'
              : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          👍 Helpful ({review.helpfulVotes || 0})
        </button>

        {isOwner && (
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)}
              className="text-xs text-blue-600 hover:underline">Edit</button>
            <button onClick={handleDelete}
              className="text-xs text-red-500 hover:underline">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
