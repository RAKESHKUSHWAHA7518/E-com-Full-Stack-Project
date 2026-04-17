# Requirements Document

## Introduction

This feature adds User Profile & Address Management to the existing MERN e-commerce application. Authenticated users can edit their profile information (name, phone number, profile picture), manage multiple saved shipping addresses (add, edit, delete, set a default), and view an improved order history with a detailed order view and delivery status tracking. The feature extends the existing user model, integrates with Cloudinary for profile picture uploads, and enhances the existing order history page with richer UI and per-order detail views.

## Glossary

- **Profile_Service**: The backend Express layer responsible for reading and updating user profile data.
- **Address_Service**: The backend Express layer responsible for CRUD operations on a user's saved shipping addresses.
- **Order_History_Service**: The backend Express layer responsible for retrieving user orders (already exists; extended in this feature).
- **Profile_Page**: The frontend page where an authenticated user views and edits their profile information.
- **Address_Manager**: The frontend section of the Profile_Page where a user manages saved shipping addresses.
- **Order_History_Page**: The existing frontend page (`/orders`) displaying a user's past orders, enhanced in this feature.
- **Order_Detail_View**: A modal or dedicated page that displays the full details of a single order.
- **Image_Upload_Service**: The Cloudinary integration used to upload and store profile pictures.
- **authToken**: The existing Express middleware that authenticates requests and sets `req.userId`.
- **Default_Address**: The shipping address automatically pre-selected during checkout.
- **Delivery_Status**: The current fulfilment state of an order (e.g., processing, shipped, out for delivery, delivered).
- **User**: An authenticated account holder with a name, email, password, profilePic, and role stored in MongoDB.

---

## Requirements

### Requirement 1: View Profile Information

**User Story:** As an authenticated user, I want to view my current profile information on a dedicated profile page, so that I can see what details are associated with my account.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to `/profile`, THE Profile_Page SHALL display the user's current name, email address, phone number, and profile picture.
2. WHILE the user's profile data is loading, THE Profile_Page SHALL display a loading skeleton in place of the profile fields.
3. IF the Profile_Service fails to retrieve user data, THEN THE Profile_Page SHALL display an error message and a retry option.
4. WHEN an unauthenticated user navigates to `/profile`, THE frontend SHALL redirect the user to the `/login` page.

---

### Requirement 2: Edit Profile Information

**User Story:** As an authenticated user, I want to update my name and phone number, so that my account details stay current.

#### Acceptance Criteria

1. WHEN an authenticated user submits a profile update form with a valid name and phone number, THE Profile_Service SHALL update the user's record in MongoDB and return the updated user object.
2. THE Profile_Service SHALL validate that the name field is between 2 and 50 characters.
3. THE Profile_Service SHALL validate that the phone number, when provided, matches a 10–15 digit international format.
4. IF the name field is empty or exceeds 50 characters, THEN THE Profile_Service SHALL return a 400 Bad Request response with a descriptive validation message.
5. IF the phone number does not match the required format, THEN THE Profile_Service SHALL return a 400 Bad Request response with a descriptive validation message.
6. WHEN the profile update succeeds, THE Profile_Page SHALL display a success notification and reflect the updated values without a full page reload.

---

### Requirement 3: Upload Profile Picture

**User Story:** As an authenticated user, I want to upload a profile picture, so that my account has a personalised avatar.

#### Acceptance Criteria

1. WHEN an authenticated user selects an image file and submits the upload form, THE Image_Upload_Service SHALL upload the image to Cloudinary and return a secure URL.
2. THE Profile_Service SHALL accept only JPEG, PNG, and WebP image formats for profile pictures.
3. THE Profile_Service SHALL reject image files larger than 2 MB and return a 400 Bad Request response with a descriptive message.
4. WHEN the upload succeeds, THE Profile_Service SHALL update the `profilePic` field on the user's MongoDB record with the Cloudinary URL.
5. WHEN the upload succeeds, THE Profile_Page SHALL display the new profile picture immediately without a full page reload.
6. IF the Cloudinary upload fails, THEN THE Profile_Service SHALL return a 500 error response and SHALL NOT update the user's `profilePic` field.

---

### Requirement 4: Manage Saved Shipping Addresses

**User Story:** As an authenticated user, I want to save multiple shipping addresses to my account, so that I can select them quickly during checkout without re-entering details each time.

#### Acceptance Criteria

1. THE Address_Service SHALL store each address with the following fields: full name, phone number, address line 1, address line 2 (optional), city, state, postal code, and country.
2. THE Address_Service SHALL enforce a maximum of 5 saved addresses per user.
3. IF a user attempts to add a 6th address, THEN THE Address_Service SHALL return a 400 Bad Request response with a message indicating the address limit has been reached.
4. THE Address_Service SHALL validate that full name, address line 1, city, state, postal code, and country are non-empty strings.
5. THE Address_Service SHALL validate that the postal code matches a 3–10 alphanumeric character format.
6. WHEN an authenticated user submits a valid new address, THE Address_Service SHALL create the address record and associate it with the user's account.

---

### Requirement 5: Edit and Delete Saved Addresses

**User Story:** As an authenticated user, I want to edit or delete my saved addresses, so that I can keep my address book accurate.

#### Acceptance Criteria

1. WHEN an authenticated user submits an edit request for an existing address with valid data, THE Address_Service SHALL update the address record in MongoDB.
2. WHEN an authenticated user submits a delete request for an address, THE Address_Service SHALL remove the address record from MongoDB.
3. IF the address to be edited or deleted does not belong to the requesting user, THEN THE Address_Service SHALL return a 403 Forbidden response.
4. WHEN the last saved address is deleted and it was the Default_Address, THE Address_Service SHALL clear the default address designation for the user.
5. WHEN an address is successfully edited or deleted, THE Address_Manager SHALL update the displayed address list without a full page reload.

---

### Requirement 6: Set Default Shipping Address

**User Story:** As an authenticated user, I want to designate one address as my default shipping address, so that it is pre-selected automatically when I check out.

#### Acceptance Criteria

1. WHEN an authenticated user designates an address as the Default_Address, THE Address_Service SHALL mark that address as default and remove the default designation from any previously default address.
2. THE Address_Service SHALL enforce that at most one address per user is marked as default at any time.
3. WHEN an authenticated user loads the Address_Manager, THE Address_Manager SHALL visually distinguish the Default_Address from other saved addresses.
4. WHEN a user has a Default_Address saved, THE checkout flow SHALL pre-populate the shipping address field with the Default_Address.

---

### Requirement 7: Address Data Model

**User Story:** As a developer, I want a well-structured address data model embedded in or associated with the user record, so that address data is stored consistently and efficiently.

#### Acceptance Criteria

1. THE Address_Service SHALL store addresses as an embedded array within the user's MongoDB document or as a separate `Address` collection referencing the user by `userId`.
2. THE Address_Service SHALL assign a unique identifier to each address entry.
3. THE Address_Service SHALL record `createdAt` and `updatedAt` timestamps for each address entry.
4. THE Address_Service SHALL validate that postal code contains only alphanumeric characters and hyphens.
5. FOR ALL address records, the `userId` field SHALL reference a valid user document in the `user` collection.

---

### Requirement 8: Enhanced Order History UI

**User Story:** As an authenticated user, I want an improved order history page that clearly shows my orders with better visual organisation, so that I can quickly find and review past purchases.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to `/orders`, THE Order_History_Page SHALL display each order as a card showing: order ID (truncated), order date, order total, payment status badge, and a thumbnail of the first product image.
2. THE Order_History_Page SHALL display orders sorted by creation date in descending order.
3. WHEN the user has no orders, THE Order_History_Page SHALL display an empty-state illustration and a "Start Shopping" link.
4. WHILE orders are loading, THE Order_History_Page SHALL display skeleton loading cards in place of order cards.
5. THE Order_History_Page SHALL support pagination or infinite scroll, loading a maximum of 10 orders per page.

---

### Requirement 9: Order Detail View

**User Story:** As an authenticated user, I want to view the full details of a specific order, so that I can see exactly what I ordered, what I paid, and where it is being delivered.

#### Acceptance Criteria

1. WHEN an authenticated user clicks on an order card in the Order_History_Page, THE Order_Detail_View SHALL display: order ID, order date, all ordered products with images and quantities, itemised prices, order total, payment status, and the shipping address used at the time of purchase.
2. THE Order_History_Service SHALL provide an endpoint that returns a single order by its identifier, verifying the requesting user owns the order.
3. IF the order identifier does not exist or does not belong to the requesting user, THEN THE Order_History_Service SHALL return a 404 Not Found response.
4. WHEN the Order_Detail_View is open, THE frontend SHALL provide a "Back to Orders" navigation control.
5. THE Order_History_Service SHALL return the order detail response within 1 second.

---

### Requirement 10: Order Status Tracking

**User Story:** As an authenticated user, I want to see the delivery status of my orders, so that I know when to expect my items.

#### Acceptance Criteria

1. THE Order_History_Service SHALL support a `deliveryStatus` field on each order with the following values: `processing`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`.
2. WHEN an order's `deliveryStatus` is updated, THE Order_History_Service SHALL record the timestamp of the status change.
3. THE Order_Detail_View SHALL display a visual status timeline showing the progression of the order through each Delivery_Status stage.
4. WHEN an order's `deliveryStatus` is `delivered`, THE Order_Detail_View SHALL display the delivery completion date.
5. THE Admin_Dashboard SHALL provide an interface for administrators to update the `deliveryStatus` of any order.
6. IF a non-administrator attempts to update `deliveryStatus`, THEN THE Order_History_Service SHALL return a 403 Forbidden response.

---

### Requirement 11: Secure Profile and Address Endpoints

**User Story:** As a developer, I want all profile and address endpoints to be protected by authentication, so that users can only access and modify their own data.

#### Acceptance Criteria

1. THE Profile_Service SHALL require a valid JWT (via the `authToken` middleware) for all profile read and update endpoints.
2. THE Address_Service SHALL require a valid JWT (via the `authToken` middleware) for all address CRUD endpoints.
3. THE Profile_Service SHALL use the `userId` extracted from the JWT by `authToken` to scope all database operations to the authenticated user.
4. THE Address_Service SHALL use the `userId` extracted from the JWT by `authToken` to scope all database operations to the authenticated user.
5. IF a request to a profile or address endpoint is made without a valid JWT, THEN THE Profile_Service or Address_Service SHALL return a 401 Unauthorized response.

---

### Requirement 12: Profile Page Navigation Integration

**User Story:** As an authenticated user, I want to access my profile page from the site header, so that I can reach my account settings from any page.

#### Acceptance Criteria

1. WHILE a user is authenticated, THE Header SHALL display a link or avatar control that navigates to `/profile`.
2. WHEN the user clicks the profile control in the Header, THE frontend SHALL navigate to the Profile_Page.
3. WHILE a user is not authenticated, THE Header SHALL not display the profile navigation control.
