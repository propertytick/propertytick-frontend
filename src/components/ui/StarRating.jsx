'use client';

import { Star } from 'lucide-react';

export default function StarRating({ value = 0, count = 0, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${
            star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
      {count > 0 && <span className="text-sm text-gray-500 ml-1">({count})</span>}
    </div>
  );
}
