import React, { useState } from 'react';
import './rating.css';

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
