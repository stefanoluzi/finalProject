import React, { useState, useEffect } from "react";

const semana = [
  { day: "L" },
  { day: "M" },
  { day: "M" },
  { day: "J" },
  { day: "V" },
  { day: "S" },
  { day: "D" },
];

const RecipeCalendar = ({ recipeId }) => {
  const [selectedDays, setSelectedDays] = useState(() => {
    const saved = localStorage.getItem("selectedDays");
    return saved ? JSON.parse(saved) : Array(semana.length).fill(null);
  });

  useEffect(() => {
    localStorage.setItem("selectedDays", JSON.stringify(selectedDays));
  }, [selectedDays]);

  const handleDayClick = (index) => {
    if (selectedDays[index] && selectedDays[index] === recipeId) {
      alert("Esta receta ya se encuentra agendada");
    } else {
      if (window.confirm("¿Estás seguro de que quieres agendar esta receta?")) {
        setSelectedDays((prev) => {
          const newSelectedDays = [...prev];
          newSelectedDays[index] = recipeId;
          return newSelectedDays;
        });
      }
    }
  };

  return (
    <div className="calendar">
      <h4>¿QUIERES AGENDARLO?</h4>
      <div className="week-container">
        {semana.map((diaSemana, i) => (
          <div
            key={i}
            className="week-day"
            style={{
              backgroundColor:
                selectedDays[i] === recipeId
                  ? "var(--colorFuente-bordo)"
                  : "grey",
            }}
            onClick={() => handleDayClick(i)}
          >
            {diaSemana.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeCalendar;
