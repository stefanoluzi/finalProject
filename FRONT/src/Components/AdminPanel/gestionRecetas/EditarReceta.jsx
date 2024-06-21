import { useEffect, useState } from "react";
import { fetchCaracteristicas, fetchCategories, updateRecipe } from "../../../api/api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseDB } from "../../../api/firebase";
import "./CrearReceta.css";

const EditarReceta = ({
  closeModal,
  fetchRecipes,
  recipeId,
  initialRecipe,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ingredientes: "",
    instrucciones: "",
    caracteristicas: [],
    categorias: [],
    imagenes: [],
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [imageLoadError, setImageLoadError] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    initializeForm();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [initialRecipe]);
  
  const initializeForm = async () => {
    await getData();
    if (initialRecipe) {
      setFormData({
        nombre: initialRecipe.nombre || "",
        descripcion: initialRecipe.descripcion || "",
        ingredientes: initialRecipe.ingredientes || "",
        instrucciones: initialRecipe.instrucciones || "",
        caracteristicas: initialRecipe.caracteristicas.map((car) => car.id) || [],
        categorias: initialRecipe.categorias.map((cat) => cat.id) || [],
        imagenes: initialRecipe.imagenes.map((img) => img.urlImg) || [],
      });
      setImageLoadError(new Array(initialRecipe.imagenes.length).fill(false));
    }
  };

  const getData = async () => {
    let data = await fetchCategories();
    if (data) {
      setCategorias(data);
    } else {
      alert("Error al cargar categorías.");
    }
    data = await fetchCaracteristicas();
    if (data) {
      setCaracteristicas(data);
    } else {
      alert("Error al cargar características.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((option) => option.value);
      setFormData({
        ...formData,
        [name]: values,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = async (index, imagen) => {
    const updatedImages = [...formData.imagenes];
    const storageRef = ref(firebaseDB, `/recetas/${formData.nombre}/${imagen.name}`)

    try {
      await uploadBytes(storageRef, imagen)
      const url = await getDownloadURL(storageRef)
      updatedImages[index] = url;

      setFormData({
        ...formData,
        imagenes: updatedImages,
      });
    } catch (e){
      console.log("hubo algun error")
    }

    const updatedErrors = [...imageLoadError];
    updatedErrors[index] = false; // Reset error state when the image URL changes
    setImageLoadError(updatedErrors);
  };

  const addImageField = () => {
    if (formData.imagenes[formData.imagenes.length - 1].trim() !== "") {
      setFormData({
        ...formData,
        imagenes: [...formData.imagenes, ""],
      });
      setImageLoadError([...imageLoadError, false]);
    }
  };

  const removeImageField = (index) => {
    const updatedImages = formData.imagenes.filter((_, i) => i !== index);
    const updatedErrors = imageLoadError.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imagenes: updatedImages.length > 0 ? updatedImages : [""],
    });
    setImageLoadError(updatedErrors.length > 0 ? updatedErrors : [false]);
  };

  const handleImageError = (index) => {
    const updatedErrors = [...imageLoadError];
    updatedErrors[index] = true;
    setImageLoadError(updatedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      nombre,
      descripcion,
      ingredientes,
      instrucciones,
      caracteristicas,
      categorias,
      imagenes,
    } = formData;

    if (
      !nombre ||
      !descripcion ||
      !ingredientes ||
      !instrucciones ||
      caracteristicas.length === 0 ||
      categorias.length === 0 ||
      imagenes.length === 0
    ) {
      alert("Por favor ingrese todos los campos.");
      return;
    }

    const updatedRecipe = {
      nombre,
      descripcion,
      ingredientes,
      instrucciones,
      caracteristicas: caracteristicas.map((caracteristica) => parseInt(caracteristica)),
      categorias: categorias.map((category) => parseInt(category)),
      imagenes: imagenes.filter((image) => image.trim() !== ""),
    };

    const success = await updateRecipe(recipeId, updatedRecipe);
    if (success) {
      fetchRecipes();
      closeModal();
      setShowSuccessMessage(true);
    } else {
      alert("Error al actualizar la receta.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content crear-receta-container">
        <div className="form-wrapper">
          <h2 className="title">Editar Receta</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
              <span className="error-text">{validationErrors.nombre}</span>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
              />
              <span className="error-text">{validationErrors.descripcion}</span>
            </div>

            <div className="form-group">
              <label>Ingredientes</label>
              <input
                className="form-control"
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleChange}
              />
              <span className="error-text">
                {validationErrors.ingredientes}
              </span>
            </div>

            <div className="form-group">
              <label>Instrucciones</label>
              <textarea
                className="form-control"
                name="instrucciones"
                rows="4"
                value={formData.instrucciones}
                onChange={handleChange}
              />
              <span className="error-text">
                {validationErrors.instrucciones}
              </span>
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                className="form-control select-categorias"
                name="categorias"
                multiple
                value={formData.categorias}
                onChange={handleChange}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.categorias}
                  </option>
                ))}
              </select>
              <span className="error-text">{validationErrors.categoria}</span>
            </div>

            <div className="form-group">
              <label>Características</label>
              <select
                className="form-control select-categorias"
                name="caracteristicas"
                multiple
                value={formData.caracteristicas}
                onChange={handleChange}
              >
                {caracteristicas.map((caracteristica) => (
                  <option key={caracteristica.id} value={caracteristica.id}>
                    {caracteristica.nombre}
                  </option>
                ))}
              </select>
              <span className="error-text">{validationErrors.caracteristica}</span>
            </div>

            <div className="form-group">
              <label>Imágenes</label>
              <div className="image-container">
                {formData.imagenes.map((imagen, index) => (
                  <div key={index} className="image-field">
                    <input
                      className="form-control"
                      name={`imagen-${index}`}
                      type="file"
                      // value={imagen}
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                    {imagen && !imageLoadError[index] ? (
                      <img
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        className="preview-image"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        🚫 Imagen no disponible
                      </div>
                    )}
                    {formData.imagenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="add-image-btn-container">
                <button
                  type="button"
                  className="add-image-btn"
                  onClick={addImageField}
                >
                  +
                </button>
              </div>
              <span className="error-text">{validationErrors.imagenes}</span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn cancel-btn"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="submit" className="btn submit-btn">
                Guardar cambios
              </button>
            </div>
          </form>
          {showSuccessMessage && (
            <div className="success-message">
              ¡La receta fue actualizada con éxito!
              <button onClick={() => setShowSuccessMessage(false)}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarReceta;
