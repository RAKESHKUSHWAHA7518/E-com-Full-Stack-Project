import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import StarRating from '../components/reviews/StarRating';

const backendDomain = process.env.REACT_APP_BACKEND_URL;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      // Fetch all products first, then get reviews for each
      const prodRes = await fetch(`${backendDomain}/api/get-product`, { credentials: 'include' });
      const prodData = await prodRes.json();
      const products = prodData?.data || [];

      // Fetch reviews for all products in parallel
      const reviewPromises = products.map(p =>
        fetch(`${backendDomain}/api/reviews/${p._id}?pageSize=100`, { credentials: 'include' })
          .then(r => r.json())
          .then(d => (d?.data?.reviews || []).map(rev => ({ ...rev, productName: p.productName, productId: p._id })))
          .catch(() => [])
      );

      const allReviewArrays = await Promise.all(reviewPromises);
      const allReviews = allReviewArrays.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(allReviews);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setDeleting(reviewId);
    try {
      const res = await fetch(`${backendDomain}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        toast.success('Review deleted');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(null);
    }
  };

  // Filter reviews
  const filtered = reviews.filter(r => {
    const matchSearch = search === '' ||
      r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.productName?.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText?.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === '' || r.rating === parseInt(filterRating);
    return matchSearch && matchRating;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-50';
    if (rating === 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Review Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[5, 4, 3, 2, 1].slice(0, 4).map(star => (
          <div key={star} className="bg-white rounded-lg shadow p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {reviews.filter(r => r.rating === star).length}
            </p>
            <div className="flex justify-center mt-1">
              <StarRating rating={star} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by user, product or review text..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>
        <button
          onClick={fetchAllReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing <span className="font-semibold">{filtered.length}</span> of {reviews.length} reviews
      </p>

      {/* Reviews Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No reviews found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Review</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(review => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                        {review.userId?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">
                        {review.userId?.name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/product/${review.productId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline line-clamp-1 max-w-[150px] block"
                    >
                      {review.productName}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getRatingColor(review.rating)}`}>
                      {review.rating} ★
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600 line-clamp-2 max-w-[200px]">
                      {review.reviewText || <span className="text-gray-400 italic">No text</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">👍 {review.helpfulVotes || 0} helpful</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {moment(review.createdAt).format('MMM DD, YYYY')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={deleting === review._id}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors text-xs font-medium disabled:opacity-50"
                    >
                      {deleting === review._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
