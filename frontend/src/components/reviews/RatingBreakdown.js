import React from 'react';
import StarRating from './StarRating';

const RatingBreakdown = ({ averageRating = 0, reviewCount = 0, ratingBreakdown = {} }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-gray-50 rounded-lg">
      {/* Average score */}
      <div className="flex flex-col items-center justify-center min-w-[100px]">
        <span className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
        <StarRating rating={averageRating} size="md" />
        <span className="text-sm text-gray-500 mt-1">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Bar breakdown */}
      <div className="flex-1 space-y-1">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingBreakdown[star] || 0;
          const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-gray-600">{star}</span>
              <span className="text-yellow-400">★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-gray-500 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingBreakdown;
