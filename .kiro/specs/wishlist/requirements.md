# Requirements Document

## Introduction

This feature adds a Wishlist / Save for Later capability to the existing MERN e-commerce application. Authenticated users can save products they are interested in, view them on a dedicated page, and move them to the shopping cart. The wishlist persists across sessions in MongoDB. A heart icon toggle on product cards and the product detail page provides the primary interaction surface. The header displays a wishlist item count alongside the existing cart count. Admins gain access to analytics showing the most wishlisted products to support merchandising decisions.

## Glossary

- **Wishlist**: A persistent, per-user collection of saved products stored in MongoDB.
- **Wishlist_Service**: The backend Express layer responsible for all wishlist CRUD operations.
- **Wishlist_Store**: The Redux Toolkit slice managing wishlist state on the frontend.
- **Heart_Icon**: The UI toggle control (filled = wishlisted, unfilled = not wishlisted) rendered on product cards and the product detail page.
- **Wishlist_Page**: The dedicated frontend page (`/wishlist`) displaying all products saved by the authenticated user.
- **Admin_Analytics**: The admin panel section displaying aggregated wishlist statistics.
- **authToken**: The existing Express middleware that authenticates requests and sets `req.userId`.
- **Context_Provider**: The existing React `App.js` context that exposes shared state (cart count, fetch helpers) to the component tree.

---

## Requirements

### Requirement 1: Toggle Wishlist Item

**User Story:** As an authenticated user, I want to add or remove a product from my wishlist by clicking a heart icon, so that I can save products I am interested in without adding them to my cart.

#### Acceptance Criteria

1. WHEN an authenticated user clicks the Heart_Icon on a product card or product detail page, THE Wishlist_Service SHALL add the product to the user's Wishlist if it is not already present.
2. WHEN an authenticated user clicks the Heart_Icon on a product that is already in the user's Wishlist, THE Wishlist_Service SHALL remove that product from the Wishlist.
3. THE Wishlist_Service SHALL enforce that each product appears at most once per user Wishlist.
4. WHEN the Wishlist_Service receives a toggle request, THE Wishlist_Service SHALL respond within 500ms under normal load.
5. IF an unauthenticated user clicks the Heart_Icon, THEN THE frontend SHALL redirect the user to the `/login` page.

---

### Requirement 2: Wishlist Persistence

**User Story:** As an authenticated user, I want my wishlist to be saved across browser sessions, so that I can return later and find the products I saved.

#### Acceptance Criteria

1. THE Wishlist_Service SHALL store each wishlist entry as a document in MongoDB containing `userId`, `productId`, and `createdAt` fields.
2. WHEN an authenticated user loads any page, THE Wishlist_Store SHALL fetch the current user's Wishlist from the Wishlist_Service and store the product IDs in Redux state.
3. WHILE a user is authenticated, THE Wishlist_Store SHALL maintain the wishlist state so that Heart_Icon fill state is consistent across all product cards on the page without additional API calls.

---

### Requirement 3: Heart Icon Visual State

**User Story:** As an authenticated user, I want the heart icon to visually reflect whether a product is in my wishlist, so that I can see at a glance which products I have saved.

#### Acceptance Criteria

1. WHILE a product's ID is present in the Wishlist_Store, THE Heart_Icon for that product SHALL render in a filled/active state.
2. WHILE a product's ID is absent from the Wishlist_Store, THE Heart_Icon for that product SHALL render in an unfilled/inactive state.
3. WHEN the Wishlist_Service confirms a toggle operation, THE Wishlist_Store SHALL update optimistically so the Heart_Icon state changes immediately without waiting for a page reload.

---

### Requirement 4: Wishlist Count in Header

**User Story:** As an authenticated user, I want to see the number of items in my wishlist in the header, so that I can quickly know how many products I have saved.

#### Acceptance Criteria

1. WHILE a user is authenticated, THE Header SHALL display the current Wishlist item count adjacent to the wishlist navigation icon.
2. WHEN the user adds or removes a product from the Wishlist, THE Header SHALL update the displayed count immediately to reflect the new total.
3. WHEN the user is not authenticated, THE Header SHALL not display a wishlist count badge.

---

### Requirement 5: Dedicated Wishlist Page

**User Story:** As an authenticated user, I want a dedicated page to view all my saved products, so that I can review, manage, and act on my wishlist in one place.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to `/wishlist`, THE Wishlist_Page SHALL display all products currently in the user's Wishlist, including product image, name, category, selling price, and original price.
2. WHEN the user's Wishlist is empty, THE Wishlist_Page SHALL display an empty-state message and a link to continue shopping.
3. WHEN an unauthenticated user navigates to `/wishlist`, THE frontend SHALL redirect the user to the `/login` page.

---

### Requirement 6: Add to Cart from Wishlist Page

**User Story:** As an authenticated user, I want to move a product from my wishlist to my cart, so that I can proceed to purchase products I have saved.

#### Acceptance Criteria

1. WHEN an authenticated user clicks the "Add to Cart" button on a Wishlist_Page product card, THE Wishlist_Page SHALL add the product to the shopping cart using the existing cart API.
2. WHEN the product is successfully added to the cart, THE Context_Provider SHALL refresh the cart count in the header.

---

### Requirement 7: Remove from Wishlist Page

**User Story:** As an authenticated user, I want to remove individual products from my wishlist page, so that I can keep my wishlist relevant.

#### Acceptance Criteria

1. WHEN an authenticated user clicks the remove control on a Wishlist_Page product card, THE Wishlist_Service SHALL remove that product from the user's Wishlist.
2. WHEN the product is successfully removed, THE Wishlist_Page SHALL remove the product card from the displayed list without requiring a full page reload.
3. WHEN the last product is removed from the Wishlist, THE Wishlist_Page SHALL display the empty-state message.

---

### Requirement 8: Admin Wishlist Analytics

**User Story:** As an admin, I want to see which products are most frequently wishlisted, so that I can make informed merchandising and inventory decisions.

#### Acceptance Criteria

1. WHEN an admin user navigates to the wishlist analytics section of the admin panel, THE Admin_Analytics view SHALL display the top 20 most wishlisted products, ordered by wishlist count descending.
2. THE Admin_Analytics view SHALL display the product name, product image, category, and total wishlist count for each entry.
3. THE Wishlist_Service SHALL provide an admin-only API endpoint that returns the aggregated wishlist counts per product.
4. IF a non-admin user calls the admin analytics endpoint, THEN THE Wishlist_Service SHALL return a 403 Forbidden response.
