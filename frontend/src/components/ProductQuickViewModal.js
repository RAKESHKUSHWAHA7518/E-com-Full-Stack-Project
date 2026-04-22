import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import displayINRCurrency from '../helpers/displayCurrency'
import StarRating from './reviews/StarRating'

const getDiscount = (price, sellingPrice) => {
  const originalPrice = Number(price)
  const currentPrice = Number(sellingPrice)

  if (!originalPrice || !currentPrice || currentPrice >= originalPrice) {
    return null
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

const ProductQuickViewModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null

  const discount = getDiscount(product?.price, product?.sellingPrice)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(e, product?._id)
  }

  return (
    <motion.div
      className="product-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="product-modal"
        initial={{ scale: 0.94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 18 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-modal-header">
          <h3 className="product-modal-title">{product?.productName}</h3>
          <button
            type="button"
            className="product-modal-close"
            onClick={onClose}
            aria-label="Close quick view"
          >
            x
          </button>
        </div>

        <div className="product-modal-body">
          <div className="product-modal-image-wrap">
            {product?.productImage?.[0] && (
              <img
                src={product.productImage[0]}
                alt={product?.productName || 'Product'}
                className="product-modal-image"
              />
            )}
          </div>

          <div className="product-modal-info">
            <p className="product-card-category">{product?.category}</p>
            <div className="product-modal-rating">
              <StarRating
                rating={product?.averageRating || 0}
                count={product?.reviewCount || 0}
                size="sm"
              />
            </div>

            <div className="product-modal-price-row">
              <span className="product-modal-price">
                {displayINRCurrency(product?.sellingPrice)}
              </span>
              <span className="product-card-mrp">
                {displayINRCurrency(product?.price)}
              </span>
              {discount && (
                <span className="product-card-discount">{discount}% off</span>
              )}
            </div>

            <p className="product-modal-description">
              {product?.description ||
                'Premium quality product with fast shipping and limited stock available.'}
            </p>

            <div className="product-modal-tags">
              <span className="product-modal-tag">In Stock</span>
              <span className="product-modal-tag product-modal-tag-success">
                Fast Delivery
              </span>
            </div>

            <div className="product-modal-actions">
              <button
                type="button"
                className="product-card-button product-modal-cart"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <Link to={`/product/${product?._id}`} className="product-modal-link">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductQuickViewModal
