const userModel = require('../../models/userModel');

/**
 * GET /api/profile
 * Returns the authenticated user's profile (never returns password).
 */
async function getProfile(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const user = await userModel.findById(userId).select('-password');

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
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePic: user.profilePic,
                role: user.role,
            },
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
 * PUT /api/profile
 * Updates name and/or phone for the authenticated user.
 * Body: { name?: string, phone?: string }
 */
async function updateProfile(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { name, phone } = req.body;

        // Validate name if provided
        if (name !== undefined) {
            const trimmedName = name.trim();
            if (trimmedName.length < 2 || trimmedName.length > 50) {
                return res.status(400).json({
                    message: 'Name must be between 2 and 50 characters',
                    error: true,
                    success: false,
                });
            }
        }

        // Validate phone if provided and non-empty
        if (phone !== undefined && phone !== '') {
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: 'Phone number must be 10–15 digits and may start with +',
                    error: true,
                    success: false,
                });
            }
        }

        const payload = {};
        if (name !== undefined) payload.name = name.trim();
        if (phone !== undefined) payload.phone = phone;

        const updatedUser = await userModel
            .findByIdAndUpdate(userId, payload, { new: true })
            .select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        return res.json({
            success: true,
            error: false,
            data: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePic: updatedUser.profilePic,
                role: updatedUser.role,
            },
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
 * POST /api/profile/upload-pic
 * Accepts { profilePicUrl } – the frontend uploads to Cloudinary directly
 * and sends back the resulting URL. This endpoint stores it in MongoDB.
 * Body: { profilePicUrl: string }
 */
async function uploadProfilePic(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized – please log in',
                error: true,
                success: false,
            });
        }

        const { profilePicUrl } = req.body;

        if (!profilePicUrl || typeof profilePicUrl !== 'string' || profilePicUrl.trim() === '') {
            return res.status(400).json({
                message: 'profilePicUrl must be a non-empty string',
                error: true,
                success: false,
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl.trim() },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false,
            });
        }

        return res.json({
            success: true,
            error: false,
            data: {
                profilePic: updatedUser.profilePic,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = { getProfile, updateProfile, uploadProfilePic };
