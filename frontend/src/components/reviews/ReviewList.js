import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductReviews, setSort, clearReviews } from '../../store/reviewSlice';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import RatingBreakdown from './RatingBreakdown';
import { Link } from 'react-router-dom';

const backendDomain = process.env.REACT_APP_BACKEND_URL;

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, aggregates, pagination, sort, loading } = useSelector(state => state.review);
  const { user } = useSelector(state => state.user);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  useEffect(() => {
    dispatch(clearReviews());
    setShowForm(false);
    setHasPurchased(false);
  }, [productId]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews({ productId, page, sort }));
    }
  }, [productId, page, sort, dispatch]);

  // Check if user has purchased this product via dedicated endpoint
  useEffect(() => {
    if (!user?._id || !productId) return;

    const checkPurchase = async () => {
      setCheckingPurchase(true);
      try {
        const res = await fetch(`${backendDomain}/api/orders/check-purchase/${productId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setHasPurchased(data.hasPurchased === true);
      } catch (err) {
        console.error('Purchase check failed:', err);
        // On error, fall back to allowing — backend will enforce anyway
        setHasPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user?._id, productId]);

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
    setPage(1);
  };

  const handleReviewSuccess = () => {
    setShowForm(false);
    dispatch(fetchProductReviews({ productId, page: 1, sort }));
  };

  const userAlreadyReviewed = reviews.some(
    r => r.userId?._id?.toString() === user?._id?.toString()
  );

  // Determine what to show in the review CTA area
  const renderReviewCTA = () => {
    if (!user) {
      return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-gray-500 text-sm">
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
            {' '}to write a review
          </span>
        </div>
      );
    }

    if (checkingPurchase) {
      return (
        <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
      );
    }

    if (userAlreadyReviewed) {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✅ You have already reviewed this product
        </div>
      );
    }

    if (!hasPurchased) {
      return (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-amber-700 text-sm">
            🛒 You need to <strong>purchase this product</strong> before writing a review.
          </span>
          <Link
            to="/"
            className="ml-auto text-xs px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 whitespace-nowrap"
          >
            Shop Now
          </Link>
        </div>
      );
    }

    if (!showForm) {
      return (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm"
        >
          ✍️ Write a Review
        </button>
      );
    }

    return null;
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>

      {/* Rating Breakdown */}
      <RatingBreakdown
        averageRating={aggregates.averageRating}
        reviewCount={aggregates.reviewCount}
        ratingBreakdown={aggregates.ratingBreakdown}
      />

      {/* Review CTA */}
      {renderReviewCTA()}

      {/* Review Form - only shown to verified buyers */}
      {showForm && hasPurchased && (
        <ReviewForm
          productId={productId}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Sort Controls */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="createdAt">Most Recent</option>
            <option value="helpfulVotes">Most Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No reviews yet</p>
          {hasPurchased && !userAlreadyReviewed && (
            <p className="text-sm mt-1">You purchased this — be the first to review!</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={user?._id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            ← Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
