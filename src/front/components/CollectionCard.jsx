
import PropTypes from 'prop-types';
// import defaultRecipeImage from '../assets/img/default-recipe-image.png'; // Asegúrate de que esta ruta sea correcta para una imagen por defecto

export const CollectionCard = ({ id, imageUrl, title, ingredientsList, authorName, savedDate, onClick }) => {
    const handleCardClick = () => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <div className="card recipe_card_custom" onClick={handleCardClick}>
            <div className="row g-0">
                {/* Imagen de la Receta */}
                <div className="col-4">
                    <img
                        src={imageUrl || defaultRecipeImage} // Usa la imagen por defecto si no hay URL
                        className="recipe_card_img_small"
                        alt={title || "Recipe Image"}
                        onError={(e) => { e.target.onerror = null; e.target.src = defaultRecipeImage; }} // Fallback en caso de error de carga
                    />
                </div>
                {/* Contenido de la Receta */}
                <div className="col-8">
                    <div className="card-body recipe_card_body">
                        <h5 className="card-title recipe_card_title">{title}</h5>
                        <p className="card-text recipe_card_ingredients">{ingredientsList}</p>
                        <div className="d-flex align-items-center mt-2">
                            {/* Aquí puedes añadir el avatar del autor si lo tuvieras */}
                            <p className="card-text recipe_card_author_name mb-0 ms-2">{authorName}</p>
                        </div>
                        {savedDate && (
                            <p className="card-text recipe_card_date mt-1">Guardado el {savedDate}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

CollectionCard.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    ingredientsList: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    savedDate: PropTypes.string, // Opcional, para la fecha de guardado en colección
    onClick: PropTypes.func,
};

CollectionCard.defaultProps = {
    imageUrl: '',
    savedDate: '',
    onClick: () => { },
};