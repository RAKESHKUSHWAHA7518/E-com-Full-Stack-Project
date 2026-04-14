# Requirements Document

## Introduction

This feature adds a Product Reviews & Ratings system to the existing MERN stack e-commerce application. Customers who have completed a paid purchase containing a specific product can submit a star rating (1–5) and a written review for that product. The system enforces verified-purchase gating, one-review-per-user-per-product, and provides aggregate rating data (average score, rating breakdown) displayed on both product listing and product detail pages. Users can edit or delete their own reviews. Admins can delete any review deemed inappropriate. Reviews support sorting (most recent, most helpful) and pagination.

---

## Glossary

- **Review**: A record submitted by a verified buyer containing a star rating (1–5) and optional written text for a specific product.
- **Rating**: The integer star value (1–5) component of a Review.
- **Verified_Buyer**: A user whose Order has `status: "paid"` and whose `products` array contains the target product ID.
- **Review_System**: The backend service responsible for creating, reading, updating, deleting, and aggregating Reviews.
- **Rating_Aggregator**: The component that computes and stores the average rating and per-star breakdown for a product.
- **Review_List**: The paginated, sortable collection of Reviews displayed on the product detail page.
- **Admin**: A user with `role: "ADMIN"` in the User model.
- **Helpful_Vote**: A record indicating that a user found a specific Review useful, used for "most helpful" sorting.
- **Order**: An existing document in the Order model with fields `userId`, `products[].productId`, and `status`.

---

## Requirements

### Requirement 1: Verified Purchase Enforcement

**User Story:** As a customer, I want only verified buyers to be able to leave reviews, so that product ratings reflect genuine purchase experiences.

#### Acceptance Criteria

1. WHEN a user submits a review for a product, THE Review_System SHALL verify that at least one Order exists with `userId` matching the requesting user, `status` equal to `"paid"`, and `products[].productId` matching the target product ID.
2. IF no qualifying paid Order is found for the user and product, THEN THE Review_System SHALL reject the request with HTTP 403 and a message indicating the user must purchase the product before reviewing.
3. THE Review_System SHALL perform the verified-purchase check server-side using the existing Order model, independent of any client-supplied flag.

---

### Requirement 2: One Review Per User Per Product

**User Story:** As a store owner, I want each customer to submit only one review per product, so that ratings are not inflated by duplicate submissions.

#### Acceptance Criteria

1. WHEN a user submits a review, THE Review_System SHALL check whether a Review already exists with the same `userId` and `productId`.
2. IF a duplicate Review is detected, THEN THE Review_System SHALL reject the request with HTTP 409 and a message indicating the user has already reviewed this product.
3. WHEN a verified buyer who has already submitted a review edits that review, THE Review_System SHALL update the existing Review record rather than creating a new one.
4. THE Review_System SHALL enforce the one-review-per-user-per-product constraint using a unique compound index on `userId` and `productId` in the Review collection.

---

### Requirement 3: Review Submission

**User Story:** As a verified buyer, I want to submit a star rating and written review for a product I purchased, so that I can share my experience with other shoppers.

#### Acceptance Criteria

1. WHEN a verified buyer submits a review, THE Review_System SHALL accept a `rating` integer between 1 and 5 inclusive and an optional `reviewText` string with a maximum length of 2000 characters.
2. IF the submitted `rating` is outside the range 1–5, THEN THE Review_System SHALL reject the request with HTTP 400 and a descriptive validation error.
3. IF the submitted `reviewText` exceeds 2000 characters, THEN THE Review_System SHALL reject the request with HTTP 400 and a descriptive validation error.
4. WHEN a review is successfully created, THE Review_System SHALL store the `userId`, `productId`, `rating`, `reviewText`, `createdAt`, and `updatedAt` fields.
5. WHEN a review is successfully created, THE Review_System SHALL respond with HTTP 201 and the created Review document.

---

### Requirement 4: Review Editing and Deletion by Owner

**User Story:** As a verified buyer, I want to edit or delete my own review, so that I can correct mistakes or remove outdated feedback.

#### Acceptance Criteria

1. WHEN a user submits an edit request for a review, THE Review_System SHALL verify that the `userId` on the Review matches the requesting user's ID.
2. IF the requesting user is not the owner of the Review, THEN THE Review_System SHALL reject the edit request with HTTP 403.
3. WHEN an owner edits a review, THE Review_System SHALL accept updated `rating` and `reviewText` values subject to the same validation rules as submission.
4. WHEN an owner deletes their review, THE Review_System SHALL remove the Review document and respond with HTTP 200.
5. IF the review to be edited or deleted does not exist, THEN THE Review_System SHALL respond with HTTP 404.

---

### Requirement 5: Admin Review Moderation

**User Story:** As an admin, I want to delete any review, so that I can remove inappropriate or abusive content from the platform.

#### Acceptance Criteria

1. WHEN an Admin sends a delete request for any Review, THE Review_System SHALL delete the specified Review document regardless of ownership.
2. IF the requesting user does not have `role: "ADMIN"`, THEN THE Review_System SHALL reject the admin delete request with HTTP 403.
3. IF the review to be deleted does not exist, THEN THE Review_System SHALL respond with HTTP 404.
4. WHEN an Admin deletes a review, THE Review_System SHALL respond with HTTP 200 and a confirmation message.

---

### Requirement 6: Rating Aggregation

**User Story:** As a shopper, I want to see the average rating and rating breakdown for a product, so that I can quickly assess overall customer satisfaction.

#### Acceptance Criteria

1. THE Rating_Aggregator SHALL compute the average rating for a product as the arithmetic mean of all Review `rating` values for that product, rounded to one decimal place.
2. THE Rating_Aggregator SHALL compute the count of Reviews for each star value (1 through 5) for a product.
3. WHEN a Review is created, edited, or deleted, THE Rating_Aggregator SHALL update the aggregate rating data for the affected product.
4. THE Rating_Aggregator SHALL store `averageRating`, `reviewCount`, and `ratingBreakdown` (counts for stars 1–5) on the Product document or in a dedicated aggregation document.
5. WHEN a product has zero reviews, THE Rating_Aggregator SHALL return `averageRating` of 0 and `reviewCount` of 0.

---

### Requirement 7: Review Display on Product Detail Page

**User Story:** As a shopper, I want to read reviews on the product detail page, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. WHEN a product detail page is loaded, THE Review_List SHALL display each review's reviewer name, star rating, review text, and submission date.
2. THE Review_List SHALL support sorting by `createdAt` descending (most recent) and by `helpfulVotes` descending (most helpful).
3. THE Review_List SHALL support pagination with a configurable page size defaulting to 10 reviews per page.
4. WHEN a page number or sort parameter is provided, THE Review_System SHALL return only the Reviews for that page in the requested sort order.
5. WHEN the product detail page is loaded, THE Review_System SHALL return the `averageRating`, `reviewCount`, and `ratingBreakdown` alongside the paginated Review_List.

---

### Requirement 8: Rating Display on Product Listing Page

**User Story:** As a shopper, I want to see average ratings on product cards in the listing page, so that I can compare products at a glance.

#### Acceptance Criteria

1. WHEN the product listing page is loaded, THE Review_System SHALL include `averageRating` and `reviewCount` in the product data returned for each product.
2. WHEN a product has no reviews, THE Review_System SHALL return `averageRating` of 0 and `reviewCount` of 0 for that product.

---

### Requirement 9: Helpful Votes

**User Story:** As a shopper, I want to mark a review as helpful, so that the most useful reviews surface to the top.

#### Acceptance Criteria

1. WHEN an authenticated user marks a review as helpful, THE Review_System SHALL record a Helpful_Vote associating that user with that Review.
2. THE Review_System SHALL prevent a user from casting more than one Helpful_Vote per Review; IF a duplicate vote is submitted, THEN THE Review_System SHALL reject it with HTTP 409.
3. WHEN a Helpful_Vote is recorded, THE Review_System SHALL increment the `helpfulVotes` count on the Review document.
4. WHEN an authenticated user removes their helpful vote, THE Review_System SHALL decrement the `helpfulVotes` count and remove the Helpful_Vote record.
5. THE Review_System SHALL allow unauthenticated users to view `helpfulVotes` counts but SHALL reject vote submission from unauthenticated users with HTTP 401.

---

### Requirement 10: Review Data Integrity (Round-Trip)

**User Story:** As a developer, I want review data to serialize and deserialize correctly through the API, so that no data is lost or corrupted between client and server.

#### Acceptance Criteria

1. FOR ALL valid Review objects, serializing a Review to JSON and deserializing it SHALL produce an equivalent Review object with identical `userId`, `productId`, `rating`, `reviewText`, `createdAt`, and `updatedAt` values (round-trip property).
2. WHEN the Review API returns a Review, THE Review_System SHALL include all required fields (`_id`, `userId`, `productId`, `rating`, `reviewText`, `createdAt`, `updatedAt`, `helpfulVotes`) in the response body.
3. IF any required field is missing from a create or update request, THEN THE Review_System SHALL respond with HTTP 400 and identify the missing field.
