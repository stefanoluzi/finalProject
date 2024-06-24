import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rating = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [cantRating, setCantRating] = useState(0);

  useEffect(() => {
    const savedRating = localStorage.getItem(`rating_${recipeId}`);
    if (savedRating !== null) {
      setRating(parseInt(savedRating));
    }
    const savedCantRating = localStorage.getItem(`cantRating_${recipeId}`);
    if (savedCantRating !== null) {
      setCantRating(parseInt(savedCantRating));
    }
    if (recipeId) {
      fetchAverageRating();
      fetchCantRating();
    }
  }, [recipeId]);

  const fetchAverageRating = () => {
    axios.get(`http://localhost:8080/recetas/${recipeId}/puntaje`)
      .then(response => {
        setAverageRating(response.data);
      })
      .catch(error => {
        console.error('Error fetching average rating:', error);
      });
  };

  const fetchCantRating = () => {
    axios.get(`http://localhost:8080/recetas/${recipeId}/cantCalificaciones`) 
      .then(response => {
        setCantRating(response.data); 
      })
      .catch(error => {
        console.error('Error fetching rating count:', error);
      });
  };

  const handleRating = (index) => {
    if (index === rating) {
      setRating(0);
      localStorage.removeItem(`rating_${recipeId}`);
    } else {
      setRating(index);
      localStorage.setItem(`rating_${recipeId}`, index);

      const newCantRating = cantRating + 1;
      setCantRating(newCantRating);
      localStorage.setItem(`cantRating_${recipeId}`, newCantRating);

      if (recipeId) {
        submitRating(index);
      }
    }
  };

  const submitRating = (index) => {
    axios.post(`http://localhost:8080/recetas/${recipeId}/calificar`, null, {
      params: { puntaje: index }
    })
    .then(() => {
      fetchAverageRating();
      fetchCantRating();
    })
    .catch(error => {
      console.error('Error submitting rating:', error);
    });
  };

  return (
    <div className="rating-container">
      {averageRating > 4 ? (
        <div className="high-rating">
          <div className="laurel-leaves">
            <i className="fas fa-medal"></i>
            <span className="average-rating">{averageRating.toFixed(1)}</span>
            
          </div>
          <div className="vertical-line"></div>
          <div className="rating-count">
            <span className='evaluation-cant'>{cantRating}</span>
            <div className="evaluation-label">evaluaciones</div>
          </div>
        </div>
      ) : (
        <>
        <div className="high-rating">
          <div className="laurel-leaves">
            <span className="average-rating">{averageRating.toFixed(1)}</span> 
          </div>
          <div className="vertical-line"></div>
          <div className="rating-count">
            <span className='evaluation-cant'>{cantRating}</span>
            <div className="evaluation-label">evaluaciones</div>
          </div>
        </div>
        </>
      )}
        <div>
            {[1, 2, 3, 4, 5].map((index) => (
              <i
                key={index}
                className={`fa-star ${index <= rating ? 'fas' : 'far'}`}
                onClick={() => handleRating(index)}
              ></i>
            ))}
        </div>
    </div>
  );
};

export default Rating;
