const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stripeSessionId: {
    type: String,
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0.01, 'Total amount must be positive']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
    index: true
  },
  paymentGateway: {
    type: String,
    default: 'stripe'
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for admin queries (status + createdAt)
orderSchema.index({ status: 1, createdAt: -1 });

// Text index for search functionality
orderSchema.index({ customerEmail: 'text', customerName: 'text' });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
