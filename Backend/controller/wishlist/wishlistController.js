const Wishlist = require('../../models/wishlistModel')
const userModel = require('../../models/userModel')

// POST /api/wishlist/toggle
async function toggleWishlist(req, res) {
  try {
    const userId = req.userId
    const { productId } = req.body

    if (!userId) {
      return res.status(200).json({ success: false, error: true, message: 'User not logged in' })
    }
    if (!productId) {
      return res.status(400).json({ success: false, error: true, message: 'productId is required' })
    }

    const existing = await Wishlist.findOne({ userId, productId })

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id)
      return res.json({ success: true, error: false, data: { action: 'removed', productId: String(productId) } })
    }

    try {
      await Wishlist.create({ userId, productId })
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate — already added (race condition)
        return res.json({ success: true, error: false, data: { action: 'added', productId: String(productId) } })
      }
      throw err
    }

    return res.json({ success: true, error: false, data: { action: 'added', productId: String(productId) } })
  } catch (err) {
    console.error('toggleWishlist error:', err)
    return res.status(500).json({ success: false, error: true, message: 'Server error' })
  }
}

// GET /api/wishlist
async function getUserWishlist(req, res) {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(200).json({ success: false, error: true, message: 'User not logged in' })
    }

    const items = await Wishlist.find({ userId }).select('productId').lean()
    const productIds = items.map(item => String(item.productId))

    return res.json({ success: true, error: false, data: productIds })
  } catch (err) {
    console.error('getUserWishlist error:', err)
    return res.status(500).json({ success: false, error: true, message: 'Server error' })
  }
}

// GET /api/wishlist/analytics  (admin only)
async function getWishlistAnalytics(req, res) {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(200).json({ success: false, error: true, message: 'User not logged in' })
    }

    const user = await userModel.findById(userId)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return res.status(403).json({ success: false, error: true, message: 'Access denied' })
    }

    const results = await Wishlist.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          count: 1,
          productName: '$product.productName',
          productImage: '$product.productImage',
          category: '$product.category'
        }
      }
    ])

    return res.json({ success: true, error: false, data: results })
  } catch (err) {
    console.error('getWishlistAnalytics error:', err)
    return res.status(500).json({ success: false, error: true, message: 'Server error' })
  }
}

module.exports = { toggleWishlist, getUserWishlist, getWishlistAnalytics }
