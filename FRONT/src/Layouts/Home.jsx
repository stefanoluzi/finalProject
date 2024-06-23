import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Recomendados, SearchBar } from "../Components";
import { fetchCategories } from "../api/api";

export const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resp = await fetchCategories();
        setCategorias(resp);
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      <SearchBar />
      <div className="card-container">
        {categorias.map((category, index) => (
          <Link
            to={`/${category.categorias.toLowerCase()}`}
            className="card"
            key={index}
          >
            <div
              className="card-front"
              style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2),
                                                          rgba(0, 0, 0, 0.4)
                                                        ),url(${category.urlImg})`,
              }}
            >
              <h1 className="bordelindo title-card">{category.categorias}</h1>
            </div>
            <div className="card-back">
              <p>{category.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <Recomendados />
      </div>
    </div>
  );
};
