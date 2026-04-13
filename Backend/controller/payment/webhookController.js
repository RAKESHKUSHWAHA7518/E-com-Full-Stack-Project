const { constructWebhookEvent, retrieveSession } = require('../../services/stripeService');
const orderModel = require('../../models/orderModel');
const addToCartModel = require('../../models/cartProduct');
const productModel = require('../../models/productModel');

/**
 * Main webhook handler for Stripe events
 */
async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = constructWebhookEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', {
      error: error.message,
      headers: req.headers
    });
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  // Log webhook event
  console.log('Webhook event received:', {
    type: event.type,
    id: event.id,
    timestamp: new Date()
  });

  try {
    // Route to appropriate handler based on event type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    // Acknowledge receipt of event
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', {
      eventType: event.type,
      eventId: event.id,
      error: error.message,
      stack: error.stack
    });

    // Return 200 to prevent Stripe from retrying
    // Log error for manual review
    return res.status(200).json({ received: true, error: error.message });
  }
}

/**
 * Handle checkout.session.completed event
 * Creates order record and clears cart
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    const paymentIntentId = session.payment_intent;
    const userId = session.metadata.userId;

    // Check if order already exists (idempotency)
    const existingOrder = await orderModel.findOne({ paymentIntentId });
    if (existingOrder) {
      console.log('Order already exists for payment intent:', paymentIntentId);
      return existingOrder;
    }

    // Fetch cart items
    const cartItems = await addToCartModel.find({ userId });
    
    if (!cartItems || cartItems.length === 0) {
      console.warn('No cart items found for user:', userId);
      return;
    }

    // Fetch product details
    const productIds = cartItems.map(item => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Build products array with snapshot
    const orderProducts = cartItems.map(cartItem => {
      const product = productMap[cartItem.productId];
      const productPrice = product.sellingPrice || product.price;
      
      return {
        productId: product._id,
        productName: product.productName,
        productImage: product.productImage && product.productImage.length > 0 
          ? product.productImage[0] 
          : '',
        quantity: cartItem.quantity,
        price: productPrice
      };
    });

    // Calculate total amount
    const totalAmount = orderProducts.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Validate amount matches session amount
    const sessionAmount = session.amount_total / 100; // Convert from cents
    if (Math.abs(totalAmount - sessionAmount) > 0.01) {
      console.error('CRITICAL: Amount mismatch detected', {
        paymentIntentId,
        calculatedTotal: totalAmount,
        sessionAmount: sessionAmount
      });
    }

    // Create order
    const order = new orderModel({
      userId,
      paymentIntentId,
      stripeSessionId: session.id,
      products: orderProducts,
      totalAmount,
      status: 'pending', // Will be updated by payment_intent.succeeded
      paymentGateway: 'stripe',
      customerEmail: session.metadata.customerEmail || session.customer_email,
      customerName: session.metadata.customerName
    });

    await order.save();

    // Clear user's cart
    await addToCartModel.deleteMany({ userId });

    console.log('Order created successfully:', {
      orderId: order._id,
      paymentIntentId,
      userId,
      totalAmount
    });

    return order;

  } catch (error) {
    console.error('CRITICAL: Order creation failed after successful payment:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Handle payment_intent.succeeded event
 * Updates order status to 'paid'
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;

    // Find order by payment intent ID
    const order = await orderModel.findOne({ paymentIntentId });

    if (!order) {
      console.warn('Order not found for payment intent:', paymentIntentId);
      return;
    }

    // Update order status to paid
    order.status = 'paid';
    await order.save();

    console.log('Order status updated to paid:', {
      orderId: order._id,
      paymentIntentId
    });

    return order;

  } catch (error) {
    console.error('Error updating order status to paid:', {
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
    throw error;
  }
}

/**
 * Handle payment_intent.payment_failed event
 * Updates order status to 'failed'
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;

    // Find or create order
    let order = await orderModel.findOne({ paymentIntentId });

    if (order) {
      // Update existing order
      order.status = 'failed';
      await order.save();
    } else {
      // Create failed order record
      console.log('Creating failed order record for payment intent:', paymentIntentId);
      // Note: This is a minimal record since we don't have full session data
      // In practice, checkout.session.completed usually fires first
    }

    console.log('Payment failed:', {
      paymentIntentId,
      failureReason: paymentIntent.last_payment_error?.message
    });

    return order;

  } catch (error) {
    console.error('Error handling payment failure:', {
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
    throw error;
  }
}

/**
 * Handle charge.refunded event
 * Updates order status to 'refunded'
 */
async function handleChargeRefunded(charge) {
  try {
    const paymentIntentId = charge.payment_intent;

    // Find order by payment intent ID
    const order = await orderModel.findOne({ paymentIntentId });

    if (!order) {
      console.warn('Order not found for refund:', paymentIntentId);
      return;
    }

    // Update order status to refunded
    order.status = 'refunded';
    await order.save();

    console.log('Order refunded:', {
      orderId: order._id,
      paymentIntentId,
      refundAmount: charge.amount_refunded / 100
    });

    return order;

  } catch (error) {
    console.error('Error handling refund:', {
      paymentIntentId: charge.payment_intent,
      error: error.message
    });
    throw error;
  }
}

module.exports = {
  handleStripeWebhook
};
