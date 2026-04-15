# Implementation Plan: Wishlist / Save for Later

## Overview

Implement a persistent per-user wishlist following the existing MERN patterns in the codebase. Backend uses Express + Mongoose + `authToken` middleware. Frontend uses Redux Toolkit slice, React components with Tailwind CSS, and `react-icons`.

## Tasks

- [x] 1. Create the Wishlist Mongoose model and backend controller
  - [x] 1.1 Create `Backend/models/wishlistModel.js` with `userId`, `productId`, `timestamps`, and a compound unique index on `(userId, productId)`
    - _Requirements: 2.1, 1.3_
  - [ ]* 1.2 Write property test for wishlist document schema invariant
    - **Property 4: Wishlist document schema invariant**
    - **Validates: Requirements 2.1**
  - [x] 1.3 Create `Backend/controller/wishlist/wishlistController.js` with `toggleWishlist`, `getUserWishlist`, and `getWishlistAnalytics` functions
    - `toggleWishlist`: find existing entry for `(req.userId, productId)` — delete if found, insert if not; handle duplicate key error as "already added"
    - `getUserWishlist`: return array of productId strings for `req.userId`
    - `getWishlistAnalytics`: admin-only aggregation returning top 20 products by wishlist count descending; return 403 for non-admin roles
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 8.1, 8.3, 8.4_
  - [ ]* 1.4 Write property test for toggle add inserts the product
    - **Property 1: Toggle add inserts the product**
    - **Validates: Requirements 1.1**
  - [ ]* 1.5 Write property test for toggle round-trip returns to original state
    - **Property 2: Toggle round-trip returns to original state**
    - **Validates: Requirements 1.2**
  - [ ]* 1.6 Write property test for wishlist uniqueness invariant
    - **Property 3: Wishlist uniqueness invariant**
    - **Validates: Requirements 1.3**
  - [ ]* 1.7 Write property test for analytics results sorted descending and bounded
    - **Property 9: Analytics results are sorted descending and bounded**
    - **Validates: Requirements 8.1**
  - [ ]* 1.8 Write property test for non-admin users receiving 403 from analytics endpoint
    - **Property 10: Non-admin users receive 403 from analytics endpoint**
    - **Validates: Requirements 8.4**

- [x] 2. Register wishlist routes in the backend
  - [x] 2.1 Add wishlist routes to `Backend/routes/index.js`
    - `POST /api/wishlist/toggle` → `authToken` → `toggleWishlist`
    - `GET /api/wishlist` → `authToken` → `getUserWishlist`
    - `GET /api/wishlist/analytics` → `authToken` → `getWishlistAnalytics`
    - _Requirements: 1.1, 1.2, 8.3_

- [x] 3. Add wishlist API entries to the frontend common index
  - [x] 3.1 Add `toggleWishlist`, `getUserWishlist`, and `getWishlistAnalytics` entries to `frontend/src/common/index.js`
    - _Requirements: 1.1, 2.2, 8.1_

- [x] 4. Create the Redux wishlist slice
  - [x] 4.1 Create `frontend/src/store/wishlistSlice.js` with `fetchWishlist` and `toggleWishlist` async thunks
    - State shape: `{ items: [], loading: false, error: null }` where `items` is an array of productId strings
    - `toggleWishlist` performs an optimistic update: update `items` immediately, then call the API; roll back on error
    - Export `selectWishlistCount` selector (`items.length`)
    - _Requirements: 2.2, 2.3, 3.3_
  - [x] 4.2 Register `wishlistReducer` in `frontend/src/store/store.js`
    - _Requirements: 2.2_
  - [ ]* 4.3 Write property test for heart icon state reflecting Redux membership
    - **Property 5: Heart icon state reflects Redux membership**
    - **Validates: Requirements 2.3, 3.1, 3.2**
  - [ ]* 4.4 Write property test for header count badge reflecting wishlist size
    - **Property 6: Header count badge reflects wishlist size**
    - **Validates: Requirements 4.1, 4.2**

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create the HeartButton component and wire it into product surfaces
  - [x] 6.1 Create `frontend/src/components/HeartButton.js`
    - Props: `{ productId }`. Read `items` from Redux to determine filled/unfilled state. Dispatch `toggleWishlist` on click. Redirect to `/login` if user is not authenticated (check `user._id` from Redux).
    - Use `FaHeart` / `FaRegHeart` from `react-icons/fa`
    - _Requirements: 1.1, 1.2, 1.5, 3.1, 3.2, 3.3_
  - [x] 6.2 Add `<HeartButton productId={product._id} />` to `frontend/src/components/VerticalCard.js` on each product card
    - Position the button as an overlay on the product image (top-right corner), matching the card's existing layout
    - _Requirements: 3.1, 3.2_
  - [x] 6.3 Add `<HeartButton productId={productId} />` to `frontend/src/pages/ProductDetails.js` near the add-to-cart button
    - _Requirements: 3.1, 3.2_

- [x] 7. Add wishlist icon and count badge to the Header
  - [x] 7.1 Update `frontend/src/components/Header.js` to add a wishlist icon with count badge, mirroring the existing cart badge pattern
    - Use `FaHeart` from `react-icons/fa` and link to `/wishlist`
    - Read `selectWishlistCount` from Redux for the badge number
    - Only render the badge when `user._id` is truthy
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Dispatch `fetchWishlist` on app mount
  - [x] 8.1 Update `frontend/src/App.js` to dispatch `fetchWishlist` inside the existing `useEffect` alongside `fetchUserDetails` and `fetchUserAddToCart`
    - _Requirements: 2.2_

- [x] 9. Create the WishlistPage
  - [x] 9.1 Create `frontend/src/pages/WishlistPage.js`
    - On mount, fetch full product details for each productId in `wishlistSlice.items` (use the existing `productDetails` API entry)
    - Render a product card per item showing image, name, category, selling price, original price, an "Add to Cart" button (calls existing `addToCart` helper and refreshes cart count via `fetchUserAddToCart` from Context), and a "Remove" button (dispatches `toggleWishlist`)
    - Show empty-state message with a link to `/` when `items` is empty
    - Redirect to `/login` when user is not authenticated
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 7.1, 7.2, 7.3_
  - [ ]* 9.2 Write property test for WishlistPage rendering all required product fields
    - **Property 7: Wishlist page renders all required product fields**
    - **Validates: Requirements 5.1**
  - [ ]* 9.3 Write property test for WishlistPage removal updating displayed list
    - **Property 8: Wishlist page removal updates displayed list**
    - **Validates: Requirements 7.2**

- [x] 10. Create the AdminWishlistAnalytics page
  - [x] 10.1 Create `frontend/src/pages/AdminWishlistAnalytics.js`
    - Fetch `GET /api/wishlist/analytics` on mount and render a table of top 20 products with product image, name, category, and wishlist count
    - Show an error message if the request returns 403
    - _Requirements: 8.1, 8.2_
  - [x] 10.2 Add "Wishlist Analytics" nav link to `frontend/src/pages/Adminpanel.js` pointing to `wishlist-analytics`
    - _Requirements: 8.1_

- [x] 11. Register frontend routes
  - [x] 11.1 Add `/wishlist` route (element: `<WishlistPage />`) and `admin-panel/wishlist-analytics` child route (element: `<AdminWishlistAnalytics />`) to `frontend/src/routes/index.js`
    - _Requirements: 5.1, 8.1_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property-based tests use **fast-check** (`npm install --save-dev fast-check`); backend tests mock MongoDB with `mongodb-memory-server`
- Each task references specific requirements for traceability
- Optimistic updates in `wishlistSlice` must roll back on API error (toast the error message)
- The compound unique index on `(userId, productId)` in the Wishlist model enforces uniqueness at the DB level
