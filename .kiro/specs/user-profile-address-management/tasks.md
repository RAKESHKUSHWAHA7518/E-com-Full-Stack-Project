# Implementation Plan: User Profile & Address Management

## Overview

Implement user profile editing, multi-address management, and enhanced order history following the existing MERN patterns. Backend uses Express controllers, Mongoose models, and the `authToken` middleware. Frontend uses Redux Toolkit slices, React components with Tailwind CSS, and `react-icons`. Addresses are embedded in the user document; order history gains pagination, a per-order detail page, and a delivery status timeline.

## Tasks

- [x] 1. Extend the User and Order Mongoose models
  - [x] 1.1 Add `addressSchema` subdocument and `phone` field to `Backend/models/userModel.js`
    - Define `addressSchema` with fields: `fullName`, `phone`, `addressLine1`, `addressLine2` (optional), `city`, `state`, `postalCode` (regex `/^[A-Za-z0-9\-]{3,10}$/`), `country`, `isDefault` (Boolean, default `false`), and Mongoose `timestamps`
    - Add `phone: { type: String, default: '' }` to `userSchema`
    - Add `addresses: { type: [addressSchema], default: [], validate: [v => v.length <= 5, 'Maximum 5 addresses allowed'] }` to `userSchema`
    - _Requirements: 4.1, 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 1.2 Add `deliveryStatus`, `deliveryStatusUpdatedAt`, and `shippingAddress` fields to `Backend/models/orderModel.js`
    - `deliveryStatus`: enum `['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']`, default `'processing'`, indexed
    - `deliveryStatusUpdatedAt`: `Date`, default `Date.now`
    - `shippingAddress`: embedded object with `fullName`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country`, `phone` (all `String`)
    - _Requirements: 10.1, 10.2, 9.1_

- [x] 2. Implement the profile backend controller
  - [x] 2.1 Create `Backend/controller/user/profileController.js` with `getProfile`, `updateProfile`, and `uploadProfilePic` functions
    - `getProfile`: read `req.userId`, return `{ name, email, phone, profilePic, role }` — never return `password`
    - `updateProfile`: accept `{ name?, phone? }` in body; validate `name` 2–50 chars and `phone` matches `/^\+?[0-9]{10,15}$/` when provided; return 400 with descriptive message on failure; return updated user on success
    - `uploadProfilePic`: accept `multipart/form-data` field `profilePic` via `multer` memory storage; validate MIME type (`image/jpeg`, `image/png`, `image/webp`) and size ≤ 2 MB; upload to Cloudinary via `cloudinary.uploader.upload_stream`; on success update `user.profilePic` in MongoDB and return new URL; on Cloudinary failure return 500 without updating MongoDB
    - Install `multer` and `cloudinary` packages if not already present
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.6, 11.1, 11.3, 11.5_
  - [ ]* 2.2 Write property test for profile update round-trip
    - **Property 1: Profile update round-trip**
    - **Validates: Requirements 2.1**
  - [ ]* 2.3 Write property test for name validation rejects out-of-range lengths
    - **Property 2: Name validation rejects out-of-range lengths**
    - **Validates: Requirements 2.2, 2.4**
  - [ ]* 2.4 Write property test for phone validation rejects non-conforming strings
    - **Property 3: Phone validation rejects non-conforming strings**
    - **Validates: Requirements 2.3, 2.5**

- [x] 3. Implement the address backend controller
  - [x] 3.1 Create `Backend/controller/user/addressController.js` with `getAddresses`, `addAddress`, `updateAddress`, `deleteAddress`, and `setDefaultAddress` functions
    - `getAddresses`: return `user.addresses` array for `req.userId`
    - `addAddress`: validate all required fields and postal code regex; enforce max 5 addresses (return 400 if limit reached); push new address to `user.addresses` and save
    - `updateAddress`: find address by `addressId` in `user.addresses`; return 403 if not found (ownership check); validate fields; update and save
    - `deleteAddress`: find address by `addressId` in `user.addresses`; return 403 if not found; remove from array; if deleted address was default and array is now empty, no further action needed; save
    - `setDefaultAddress`: set `isDefault: true` on target address and `isDefault: false` on all others atomically; return 403 if address not found in user's array
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 7.1, 7.2, 7.3, 7.4, 11.2, 11.4, 11.5_
  - [ ]* 3.2 Write property test for address limit enforcement
    - **Property 4: Address limit enforcement**
    - **Validates: Requirements 4.2, 4.3**
  - [ ]* 3.3 Write property test for address ownership isolation
    - **Property 5: Address ownership isolation**
    - **Validates: Requirements 5.3, 11.4**
  - [ ]* 3.4 Write property test for default address mutual exclusivity
    - **Property 6: Default address mutual exclusivity**
    - **Validates: Requirements 6.1, 6.2**
  - [ ]* 3.5 Write property test for default address cleared on last-address deletion
    - **Property 7: Default address cleared on last-address deletion**
    - **Validates: Requirements 5.4**
  - [ ]* 3.6 Write property test for postal code validation rejects non-conforming values
    - **Property 8: Postal code validation rejects non-conforming values**
    - **Validates: Requirements 4.5, 7.4**

- [x] 4. Extend the order backend controller
  - [x] 4.1 Update `Backend/controller/order/orderController.js` to add pagination to `getUserOrders` and add `updateDeliveryStatus`
    - `getUserOrders`: add `page` (default 1) and `limit` (default 10, max 10) query params; return `{ data, total, page, totalPages }`
    - `updateDeliveryStatus`: accept `{ deliveryStatus }` in body; validate against enum; verify `req.userId` belongs to an admin (return 403 otherwise); update `deliveryStatus` and set `deliveryStatusUpdatedAt = new Date()`; return updated order
    - _Requirements: 8.5, 10.1, 10.2, 10.5, 10.6_
  - [ ]* 4.2 Write property test for delivery status transition preserves timestamp
    - **Property 9: Delivery status transition preserves timestamp**
    - **Validates: Requirements 10.1, 10.2**
  - [ ]* 4.3 Write property test for non-admin delivery status update is rejected
    - **Property 10: Non-admin delivery status update is rejected**
    - **Validates: Requirements 10.6**
  - [ ]* 4.4 Write property test for order pagination consistency
    - **Property 11: Order pagination consistency**
    - **Validates: Requirements 8.5**

- [x] 5. Register new backend routes
  - [x] 5.1 Add profile and address routes to `Backend/routes/index.js`
    - `GET  /api/profile` → `authToken` → `getProfile`
    - `PUT  /api/profile` → `authToken` → `updateProfile`
    - `POST /api/profile/upload-pic` → `authToken` → `uploadProfilePic`
    - `GET  /api/addresses` → `authToken` → `getAddresses`
    - `POST /api/addresses` → `authToken` → `addAddress`
    - `PUT  /api/addresses/:addressId` → `authToken` → `updateAddress`
    - `DELETE /api/addresses/:addressId` → `authToken` → `deleteAddress`
    - `PUT  /api/addresses/:addressId/default` → `authToken` → `setDefaultAddress`
    - `PUT  /api/orders/:orderId/delivery-status` → `authToken` → `updateDeliveryStatus`
    - _Requirements: 11.1, 11.2, 11.5_

- [x] 6. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Add API entries to the frontend common index
  - [x] 7.1 Add profile, address, and delivery-status entries to `frontend/src/common/index.js`
    - `getProfile`: `GET /api/profile`
    - `updateProfile`: `PUT /api/profile`
    - `uploadProfilePic`: `POST /api/profile/upload-pic`
    - `getAddresses`: `GET /api/addresses`
    - `addAddress`: `POST /api/addresses`
    - `updateAddress`: `PUT /api/addresses/:addressId`
    - `deleteAddress`: `DELETE /api/addresses/:addressId`
    - `setDefaultAddress`: `PUT /api/addresses/:addressId/default`
    - `updateDeliveryStatus`: `PUT /api/orders/:orderId/delivery-status`
    - Update `getUserOrders` entry to support `?page=&limit=` query params (URL stays the same; callers append params)
    - _Requirements: 1.1, 2.1, 3.1, 4.6, 5.1, 6.1, 8.5, 10.5_

- [x] 8. Create the Redux address slice and extend the order slice
  - [x] 8.1 Create `frontend/src/store/addressSlice.js` with async thunks and reducers
    - State shape: `{ addresses: [], loading: false, error: null }`
    - Thunks: `fetchAddresses`, `addAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`
    - Each thunk calls the corresponding `SummaryApi` entry and dispatches the result back into state
    - Export `selectAddresses`, `selectDefaultAddress` selectors
    - _Requirements: 4.6, 5.1, 5.5, 6.1, 6.3_
  - [x] 8.2 Extend `frontend/src/store/orderSlice.js` to support pagination and selected order
    - Add `selectedOrder: null`, `pagination: { page: 1, totalPages: 1, total: 0 }` to state
    - Update `fetchUserOrders` thunk to accept `{ page, limit }` and store pagination metadata
    - Add `fetchOrderById` thunk (may already exist — update to store result in `selectedOrder`)
    - Add `clearSelectedOrder` action
    - _Requirements: 8.5, 9.1, 9.2_
  - [x] 8.3 Register `addressReducer` in `frontend/src/store/store.js`
    - _Requirements: 4.6_

- [x] 9. Create profile components
  - [x] 9.1 Create `frontend/src/components/profile/ProfileInfoForm.js`
    - Controlled form with `name` and `phone` fields
    - Client-side validation: name 2–50 chars, phone matches `/^\+?[0-9]{10,15}$/` when non-empty
    - On submit dispatch `updateProfile` API call; show `toast.success` on success and `toast.error` on failure
    - Show inline field-level validation error messages
    - Pre-populate fields from Redux `userSlice` user object
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 9.2 Create `frontend/src/components/profile/ProfilePicUpload.js`
    - Display current `profilePic` (or a default avatar icon when absent)
    - Hidden `<input type="file" accept="image/jpeg,image/png,image/webp" />` triggered by clicking the avatar
    - On file selection: validate size ≤ 2 MB client-side; POST to `uploadProfilePic` as `multipart/form-data`; show loading spinner during upload; update displayed image on success via `toast.success`; show `toast.error` on failure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 9.3 Create `frontend/src/components/profile/AddressCard.js`
    - Display all address fields for a single address
    - Show a "Default" badge when `isDefault` is true
    - Provide "Edit", "Delete", and "Set as Default" action buttons
    - "Delete" shows an inline confirmation before dispatching `deleteAddress`
    - "Set as Default" dispatches `setDefaultAddress`
    - _Requirements: 5.5, 6.3_
  - [x] 9.4 Create `frontend/src/components/profile/AddressFormModal.js`
    - Modal form with fields: `fullName`, `phone`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country`
    - Client-side validation matching backend rules (required fields, postal code regex, phone regex)
    - Works in both "add" mode (empty form) and "edit" mode (pre-populated from existing address)
    - On submit dispatch `addAddress` or `updateAddress` thunk; close modal on success; show `toast.error` on failure
    - _Requirements: 4.1, 4.4, 4.5, 4.6, 5.1_
  - [x] 9.5 Create `frontend/src/components/profile/AddressManager.js`
    - On mount dispatch `fetchAddresses`
    - Render a list of `<AddressCard />` components
    - Show an "Add New Address" button (disabled and showing a tooltip when 5 addresses already saved)
    - Clicking "Add New Address" opens `<AddressFormModal />` in add mode
    - Clicking "Edit" on an `AddressCard` opens `<AddressFormModal />` in edit mode with that address pre-populated
    - Show skeleton loaders while `addressSlice.loading` is true
    - _Requirements: 4.2, 4.3, 5.5, 6.3_

- [x] 10. Create order components
  - [x] 10.1 Create `frontend/src/components/orders/OrderCard.js`
    - Display: truncated order ID, order date (formatted), order total, payment status badge, delivery status badge, and thumbnail of the first product image
    - Clicking the card navigates to `/orders/:orderId`
    - Use the same `getStatusBadgeClass` colour pattern as the existing `OrderHistory` page
    - Add a separate colour mapping for `deliveryStatus` values
    - _Requirements: 8.1, 8.2_
  - [x] 10.2 Create `frontend/src/components/orders/DeliveryStatusTimeline.js`
    - Render a horizontal (or vertical on mobile) step-by-step timeline for the five delivery statuses: `processing → shipped → out_for_delivery → delivered` (and a separate `cancelled` state)
    - Highlight completed and current steps visually
    - Show `deliveryStatusUpdatedAt` timestamp next to the current step
    - When `deliveryStatus` is `delivered`, display the delivery completion date prominently
    - _Requirements: 10.3, 10.4_
  - [x] 10.3 Create `frontend/src/components/common/SkeletonCard.js`
    - Reusable animated skeleton placeholder matching the approximate dimensions of an `OrderCard`
    - Accept a `count` prop to render multiple skeletons
    - _Requirements: 8.4_

- [x] 11. Checkpoint — Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Create the ProfilePage
  - [x] 12.1 Create `frontend/src/pages/ProfilePage.js`
    - On mount: check authentication (redirect to `/login` if `user._id` is falsy); dispatch `fetchAddresses`
    - Render `<ProfilePicUpload />`, `<ProfileInfoForm />`, and `<AddressManager />` in a single-page layout
    - Show a loading skeleton for the profile section while `userSlice` is loading
    - Show an error message with a "Retry" button if the profile load fails (re-dispatch `fetchUserDetails`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 13. Enhance the OrderHistory page
  - [x] 13.1 Rewrite `frontend/src/pages/OrderHistory.js` to use `<OrderCard />` components and pagination
    - Replace the existing inline order rendering with `<OrderCard />` per order
    - Replace the spinner loading state with `<SkeletonCard count={3} />`
    - Add pagination controls (Previous / Next buttons) that dispatch `fetchUserOrders({ page, limit: 10 })`
    - Keep the existing empty-state illustration and "Start Shopping" link
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 14. Create the OrderDetailPage
  - [x] 14.1 Create `frontend/src/pages/OrderDetailPage.js`
    - On mount: dispatch `fetchOrderById(orderId)` using the `:orderId` route param; redirect to `/login` if unauthenticated
    - Display: order ID, order date, all products with images and quantities, itemised prices, order total, payment status badge, shipping address snapshot, and `<DeliveryStatusTimeline />`
    - Show a "← Back to Orders" link that navigates to `/orders`
    - Show a 404 message if the order is not found or does not belong to the user
    - Dispatch `clearSelectedOrder` on unmount
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.3, 10.4_

- [x] 15. Add delivery status updater to the Admin Orders page
  - [x] 15.1 Add a `DeliveryStatusUpdater` inline control to `frontend/src/pages/AdminOrders.js`
    - For each order row, add a `<select>` dropdown pre-set to the current `deliveryStatus`
    - On change, call `PUT /api/orders/:orderId/delivery-status` via `SummaryApi.updateDeliveryStatus`; show `toast.success` on success and `toast.error` on failure
    - Refresh the order list after a successful update
    - _Requirements: 10.5_

- [x] 16. Update the Header to include a profile link
  - [x] 16.1 Update `frontend/src/components/Header.js` to add a "My Profile" link in the dropdown menu
    - Add `<Link to="/profile">My Profile</Link>` inside the existing dropdown `<nav>` block, alongside the existing "My Orders" link
    - Only render when `user?._id` is truthy (already gated by the parent `if` block)
    - _Requirements: 12.1, 12.2, 12.3_

- [x] 17. Register new frontend routes
  - [x] 17.1 Add `/profile` and `/orders/:orderId` routes to `frontend/src/routes/index.js`
    - Import `ProfilePage` and `OrderDetailPage`
    - Add `{ path: 'profile', element: <ProfilePage /> }` as a child of the root route
    - Add `{ path: 'orders/:orderId', element: <OrderDetailPage /> }` as a child of the root route
    - _Requirements: 1.4, 9.1_

- [x] 18. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property-based tests use **fast-check** (`npm install --save-dev fast-check`); backend tests mock MongoDB with `mongodb-memory-server`
- Each task references specific requirements for traceability
- Addresses are embedded in the user document — no separate collection needed
- The `shippingAddress` field on orders is a snapshot; it is not linked to the user's saved addresses
- `multer` memory storage is used for profile picture uploads before streaming to Cloudinary
- The existing `authToken` middleware already sets `req.userId`; all new controllers rely on it
- Pagination in `getUserOrders` uses `skip`/`limit` on the Mongoose query; `totalPages = Math.ceil(total / limit)`
- The `deliveryStatus` field defaults to `'processing'` for all new orders; existing orders without the field will show `undefined` — handle gracefully in the frontend with a fallback
