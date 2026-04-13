# Implementation Plan: Payment Gateway Integration

## Overview

This implementation plan breaks down the Stripe payment gateway integration into discrete coding tasks. The approach follows the existing MERN stack patterns: backend controllers and routes for API endpoints, Mongoose models for data persistence, React components for UI, and Redux slices for state management. The implementation prioritizes security (webhook signature verification, server-side price calculation), reliability (idempotent order creation), and user experience (clear error handling, order tracking).

## Tasks

- [x] 1. Set up project dependencies and environment configuration
  - Install Stripe SDK in backend: `npm install stripe`
  - Install Stripe.js and React Stripe in frontend: `npm install @stripe/stripe-js @stripe/react-stripe-js`
  - Install fast-check for property-based testing: `npm install --save-dev fast-check`
  - Add environment variables to Backend/.env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FRONTEND_URL
  - Add environment variables to frontend/.env: REACT_APP_STRIPE_PUBLISHABLE_KEY, REACT_APP_API_URL
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Create Order data model and database indexes
  - [x] 2.1 Create Order model schema in Backend/models/orderModel.js
    - Define schema with fields: userId, paymentIntentId, stripeSessionId, products array, totalAmount, status, paymentGateway, customerEmail, customerName, timestamps
    - Add validation: totalAmount > 0, quantity > 0, status enum
    - Create indexes: paymentIntentId (unique), userId, status, createdAt, compound index (status + createdAt), text index (customerEmail + customerName)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 2.2 Write property test for Order model validation
    - **Property 16: Positive Total Amount**
    - **Property 17: Positive Integer Quantities**
    - **Property 18: Status Enum Validation**
    - **Validates: Requirements 11.2, 11.3, 11.4**

  - [ ]* 2.3 Write unit tests for Order model
    - Test valid order creation
    - Test default status is 'pending'
    - Test invalid status rejection
    - Test negative amount rejection
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 3. Implement Stripe service layer
  - [x] 3.1 Create Stripe service in Backend/services/stripeService.js
    - Initialize Stripe client with secret key from environment
    - Implement createCheckoutSession function
    - Implement retrieveSession function
    - Implement constructWebhookEvent function with signature verification
    - _Requirements: 1.1, 1.2, 1.3, 5.2_

  - [ ]* 3.2 Write unit tests for Stripe service
    - Test Stripe client initialization
    - Test checkout session creation with mocked Stripe SDK
    - Test session retrieval
    - Test webhook event construction with valid/invalid signatures
    - _Requirements: 1.3, 1.4, 5.2, 5.3_

- [x] 4. Implement checkout controller and session creation
  - [x] 4.1 Create checkout controller in Backend/controller/payment/checkoutController.js
    - Implement createCheckoutSession function: validate cart, fetch product prices, calculate total, create Stripe session
    - Implement checkoutSuccess function: retrieve session, verify payment, return order details
    - Implement checkoutCancel function: log cancellation, return response
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2_

  - [ ]* 4.2 Write property tests for checkout controller
    - **Property 1: Cart Validation**
    - **Property 2: Server-Side Price Calculation**
    - **Property 3: Error Response Format**
    - **Property 20: Cart Ownership Verification**
    - **Validates: Requirements 2.1, 2.3, 2.6, 9.1, 9.2, 12.3**

  - [ ]* 4.3 Write unit tests for checkout controller
    - Test valid checkout with items in cart
    - Test empty cart rejection
    - Test unauthenticated request rejection
    - Test Stripe API error handling
    - _Requirements: 2.1, 2.2, 2.6_

- [x] 5. Implement webhook handler for payment events
  - [x] 5.1 Create webhook controller in Backend/controller/payment/webhookController.js
    - Implement handleStripeWebhook function: verify signature, parse event type, route to event handlers
    - Implement handleCheckoutSessionCompleted: create order, store product snapshot, clear cart, set status to 'pending'
    - Implement handlePaymentIntentSucceeded: find order by payment intent ID, update status to 'paid'
    - Implement handlePaymentIntentFailed: find/create order, update status to 'failed'
    - Implement handleChargeRefunded: find order, update status to 'refunded'
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 5.2 Write property tests for webhook handler
    - **Property 4: Order Creation on Payment Success**
    - **Property 5: Order Field Completeness**
    - **Property 6: Cart Clearing After Order**
    - **Property 7: Webhook Signature Verification**
    - **Property 9: Cart Preservation on Failure**
    - **Property 13: Payment Amount Validation**
    - **Property 14: Order Total Integrity**
    - **Property 15: Idempotent Order Creation**
    - **Validates: Requirements 4.1, 4.2, 4.4, 5.2, 5.3, 6.5, 9.3, 9.5, 10.1, 10.2, 10.3**

  - [ ]* 5.3 Write unit tests for webhook handler
    - Test valid signature verification
    - Test invalid signature rejection
    - Test payment success event handling
    - Test payment failure event handling
    - Test refund event handling
    - Test unknown event type handling
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 6. Checkpoint - Ensure backend payment processing tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement order controller for order retrieval
  - [x] 7.1 Create order controller in Backend/controller/order/orderController.js
    - Implement getUserOrders function: query orders by userId, sort by createdAt descending, populate product details
    - Implement getAllOrders function: verify admin role, query all orders, support status filtering, support search by customer email/name
    - Implement getOrderById function: fetch order, verify ownership or admin role, populate details
    - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 7.2 Write property tests for order controller
    - **Property 10: Chronological Order Sorting**
    - **Property 11: Admin Role Authorization**
    - **Property 12: Search Filtering**
    - **Property 21: Order Ownership Verification**
    - **Validates: Requirements 7.2, 8.2, 8.5, 12.4**

  - [ ]* 7.3 Write unit tests for order controller
    - Test customer fetches own orders
    - Test admin fetches all orders
    - Test non-admin attempts admin endpoint (403 error)
    - Test order not found error
    - _Requirements: 7.1, 8.1, 8.2, 8.6_

- [x] 8. Create backend routes and wire controllers
  - [x] 8.1 Add payment and order routes to Backend/routes/index.js
    - Add POST /api/checkout/create-session with authToken middleware
    - Add GET /api/checkout/success with authToken middleware
    - Add GET /api/checkout/cancel with authToken middleware
    - Add POST /api/webhook/stripe with express.raw() middleware (no authToken)
    - Add GET /api/orders/user with authToken middleware
    - Add GET /api/orders/all with authToken middleware
    - Add GET /api/orders/:orderId with authToken middleware
    - _Requirements: 2.2, 5.1, 7.1, 8.1, 12.1, 12.2, 12.5_

  - [ ]* 8.2 Write property test for JWT authentication enforcement
    - **Property 19: JWT Authentication Enforcement**
    - **Validates: Requirements 12.1, 12.2**

- [x] 9. Implement error logging for payment operations
  - [x] 9.1 Add structured logging to all payment controllers
    - Log checkout session creation attempts with customer ID and cart total
    - Log webhook events with event type and payment intent ID
    - Log payment operation failures with error message and stack trace
    - Log webhook signature verification failures with request headers
    - Log order creation events with order ID and status
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 9.2 Write property test for operation logging
    - **Property 22: Operation Logging**
    - **Validates: Requirements 13.1, 13.2, 13.5**

- [ ] 10. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create Redux slices for payment and order state management
  - [x] 11.1 Create payment slice in frontend/src/store/paymentSlice.js
    - Define state: sessionId, sessionUrl, loading, error
    - Implement createCheckoutSession async thunk
    - Implement resetPaymentState action
    - _Requirements: 2.4, 2.5_

  - [x] 11.2 Create order slice in frontend/src/store/orderSlice.js
    - Define state: userOrders, allOrders, currentOrder, loading, error
    - Implement fetchUserOrders async thunk
    - Implement fetchAllOrders async thunk
    - Implement fetchOrderById async thunk
    - Implement clearOrders action
    - _Requirements: 7.1, 7.3, 8.1, 8.3_

  - [ ]* 11.3 Write unit tests for Redux slices
    - Test payment slice actions and reducers
    - Test order slice actions and reducers
    - Mock API calls
    - _Requirements: 2.4, 7.1, 8.1_

- [x] 12. Implement Checkout component
  - [x] 12.1 Create Checkout component in frontend/src/components/Checkout.js
    - Implement handleCheckout function: dispatch createCheckoutSession, redirect to Stripe URL
    - Display cart summary with product details and total
    - Display checkout button with loading state
    - Display error messages for validation failures
    - _Requirements: 2.1, 2.5, 2.6_

  - [ ]* 12.2 Write unit tests for Checkout component
    - Test checkout button triggers session creation
    - Test loading state display
    - Test error message display
    - Mock Redux store and actions
    - _Requirements: 2.5, 2.6_

- [x] 13. Implement Checkout Success and Cancel pages
  - [x] 13.1 Create CheckoutSuccess component in frontend/src/pages/CheckoutSuccess.js
    - Extract session_id from URL parameters
    - Fetch order details on component mount
    - Display success message, order summary, order ID, product list, total amount
    - Add link to order history
    - _Requirements: 3.4, 4.1_

  - [x] 13.2 Create CheckoutCancel component in frontend/src/pages/CheckoutCancel.js
    - Display cancellation message
    - Add link back to cart
    - Add option to retry checkout
    - _Requirements: 6.1, 6.3_

  - [ ]* 13.3 Write unit tests for success and cancel pages
    - Test success page displays order details
    - Test cancel page displays retry option
    - Mock order data and routing
    - _Requirements: 3.4, 6.1_

- [x] 14. Implement Order History component for customers
  - [x] 14.1 Create OrderHistory component in frontend/src/pages/OrderHistory.js
    - Fetch user orders on component mount using fetchUserOrders
    - Display orders in reverse chronological order
    - Display order cards/table with date, status, total, products
    - Add status badges (paid, pending, failed, refunded)
    - Add view details button for each order
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 14.2 Write unit tests for OrderHistory component
    - Test orders display correctly
    - Test status badges render
    - Mock Redux store with order data
    - _Requirements: 7.3, 7.4_

- [x] 15. Implement Admin Orders dashboard
  - [x] 15.1 Create AdminOrders component in frontend/src/pages/AdminOrders.js
    - Fetch all orders on component mount using fetchAllOrders
    - Display data table with columns: Order ID, Customer, Date, Total, Status, Actions
    - Implement filter dropdown for status
    - Implement search input for customer email/name
    - Add pagination controls (optional for MVP)
    - Add view details button per order
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 15.2 Write unit tests for AdminOrders component
    - Test admin dashboard displays all orders
    - Test status filter interaction
    - Test search filter interaction
    - Mock Redux store with admin order data
    - _Requirements: 8.3, 8.4, 8.5_

- [x] 16. Add routing for payment pages
  - [x] 16.1 Add routes to frontend routing configuration
    - Add /checkout route for Checkout component
    - Add /checkout/success route for CheckoutSuccess component
    - Add /checkout/cancel route for CheckoutCancel component
    - Add /orders route for OrderHistory component
    - Add /admin/orders route for AdminOrders component (admin only)
    - _Requirements: 3.4, 6.1, 7.4, 8.4_

- [x] 17. Implement error handling and user feedback
  - [x] 17.1 Add error handling to all frontend components
    - Display error toasts/messages for API failures
    - Handle authentication errors with redirect to login
    - Handle authorization errors with appropriate messages
    - Display payment failure messages with retry option
    - Display loading states during API calls
    - _Requirements: 2.6, 6.1, 6.3, 12.6_

  - [ ]* 17.2 Write property test for payment failure handling
    - **Property 8: New Session on Retry**
    - **Validates: Requirements 6.4**

- [ ] 18. Checkpoint - Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Integration testing with Stripe test mode
  - [ ]* 19.1 Write integration tests for complete checkout flow
    - Test: Create checkout session → simulate Stripe redirect → trigger webhook → verify order created → verify cart cleared
    - Test: Payment failure flow with cart preservation
    - Test: Order history retrieval
    - Test: Admin dashboard with filters
    - Test: Webhook security with invalid signature
    - Use Stripe test API keys and test card numbers
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.4, 5.2, 6.5, 7.1, 8.1_

- [ ] 20. Final checkpoint and deployment preparation
  - Ensure all tests pass (unit, property, integration)
  - Verify environment variables are configured correctly
  - Test webhook endpoint with Stripe CLI: `stripe listen --forward-to localhost:8080/api/webhook/stripe`
  - Verify database indexes are created
  - Review error logging output
  - Test with Stripe test cards (4242 4242 4242 4242 for success, 4000 0000 0000 0002 for decline)
  - Ask the user if questions arise or if ready for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for user feedback
- Property tests validate universal correctness properties (22 properties total)
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end flows with Stripe test mode
- The implementation follows existing codebase patterns (controllers, routes, models, Redux slices)
- Webhook endpoint must use `express.raw()` middleware to preserve raw body for signature verification
- All payment operations require JWT authentication except the webhook endpoint (uses signature verification)
- Server-side price calculation prevents price manipulation attacks
- Idempotent order creation using payment intent ID prevents duplicate orders
