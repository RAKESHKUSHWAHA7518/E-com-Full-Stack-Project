# Implementation Plan: Product Reviews & Ratings

## Overview

Implement a verified-purchase reviews and ratings system on the existing MERN stack. The backend adds a Review model, review controller, and routes; the frontend adds Redux slice, reusable components, and wires them into the product detail and listing pages.

## Tasks

- [x] 1. Create the Review Mongoose model and extend the Product model
  - Create `Backend/models/reviewModel.js` with the schema defined in the design (userId, productId, rating, reviewText, helpfulVotes, helpfulVotedBy, timestamps)
  - Add the unique compound index `{ userId: 1, productId: 1 }` to enforce one review per user per product
  - Add `averageRating`, `reviewCount`, and `ratingBreakdown` fields to `Backend/models/productModel.js`
  - _Requirements: 2.4, 3.4, 6.4_

- [x] 2. Implement the rating aggregation helper and review controller
  - [x] 2.1 Create `Backend/controller/review/reviewController.js` with the `recalculateAggregates(productId)` helper using the MongoDB aggregation pipeline from the design
  - [x] 2.2 Implement `createReview`: verified-purchase check via Order model, duplicate check, save review, call `recalculateAggregates`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 2.3 Implement `getProductReviews`: paginated + sorted (createdAt / helpfulVotes) query, return reviews + aggregates
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 2.4 Implement `updateReview`: owner-only check, validate updated fields, save, call `recalculateAggregates`
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  - [x] 2.5 Implement `deleteReview`: owner-or-admin check, delete document, call `recalculateAggregates`
    - _Requirements: 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_
  - [x] 2.6 Implement `toggleHelpfulVote`: auth check, duplicate vote rejection (409), add/remove userId from `helpfulVotedBy`, sync `helpfulVotes` count
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [ ]* 2.7 Write property test for verified purchase enforcement (Property 1)
    - **Property 1: Verified Purchase Enforcement**
    - **Validates: Requirements 1.1, 1.2**
  - [ ]* 2.8 Write property test for one review per user per product (Property 2)
    - **Property 2: One Review Per User Per Product**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 2.9 Write property test for review input validation (Property 3)
    - **Property 3: Review Input Validation**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [ ]* 2.10 Write property test for review ownership enforcement (Property 4)
    - **Property 4: Review Ownership Enforcement**
    - **Validates: Requirements 4.1, 4.2, 4.4**
  - [ ]* 2.11 Write property test for admin authorization (Property 5)
    - **Property 5: Admin Authorization**
    - **Validates: Requirements 5.1, 5.2**
  - [ ]* 2.12 Write property test for rating aggregation invariant (Property 6)
    - **Property 6: Rating Aggregation Invariant**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
  - [ ]* 2.13 Write property test for pagination and sorting correctness (Property 7)
    - **Property 7: Pagination and Sorting Correctness**
    - **Validates: Requirements 7.2, 7.3, 7.4**
  - [ ]* 2.14 Write property test for helpful vote round-trip invariant (Property 8)
    - **Property 8: Helpful Vote Round-Trip Invariant**
    - **Validates: Requirements 9.1, 9.3, 9.4**
  - [ ]* 2.15 Write property test for duplicate vote rejection (Property 9)
    - **Property 9: Duplicate Vote Rejection**
    - **Validates: Requirement 9.2**
  - [ ]* 2.16 Write property test for review serialization round-trip (Property 10)
    - **Property 10: Review Serialization Round-Trip**
    - **Validates: Requirements 10.1, 10.2**

- [x] 3. Register review routes in the backend
  - Add the five review routes to `Backend/routes/index.js` using `authToken` middleware where required (as specified in the design's controller table)
  - `POST /api/reviews` → `createReview` (auth required)
  - `GET /api/reviews/:productId` → `getProductReviews` (auth optional)
  - `PUT /api/reviews/:reviewId` → `updateReview` (auth required)
  - `DELETE /api/reviews/:reviewId` → `deleteReview` (auth required)
  - `POST /api/reviews/:reviewId/helpful` → `toggleHelpfulVote` (auth required)
  - _Requirements: 1.3, 3.5, 4.4, 5.1, 9.5_

- [ ] 4. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Add review API entries to the frontend SummaryApi and create the Redux slice
  - [x] 5.1 Add the five review endpoint entries to `frontend/src/common/index.js` as specified in the design
    - _Requirements: 7.5, 8.1_
  - [x] 5.2 Create `frontend/src/store/reviewSlice.js` with the state shape and five async thunks (`fetchProductReviews`, `submitReview`, `editReview`, `removeReview`, `voteHelpful`) from the design
    - _Requirements: 7.2, 7.3, 9.1, 9.4_
  - [x] 5.3 Register `reviewReducer` in `frontend/src/store/store.js`
    - _Requirements: 7.1_

- [x] 6. Build reusable review UI components
  - [x] 6.1 Create `frontend/src/components/reviews/StarRating.js` — renders filled/half/empty stars; supports interactive mode with `onChange` prop
    - _Requirements: 7.1, 8.1_
  - [x] 6.2 Create `frontend/src/components/reviews/RatingBreakdown.js` — bar chart of per-star counts using `averageRating`, `reviewCount`, `ratingBreakdown` props
    - _Requirements: 6.1, 6.2, 7.5_
  - [x] 6.3 Create `frontend/src/components/reviews/ReviewForm.js` — star picker + textarea form; handles both create and edit modes via `existingReview` prop; dispatches `submitReview` or `editReview`
    - _Requirements: 3.1, 3.2, 3.3, 4.3_
  - [x] 6.4 Create `frontend/src/components/reviews/ReviewCard.js` — displays reviewer name, star rating, review text, date, helpful vote button; shows edit/delete controls for owner; dispatches `removeReview` and `voteHelpful`
    - _Requirements: 7.1, 4.4, 9.1, 9.4_
  - [x] 6.5 Create `frontend/src/components/reviews/ReviewList.js` — fetches reviews via `fetchProductReviews`, renders paginated list with sort controls, `RatingBreakdown`, and `ReviewForm`
    - _Requirements: 7.2, 7.3, 7.4, 7.5_
  - [ ]* 6.6 Write unit tests for StarRating component
    - Test star rendering for integer and fractional ratings, interactive onChange callback
    - _Requirements: 7.1, 8.1_
  - [ ]* 6.7 Write unit tests for ReviewForm component
    - Test validation feedback for out-of-range rating and oversized reviewText
    - _Requirements: 3.2, 3.3_
  - [ ]* 6.8 Write unit tests for ReviewCard component
    - Test edit/delete visibility for owner vs non-owner, helpful vote button state
    - _Requirements: 4.1, 9.1_

- [x] 7. Integrate reviews into the ProductDetails page and product listing
  - [x] 7.1 Import and render `ReviewList` inside `frontend/src/pages/ProductDetails.js`, passing the product ID
    - _Requirements: 7.1, 7.5_
  - [x] 7.2 Import and render `StarRating` on the product card component used in listing pages, reading `averageRating` and `reviewCount` from product data
    - _Requirements: 8.1, 8.2_
  - [ ]* 7.3 Write integration tests for the review creation flow
    - Use `supertest` + `mongodb-memory-server`; verify create → aggregate update → fetch returns updated aggregates
    - _Requirements: 6.3, 6.4_
  - [ ]* 7.4 Write integration tests for pagination and admin delete
    - Verify page slices are correct, admin can delete any review, unauthenticated requests are rejected
    - _Requirements: 5.1, 7.3, 9.5_

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` (install with `npm install --save-dev fast-check` in the Backend directory)
- Integration tests use `supertest` + `mongodb-memory-server`
- Each property test must include the tag comment: `// Feature: product-reviews-ratings, Property N: <property_title>`
- All controllers follow the existing `try/catch` + `res.status(N).json({ success, message, data })` pattern
