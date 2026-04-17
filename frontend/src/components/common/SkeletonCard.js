import React from 'react';

const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-1/3" />
            <div className="h-3 bg-gray-200 rounded-full w-1/4" />
            <div className="h-4 bg-gray-200 rounded-full w-1/2" />
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="h-5 w-14 bg-gray-200 rounded-full" />
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
