import React from 'react';
import { FiSettings, FiTruck, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import moment from 'moment';

const STEPS = [
  { key: 'processing', label: 'Processing', icon: FiSettings },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiMapPin },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
];

const STEP_ORDER = ['processing', 'shipped', 'out_for_delivery', 'delivered'];

const DeliveryStatusTimeline = ({ deliveryStatus, deliveryStatusUpdatedAt }) => {
  const formattedDate = deliveryStatusUpdatedAt
    ? moment(deliveryStatusUpdatedAt).format('MMM DD, YYYY')
    : null;

  if (deliveryStatus === 'cancelled') {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-6 py-4">
          <FiXCircle className="text-red-500 text-2xl flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700 text-base">Order Cancelled</p>
            {formattedDate && <p className="text-sm text-red-500 mt-0.5">on {formattedDate}</p>}
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STEP_ORDER.indexOf(deliveryStatus ?? 'processing');

  return (
    <div className="py-4">
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0 mx-8" />

        {STEPS.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;
          const Icon = step.icon;

          const circleClass = isCompleted
            ? 'bg-green-500 border-green-500'
            : isCurrent
            ? 'bg-red-500 border-red-500'
            : 'bg-white border-gray-300';

          const iconClass = isCompleted || isCurrent ? 'text-white' : 'text-gray-400';
          const labelClass = isCompleted
            ? 'text-green-700 font-medium'
            : isCurrent
            ? 'text-red-700 font-semibold'
            : 'text-gray-400';

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${circleClass}`}>
                <Icon className={`text-base ${iconClass}`} />
              </div>
              <p className={`text-xs mt-2 text-center leading-tight ${labelClass}`}>{step.label}</p>
              {isCurrent && formattedDate && (
                <p className="text-xs text-gray-500 mt-1 text-center">{formattedDate}</p>
              )}
            </div>
          );
        })}
      </div>

      {deliveryStatus === 'delivered' && formattedDate && (
        <div className="mt-5 text-center">
          <span className="inline-block bg-green-50 border border-green-200 text-green-700 font-semibold text-sm px-4 py-2 rounded-full">
            ✓ Delivered on {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusTimeline;
