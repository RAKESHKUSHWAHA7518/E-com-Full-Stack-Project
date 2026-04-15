const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  { timestamps: true }
)

// One entry per (user, product) pair
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true })

module.exports = mongoose.model('Wishlist', wishlistSchema)
