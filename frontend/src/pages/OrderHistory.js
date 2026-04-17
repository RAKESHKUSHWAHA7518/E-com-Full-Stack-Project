import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../store/orderSlice';
import OrderCard from '../components/orders/OrderCard';
import SkeletonCard from '../components/common/SkeletonCard';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { userOrders, loading, pagination } = useSelector(state => state.order);
  const { page, totalPages } = pagination;

  useEffect(() => {
    dispatch(fetchUserOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchUserOrders({ page: newPage, limit: 10 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard count={3} />
          </div>
        ) : !userOrders || userOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {userOrders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
