import { useContext } from 'react';
import { ContextGlobal } from '../Context';
import { getRandomElements } from '../utils/randomElements'; // Función para elegir aleatoriamente
import { Card } from './Card';

export const Recomendados = () => {
  
  const {state} = useContext(ContextGlobal)
  const randomRecipes = getRandomElements(state.data, 10);

  return (
    <>
    
    <div className="recommended-section">
      <h1 className="titulo-recomendados">RECETAS RECOMENDADAS</h1>
        <div className="recommended-grid">
          {randomRecipes.map((receta) => (
            <Card
              key={receta.id}
              id={receta.id}
              title={receta.nombre}
              image={receta.imagenes}
              description={receta.descripcion}
              category={receta.categorias}
            />
          ))}
        </div>
    </div>
    </>
  );
};