import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { reducer } from "./reducer";
import { BASE_URL } from "../../utils/config";

export const ContextGlobal = createContext();

const initialState = {
  theme: false,
  data: [],
  favs: JSON.parse(localStorage.getItem('favs')) || [],
  recipeSelected: {},
  plannedWeeks: JSON.parse(localStorage.getItem("plannedWeeks")) || {},
};

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [categorias, setCategorias] = useState([]);

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
    const newPlannedWeeks = { ...state.plannedWeeks };

    if (!newPlannedWeeks[week]) newPlannedWeeks[week] = initializeWeek();
    const newPlannedRecipes = { ...newPlannedWeeks[week] };
    newPlannedRecipes[translatedDay][meal] = recipe;

    newPlannedWeeks[week] = newPlannedRecipes;

    localStorage.setItem("plannedWeeks", JSON.stringify(newPlannedWeeks));
    dispatch({ type: 'EDIT_WEEK', payload: newPlannedWeeks });
  };

  // Petición a la API
  const url = `${BASE_URL}recetas/listar`;

  useEffect(() => {
    axios(url)
      .then(res => {
        dispatch({ type: 'GET_LIST', payload: res.data });
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(state.favs));
  }, [state.favs]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categorias/listar`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ContextGlobal.Provider value={{ state, dispatch, initializeWeek, moveRecipe, categorias }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export const useContextGlobal = () => useContext(ContextGlobal);
