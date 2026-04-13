const addToCartModel = require('../../models/cartProduct');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');
const { createCheckoutSession, retrieveSession } = require('../../services/stripeService');

/**
 * Create Stripe Checkout Session
 * Validates cart, fetches current prices, creates Stripe session
 */
async function createCheckoutSessionController(req, res) {
  try {
    const userId = req.userId; // From authToken middleware

    // Fetch user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User not found'
      });
    }

    // Fetch user's cart items
    const cartItems = await addToCartModel.find({ userId: userId });

    // Validate cart is not empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Cart is empty. Please add items before checkout.'
      });
    }

    // Fetch current product prices from database
    const productIds = cartItems.map(item => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    // Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Validate all products exist and calculate total
    let totalAmount = 0;
    const lineItems = [];

    for (const cartItem of cartItems) {
      const product = productMap[cartItem.productId];
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: true,
          message: 'Some products in your cart are no longer available.'
        });
      }

      // Use sellingPrice if available, otherwise use price
      const productPrice = product.sellingPrice || product.price;
      const itemTotal = productPrice * cartItem.quantity;
      totalAmount += itemTotal;

      // Create line item for Stripe
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.productName,
            images: product.productImage && product.productImage.length > 0 
              ? [product.productImage[0]] 
              : [],
            description: product.brandName || product.category
          },
          unit_amount: Math.round(productPrice * 100) // Convert to cents
        },
        quantity: cartItem.quantity
      });
    }

    // Create metadata for order tracking
    const metadata = {
      userId: userId.toString(),
      customerEmail: user.email,
      customerName: user.name,
      totalAmount: totalAmount.toString()
    };

    // Create Stripe checkout session
    const successUrl = `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/checkout/cancel`;

    const session = await createCheckoutSession(lineItems, metadata, successUrl, cancelUrl);

    // Log checkout session creation
    console.log('Checkout session created:', {
      sessionId: session.id,
      userId: userId,
      totalAmount: totalAmount,
      itemCount: cartItems.length
    });

    return res.status(200).json({
      success: true,
      error: false,
      sessionId: session.id,
      sessionUrl: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', {
      error: error.message,
      stack: error.stack,
      userId: req.userId
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Payment service temporarily unavailable. Please try again later.'
    });
  }
}

/**
 * Handle successful checkout
 * Retrieves session and returns order details
 */
async function checkoutSuccess(req, res) {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Session ID is required'
      });
    }

    // Retrieve session from Stripe
    const session = await retrieveSession(session_id);

    return res.status(200).json({
      success: true,
      error: false,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total / 100 // Convert from cents
      }
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Unable to retrieve order details. Please contact support.'
    });
  }
}

/**
 * Handle cancelled checkout
 */
async function checkoutCancel(req, res) {
  try {
    console.log('Checkout cancelled by user:', {
      userId: req.userId,
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Checkout cancelled'
    });

  } catch (error) {
    console.error('Error handling checkout cancellation:', error);

    return res.status(500).json({
      success: false,
      error: true,
      message: 'An error occurred'
    });
  }
}

module.exports = {
  createCheckoutSessionController,
  checkoutSuccess,
  checkoutCancel
};
