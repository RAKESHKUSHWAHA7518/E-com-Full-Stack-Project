import React from 'react'
import { FaStar } from 'react-icons/fa6'

const StarRating = ({
  rating = 0,
  count,
  size = 'md',
  interactive = false,
  onChange,
}) => {
  const sizeClass =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'

  const handleClick = (value) => {
    if (interactive && onChange) onChange(value)
  }

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const className = `${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          } transition-transform ${
            star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          }`

          return interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              className={className}
              aria-label={`${star} star rating`}
            >
              <FaStar />
            </button>
          ) : (
            <span key={star} className={className} aria-hidden="true">
              <FaStar />
            </span>
          )
        })}
      </div>
      {count !== undefined && <span className="text-sm text-gray-500">({count})</span>}
    </div>
  )
}

export default StarRating
