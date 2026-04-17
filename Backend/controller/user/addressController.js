const userModel = require('../../models/userModel');

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const POSTAL_REGEX = /^[A-Za-z0-9\-]{3,10}$/;
const MAX_ADDRESSES = 5;

/**
 * Validates address fields.
 * Returns an error message string if invalid, or null if valid.
 */
function validateAddressFields(fields) {
    const { fullName, phone, addressLine1, city, state, postalCode, country } = fields;

    if (!fullName || fullName.trim() === '') {
        return 'fullName is required';
    }
    if (!phone || phone.trim() === '') {
        return 'phone is required';
    }
    if (!PHONE_REGEX.test(phone)) {
        return 'Phone number must be 10–15 digits and may start with +';
    }
    if (!addressLine1 || addressLine1.trim() === '') {
        return 'addressLine1 is required';
    }
    if (!city || city.trim() === '') {
        return 'city is required';
    }
    if (!state || state.trim() === '') {
        return 'state is required';
    }
    if (!postalCode || postalCode.trim() === '') {
        return 'postalCode is required';
    }
    if (!POSTAL_REGEX.test(postalCode)) {
        return 'postalCode must be 3–10 alphanumeric characters (hyphens allowed)';
    }
    if (!country || country.trim() === '') {
        return 'country is required';
    }

    return null;
}

/**
 * GET /api/addresses
 * Returns all addresses for the authenticated user.
 */
async function getAddresses(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const user = await userModel.findById(userId).select('addresses');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        return res.json({
            success: true,
            error: false,
            data: user.addresses,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

/**
 * POST /api/addresses
 * Adds a new address to the authenticated user's address list.
 * Enforces a maximum of 5 addresses.
 */
async function addAddress(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

        const validationError = validateAddressFields({ fullName, phone, addressLine1, city, state, postalCode, country });
        if (validationError) {
            return res.status(400).json({
                message: validationError,
                error: true,
                success: false,
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        if (user.addresses.length >= MAX_ADDRESSES) {
            return res.status(400).json({
                message: `Maximum of ${MAX_ADDRESSES} addresses allowed`,
                error: true,
                success: false,
            });
        }

        const newAddress = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2 ? addressLine2.trim() : '',
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
            isDefault: isDefault === true,
        };

        user.addresses.push(newAddress);
        await user.save();

        return res.json({
            success: true,
            error: false,
            data: user.addresses,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

/**
 * PUT /api/addresses/:addressId
 * Updates an existing address belonging to the authenticated user.
 */
async function updateAddress(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { addressId } = req.params;
        const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

        const validationError = validateAddressFields({ fullName, phone, addressLine1, city, state, postalCode, country });
        if (validationError) {
            return res.status(400).json({
                message: validationError,
                error: true,
                success: false,
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(403).json({
                message: 'Address not found or does not belong to this user',
                error: true,
                success: false,
            });
        }

        address.fullName = fullName.trim();
        address.phone = phone.trim();
        address.addressLine1 = addressLine1.trim();
        address.addressLine2 = addressLine2 ? addressLine2.trim() : '';
        address.city = city.trim();
        address.state = state.trim();
        address.postalCode = postalCode.trim();
        address.country = country.trim();
        if (isDefault !== undefined) address.isDefault = isDefault === true;

        await user.save();

        return res.json({
            success: true,
            error: false,
            data: user.addresses,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

/**
 * DELETE /api/addresses/:addressId
 * Removes an address from the authenticated user's address list.
 */
async function deleteAddress(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { addressId } = req.params;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(403).json({
                message: 'Address not found or does not belong to this user',
                error: true,
                success: false,
            });
        }

        user.addresses.pull({ _id: addressId });
        await user.save();

        return res.json({
            success: true,
            error: false,
            data: user.addresses,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

/**
 * PUT /api/addresses/:addressId/default
 * Sets the specified address as the default, clearing isDefault on all others.
 */
async function setDefaultAddress(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { addressId } = req.params;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(403).json({
                message: 'Address not found or does not belong to this user',
                error: true,
                success: false,
            });
        }

        // Clear isDefault on all addresses, then set it on the target
        user.addresses.forEach((addr) => {
            addr.isDefault = false;
        });
        address.isDefault = true;

        await user.save();

        return res.json({
            success: true,
            error: false,
            data: user.addresses,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
