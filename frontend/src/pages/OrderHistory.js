import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../store/orderSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { userOrders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  console.log(userOrders);
  
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>

        {userOrders && userOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-medium text-gray-800">{order._id}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-800">
                      {moment(order.createdAt).format('MMM DD, YYYY')}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Products */}
                <div className="space-y-3 mb-4">
                  {order.products.map((product, index) => (
                    <Link
                      key={index}
                      to={`/product/${product.productId._id}`}
                      className="flex items-center gap-4 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 hover:text-blue-600">{product.productName}</p>
                        <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                        <p className="text-xs text-blue-500 mt-1">Click to view & review →</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-800">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
