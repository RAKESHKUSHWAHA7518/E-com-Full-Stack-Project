import React, { useContext } from 'react'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import ProductCard, { CARD_TONE_COUNT } from './ProductCard'

const loadingList = new Array(13).fill(null)

const ProductCardSkeleton = ({ index }) => (
  <div
    className={`product-card-frame product-card-grid-item product-card-tone-${
      index % CARD_TONE_COUNT
    }`}
  >
    <div className="product-card product-card-skeleton">
      <div className="product-card-skeleton-media" />
      <div className="product-card-skeleton-content">
        <div className="product-card-skeleton-line" />
        <div className="product-card-skeleton-line product-card-skeleton-line-sm" />
        <div className="product-card-skeleton-row">
          <div className="product-card-skeleton-line" />
          <div className="product-card-skeleton-line" />
        </div>
        <div className="product-card-skeleton-button" />
      </div>
    </div>
  </div>
)

const VerticalCard = ({ loading, data = [] }) => {
  const { fetchUserAddToCart } = useContext(Context)

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart?.()
  }

  return (
    <div className="product-grid">
      {loading
        ? loadingList.map((_, index) => (
            <ProductCardSkeleton key={index} index={index} />
          ))
        : data.map((product, index) => (
            <ProductCard
              key={product?._id}
              product={product}
              index={index}
              className="product-card-grid-item"
              showBadge={index < 2}
              onAddToCart={handleAddToCart}
            />
          ))}
    </div>
  )
}

export default VerticalCard
