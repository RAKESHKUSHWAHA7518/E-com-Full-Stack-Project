const Stripe = require('stripe');

// Initialize Stripe with secret key from environment
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 * @param {Array} lineItems - Array of line items for the checkout
 * @param {Object} metadata - Additional metadata to attach to the session
 * @param {String} successUrl - URL to redirect on successful payment
 * @param {String} cancelUrl - URL to redirect on cancelled payment
 * @returns {Promise<Object>} Stripe session object
 */
async function createCheckoutSession(lineItems, metadata, successUrl, cancelUrl) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      customer_email: metadata.customerEmail
    });
    
    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
}

/**
 * Retrieve a Stripe Checkout Session
 * @param {String} sessionId - The Stripe session ID
 * @returns {Promise<Object>} Stripe session object
 */
async function retrieveSession(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    throw error;
  }
}

/**
 * Construct and verify a Stripe webhook event
 * @param {Buffer} payload - Raw request body
 * @param {String} signature - Stripe signature from request headers
 * @param {String} secret - Webhook secret for verification
 * @returns {Object} Verified Stripe event object
 * @throws {Error} If signature verification fails
 */
function constructWebhookEvent(payload, signature, secret) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    throw new Error('Invalid webhook signature');
  }
}

module.exports = {
  stripe,
  createCheckoutSession,
  retrieveSession,
  constructWebhookEvent
};
