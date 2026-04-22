import React from 'react'
import { Link } from 'react-router-dom'
import displayINRCurrency from '../helpers/displayCurrency'
import HeartButton from './HeartButton'
import StarRating from './reviews/StarRating'

export const CARD_TONE_COUNT = 6

const getDiscount = (price, sellingPrice) => {
  const originalPrice = Number(price)
  const currentPrice = Number(sellingPrice)

  if (!originalPrice || !currentPrice || currentPrice >= originalPrice) {
    return null
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

const ProductCard = ({
  product,
  index = 0,
  onAddToCart,
  onQuickView,
  showBadge = false,
  className = '',
}) => {
  if (!product) return null

  const productPath = `/product/${product?._id}`
  const discount = getDiscount(product?.price, product?.sellingPrice)
  const hasRating = product?.reviewCount > 0 || product?.averageRating > 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(e, product?._id)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <div
      className={`product-card-frame product-card-tone-${
        index % CARD_TONE_COUNT
      } ${className}`}
    >
      <div className="product-card">
        <div className="product-card-media">
          {showBadge && <span className="product-card-badge">NEW</span>}

          <div
            className="product-card-heart"
            onClick={(e) => e.stopPropagation()}
          >
            <HeartButton productId={product?._id} />
          </div>

          <Link
            to={productPath}
            className="product-card-image-link"
            aria-label={product?.productName || 'View product'}
          >
            {product?.productImage?.[0] && (
              <img
                src={product.productImage[0]}
                className="product-card-image"
                alt={product?.productName || 'Product'}
              />
            )}
          </Link>

          {onQuickView && (
            <button
              type="button"
              className="product-card-quick-view"
              onClick={handleQuickView}
            >
              Quick View
            </button>
          )}
        </div>

        <div className="product-card-content">
          <Link to={productPath} className="product-card-details">
            <h2 className="product-card-name">{product?.productName}</h2>
            <p className="product-card-category">{product?.category}</p>
            <div className="product-card-rating">
              {hasRating && (
                <StarRating
                  rating={product?.averageRating || 0}
                  count={product?.reviewCount || 0}
                  size="sm"
                />
              )}
            </div>
          </Link>

          <div className="product-card-price-row">
            <div className="min-w-0">
              <span className="product-card-price">
                {displayINRCurrency(product?.sellingPrice)}
              </span>
              <span className="product-card-mrp">
                {displayINRCurrency(product?.price)}
              </span>
            </div>
            {discount && (
              <span className="product-card-discount">{discount}% off</span>
            )}
          </div>

          <button
            type="button"
            className="product-card-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
