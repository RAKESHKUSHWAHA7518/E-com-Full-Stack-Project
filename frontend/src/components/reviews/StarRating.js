import React from 'react';

const StarRating = ({ rating = 0, count, size = 'md', interactive = false, onChange }) => {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  const handleClick = (value) => {
    if (interactive && onChange) onChange(value);
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleClick(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
