import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DayColumn from "./DayColumn";
import WeekNavigation from "./WeekNavigation";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useTransition, animated } from "@react-spring/web";

dayjs.extend(isoWeek);

const WeekPlanner = ({ onDragStart, onDragEnd }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf("isoWeek"));
  const [plannedWeeks, setPlannedWeeks] = useState(() => {
    const savedWeeks = localStorage.getItem("plannedWeeks");
    return savedWeeks ? JSON.parse(savedWeeks) : {};
  });
  const [direction, setDirection] = useState(0);
  const today = dayjs();

  const initializeWeek = () => ({
    Lunes: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Martes: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Miércoles: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Jueves: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Viernes: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Sábado: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
    Domingo: { Desayuno: null, Almuerzo: null, Merienda: null, Cena: null },
  });

  const moveRecipe = (date, meal, recipe) => {
    const week = date.startOf("isoWeek").format("YYYY-MM-DD");
    const day = date.format("dddd").toLowerCase();

    const daysMap = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    };

    const translatedDay = daysMap[day];

    setPlannedWeeks((prev) => {
      const newPlannedWeeks = { ...prev };

      if (!newPlannedWeeks[week]) {
        newPlannedWeeks[week] = initializeWeek();
      }

      const newPlannedRecipes = { ...newPlannedWeeks[week] };

      // Assign the new recipe
      newPlannedRecipes[translatedDay][meal] = recipe;

      newPlannedWeeks[week] = newPlannedRecipes;

      localStorage.setItem("plannedWeeks", JSON.stringify(newPlannedWeeks));

      return newPlannedWeeks;
    });
  };

  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handlePreviousWeek = () => {
    if (!currentWeek.isSame(dayjs().startOf("isoWeek"), "week")) {
      setDirection(-1);
      setCurrentWeek(currentWeek.subtract(1, "week").startOf("isoWeek"));
    }
  };

  const handleNextWeek = () => {
    setDirection(1);
    setCurrentWeek(currentWeek.add(1, "week").startOf("isoWeek"));
  };

  const handleThisWeek = () => {
    setDirection(0);
    setCurrentWeek(dayjs().startOf("isoWeek"));
  };

  const handleNextNextWeek = () => {
    setDirection(1);
    setCurrentWeek(currentWeek.add(2, "week").startOf("isoWeek"));
  };

  const currentWeekStr = currentWeek.format("YYYY-MM-DD");
  const plannedRecipes = plannedWeeks[currentWeekStr] || initializeWeek();

  const getDatesForWeek = (weekStart) =>
    days.map((_, index) => weekStart.add(index, "day"));

  const dates = getDatesForWeek(currentWeek);

  const transitions = useTransition(currentWeekStr, {
    from: {
      position: "absolute",
      opacity: 0,
      transform: `translateX(${direction * 100}%)`,
    },
    enter: { opacity: 1, transform: `translateX(0%)` },
    leave: { opacity: 0, transform: `translateX(${direction * -100}%)` },
    config: { tension: 50, friction: 20 },
  });

  const currentMonth = currentWeek.format("MMMM YYYY");

  useEffect(() => {
    console.log("Current plannedWeeks:", plannedWeeks);
  }, [plannedWeeks]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      height="100vh"
    >
      <h2>{currentMonth}</h2>

      <WeekNavigation
        currentWeek={currentWeek}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onThisWeek={handleThisWeek}
        onNextNextWeek={handleNextNextWeek}
      />
      <Box position="relative" width="100%" flexGrow={1}>
        {transitions((style, item) => (
          <animated.div
            style={{ ...style, width: "100%", height: "100%" }}
            key={item}
          >
            <div className="days-container">
              {dates.map((date, index) => (
                <div key={days[index]} className="day-column">
                  <DayColumn
                    day={days[index]}
                    date={date}
                    plannedRecipes={plannedRecipes[days[index]]}
                    moveRecipe={moveRecipe}
                    isToday={date.isSame(today, "day")}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                </div>
              ))}
            </div>
          </animated.div>
        ))}
      </Box>
    </Box>
  );
};

export default WeekPlanner;
