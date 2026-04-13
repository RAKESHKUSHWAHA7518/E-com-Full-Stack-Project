import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckoutSession } from '../store/paymentSlice';
import { toast } from 'react-toastify';

const Checkout = ({ cartData, totalAmount }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!cartData || cartData.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await dispatch(createCheckoutSession()).unwrap();
      
      if (result.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl;
      } else {
        toast.error('Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (err) {
      toast.error(err || 'Failed to initiate checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-5 lg:mt-0 w-full max-w-sm">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Items ({cartData?.length || 0})</span>
            <span>${totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg text-gray-800">
              <span>Total</span>
              <span>${totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || isProcessing || !cartData || cartData.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading || isProcessing || !cartData || cartData.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading || isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Secure checkout powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
