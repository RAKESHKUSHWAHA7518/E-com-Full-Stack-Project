import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import moment from 'moment';

const getPaymentBadgeClass = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDeliveryBadgeClass = (status) => {
  switch (status) {
    case 'processing': return 'bg-gray-100 text-gray-700';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatDeliveryLabel = (status) => {
  switch (status) {
    case 'processing': return 'Processing';
    case 'shipped': return 'Shipped';
    case 'out_for_delivery': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status || 'Processing';
  }
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const truncatedId = order._id ? `#${order._id.substring(0, 8)}...` : '—';
  const formattedDate = order.createdAt ? moment(order.createdAt).format('MMM DD, YYYY') : '—';
  const formattedAmount = typeof order.totalAmount === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)
    : '—';

  const firstProduct = order.products?.[0];
  const itemCount = order.products?.length || 0;

  return (
    <div
      onClick={() => navigate(`/orders/${order._id}`)}
      className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-red-100"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {firstProduct?.productImage ? (
          <img src={firstProduct.productImage} alt={firstProduct.productName || 'Product'} className="w-full h-full object-cover" />
        ) : (
          <FiPackage className="text-gray-400 text-2xl" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-gray-500">{truncatedId}</span>
          {itemCount > 1 && <span className="text-xs text-gray-400">{itemCount} items</span>}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{formattedDate}</p>
        <p className="font-semibold text-gray-800 mt-1">{formattedAmount}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentBadgeClass(order.status)}`}>
          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '—'}
        </span>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getDeliveryBadgeClass(order.deliveryStatus)}`}>
          {formatDeliveryLabel(order.deliveryStatus)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
