import React from "react";
import { useDrag } from "react-dnd";
import { Card, CardContent, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faDrumstickBite,
  faBreadSlice,
  faTint,
} from "@fortawesome/free-solid-svg-icons";

const getShortenedName = (name) => {
  if (name.length > 14) {
    return name.split(" ")[0]; // Retorna solo la primera palabra
  }
  return name;
};

const RecipeCard = ({ recipe, onDragStart, onDragEnd, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "RECIPE_CARD",
    item: () => {
      onDragStart();
      return { recipe };
    },
    end: () => {
      onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: "#dddfdc",
        borderRadius: "8px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid grey",
      }}
    >
      <CardContent
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "75px",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: "600" }}>
            {getShortenedName(recipe.nombre)}
          </h5>
          {recipe.imagenes && recipe.imagenes[0] && (
            <img
              src={recipe.imagenes[0].urlImg}
              alt={recipe.nombre}
              width="55"
              style={{ borderRadius: "6px", marginTop: "4px" }}
            />
          )}
        </div>
        <div className="recipecard-nutri-details">
          <ul>
            <li>
              <FontAwesomeIcon icon={faFire} />
              <p>100 Kcal</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faDrumstickBite} />
              <p>80%</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faBreadSlice} />
              <p>25%</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faTint} />
              <p>12%</p>
            </li>
          </ul>
        </div>
      </CardContent>
      {onDelete && (
        <IconButton onClick={onDelete} style={{ padding: "5px" }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Card>
  );
};

export default RecipeCard;
