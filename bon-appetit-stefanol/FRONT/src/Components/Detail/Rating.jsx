import React, { useState, useEffect } from 'react';

const Rating = ({ recipeId }) => {
  const [rating, setRating] = useState(0);

  // Cargar la puntuación desde el localStorage al inicio
  useEffect(() => {
    const savedRating = localStorage.getItem(`rating_${recipeId}`);
    if (savedRating !== null) {
      setRating(parseInt(savedRating));
    }
  }, [recipeId]);

  const handleRating = (index) => {
    if (index === rating) {
      // Si se hace clic en la misma estrella, desactivar todas
      setRating(0);
      localStorage.removeItem(`rating_${recipeId}`);
    } else {
      setRating(index);
      localStorage.setItem(`rating_${recipeId}`, index);
    }
  };

  return (
    <div className="rating-container">
      {[1, 2, 3, 4, 5].map((index) => (
        <i
          key={index}
          className={`fa-star ${index <= rating ? 'fas' : 'far'}`}
          onClick={() => handleRating(index)}
        ></i>
      ))}
    </div>
  );
};

export default Rating;
