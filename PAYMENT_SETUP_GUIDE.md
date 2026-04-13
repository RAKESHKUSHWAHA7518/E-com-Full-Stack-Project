# Stripe Payment Gateway Integration - Setup Guide

## Overview
This guide will help you complete the setup and test the Stripe payment gateway integration in your e-commerce application.

## What's Been Implemented

### Backend ✅
- **Order Model** - MongoDB schema for storing orders
- **Stripe Service** - Centralized Stripe SDK integration
- **Checkout Controller** - Session creation and management
- **Webhook Handler** - Payment event processing (order creation, status updates)
- **Order Controller** - Customer and admin order retrieval
- **Routes** - All payment and order API endpoints

### Frontend ✅
- **Redux Slices** - Payment and order state management
- **Checkout Component** - Initiate payment flow
- **Success/Cancel Pages** - Post-payment user experience
- **Order History** - Customer order viewing
- **Admin Dashboard** - Order management for administrators
- **Routing** - All payment-related routes configured

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables

**Backend** (`Backend/.env`):
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 3. Set Up Stripe Webhook (Development)

For local development, use Stripe CLI to forward webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:8080/api/webhook/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `Backend/.env`

### 4. Start the Application

**Backend:**
```bash
cd Backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### 5. Test the Payment Flow

#### Test Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)

#### Testing Steps:
1. Add products to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. You'll be redirected to Stripe Checkout
5. Enter test card details
6. Complete payment
7. You'll be redirected to success page
8. Check order history at `/orders`
9. Admin can view all orders at `/admin-panel/orders`

### 6. Verify Webhook Processing

With Stripe CLI running, you should see webhook events in the terminal:
```
✔ Webhook signing secret: whsec_xxxxx
⣾ Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
2024-04-13 10:30:15   --> checkout.session.completed [evt_xxxxx]
2024-04-13 10:30:15   <-- [200] POST http://localhost:8080/api/webhook/stripe [evt_xxxxx]
```

## How to Use in Your Cart Page

Add the Checkout component to your existing Cart page:

```javascript
import Checkout from '../components/Checkout';

// In your Cart component
<Checkout 
  cartData={cartData} 
  totalAmount={totalAmount} 
/>
```

## Admin Access

To view all orders, ensure your user has `role: 'ADMIN'` in the database:

```javascript
// In MongoDB
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "ADMIN" } }
)
```

Then access: `http://localhost:3000/admin-panel/orders`

## API Endpoints

### Payment Endpoints
- `POST /api/checkout/create-session` - Create checkout session
- `GET /api/checkout/success` - Get order details after payment
- `GET /api/checkout/cancel` - Handle cancelled checkout
- `POST /api/webhook/stripe` - Stripe webhook handler

### Order Endpoints
- `GET /api/orders/user` - Get authenticated user's orders
- `GET /api/orders/all` - Get all orders (admin only)
- `GET /api/orders/:orderId` - Get specific order details

## Troubleshooting

### Orders not being created
- Check that Stripe CLI is running and forwarding webhooks
- Verify webhook secret in `.env` matches Stripe CLI output
- Check backend console for webhook errors

### Checkout button not working
- Verify Stripe publishable key in frontend `.env`
- Check browser console for errors
- Ensure cart has items

### Admin dashboard shows 403 error
- Verify user has `role: 'ADMIN'` in database
- Check JWT token is valid

## Production Deployment

### 1. Switch to Live Keys
Replace test keys with live keys in `.env` files:
- `sk_live_...` for backend
- `pk_live_...` for frontend

### 2. Configure Production Webhook
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your production URL: `https://yourdomain.com/api/webhook/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret to production `.env`

### 3. Enable HTTPS
Ensure your production server uses HTTPS (required by Stripe)

## Next Steps

### Optional Enhancements
- Add email notifications for order confirmations
- Implement order status tracking
- Add refund functionality for admins
- Add invoice generation
- Implement shipping address collection
- Add multiple payment methods (Apple Pay, Google Pay)

### Testing (Optional Tasks in tasks.md)
- Property-based tests for correctness properties
- Unit tests for controllers and components
- Integration tests with Stripe test mode

## Support

If you encounter issues:
1. Check Stripe Dashboard → **Developers** → **Logs** for API errors
2. Check backend console for webhook processing errors
3. Check browser console for frontend errors
4. Review Stripe documentation: https://stripe.com/docs

## Security Reminders

✅ Never commit `.env` files to version control
✅ Use test keys for development
✅ Always verify webhook signatures
✅ Calculate prices server-side (never trust client)
✅ Use HTTPS in production

---

**Congratulations!** Your Stripe payment gateway integration is ready to use. Start testing with the test cards above!
