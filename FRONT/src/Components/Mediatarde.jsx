import { useContext, useState } from 'react';
import { ContextGlobal } from '../Context';
import { CardCategoria } from './CardCategoria';
import { SearchBar } from './SearchBar';

export const Mediatarde = () => {
  const { state } = useContext(ContextGlobal);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8; // 4 por columna

  const handleSearch = (term) => {
    console.log('Buscando recetas para:', term);
  };

  // Filtrar las recetas de Almuerzo
  const almuerzoRecipes = state.data.filter(recipe =>
    recipe.categorias.some(category => category.categorias === 'Merienda')
  );

  // Definir el título de la categoría basado en la primera receta encontrada
  const categoryTitle = almuerzoRecipes.length > 0 ? almuerzoRecipes[0].categorias.find(category => category.categorias === 'Merienda').categorias : 'Merienda';

  // Calcular el número total de páginas
  const totalPages = Math.ceil(almuerzoRecipes.length / recipesPerPage);

  // Obtener las recetas de la página actual
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = almuerzoRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="category-container">
      <SearchBar onSearch={handleSearch} />
      <div className='title-container'>
        <h1 className="category-title">{categoryTitle}</h1>
      </div>
      <div className="category-recipes">
        {currentRecipes.map(recipe => (
          <CardCategoria
            key={recipe.id}
            title={recipe.nombre}
            image={recipe.imagenes}
            description={recipe.descripcion}
            category={recipe.categorias}
            id={recipe.id}
            ingredients={recipe.ingredientes}
          />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} className="nav-button-category">
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="page-number">{currentPage}</div>
        <button onClick={handleNextPage} className="nav-button-category">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};