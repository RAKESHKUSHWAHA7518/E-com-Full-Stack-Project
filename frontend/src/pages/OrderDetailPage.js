import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { fetchOrderById, clearSelectedOrder } from '../store/orderSlice';
import DeliveryStatusTimeline from '../components/orders/DeliveryStatusTimeline';

const getPaymentBadgeClass = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state?.user?.user);
  const { selectedOrder: order, loading, error } = useSelector(state => state.order);

  // Auth guard
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?._id && orderId) {
      dispatch(fetchOrderById(orderId));
    }
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [orderId, user?._id, dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">Order not found</p>
          <Link to="/orders" className="text-red-600 hover:underline">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const totalAmount = typeof order.totalAmount === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)
    : '—';

  return (
    <div className="container mx-auto p-4 min-h-screen max-w-4xl">
      {/* Back link */}
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline mb-6">
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h1>

      {/* Order summary header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
            <p className="font-mono text-sm font-medium text-gray-800">{order._id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
            <p className="font-medium text-gray-800">{moment(order.createdAt).format('MMM DD, YYYY')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentBadgeClass(order.status)}`}>
              {order.status?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-gray-800">{totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Delivery status timeline */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Status</h2>
        <DeliveryStatusTimeline
          deliveryStatus={order.deliveryStatus}
          deliveryStatusUpdatedAt={order.deliveryStatusUpdatedAt}
        />
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.products?.map((product, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {product.productImage ? (
                  <img src={product.productImage} alt={product.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{product.productName}</p>
                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-800">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price * product.quantity)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-700">Order Total</span>
          <span className="text-xl font-bold text-gray-800">{totalAmount}</span>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h2>
          <div className="text-sm text-gray-700 space-y-1">
            {order.shippingAddress.fullName && <p className="font-medium">{order.shippingAddress.fullName}</p>}
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            {order.shippingAddress.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            {(order.shippingAddress.city || order.shippingAddress.state) && (
              <p>{[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
            )}
            {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
