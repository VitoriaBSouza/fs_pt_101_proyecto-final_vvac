import PropTypes from "prop-types";

/**
 * RecipeCard muestra:
 *  - imagen (o placeholder si no hay), (ok)
 *  - nombre del producto/receta, (ok)
 *  - nutriscore (si existe), (ok)
 *  - botón para “save/unsave” en función de savedItems, (ok)
 *  - opcionalmente, un callback onClick para ir a detalle. (ok)
 * ----> ¿onToggleSave, por?
 */


export const RecipeCard = ({ id, name, imageUrl, nutriScore, isSaved, onToggleSave, onClick, }) => {

    return (
        <div className="recipe-card">
            <div className="card-image-container" onClick={()=> onClick(id)}>
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="card-image" />
                ):(
                    <div className="no-image-placeholder"> No image </div>
                )}
            </div>
                
            <div className="card-body">
                <h5 className="card-title" onClick={() => onClick(id) }> {name} </h5>
                {nutriScore && (
                    <p className="card-nutri"> Nutriscore: <strong>{nutriScore.toUpperCase()}</strong></p>
                )}
            </div>

            <div className="card-actions">
                <button className={`btn-save ${isSaved ? "saved" : ""}`} onClick={() => onToggleSave(id)}>
                    {isSaved ? "★ Saved" : "☆ Save"}
                </button>
            </div>
        </div>
    )
}

RecipeCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  nutriScore: PropTypes.string,
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func.isRequired,
//   onClick: PropTypes.func, 
};



RecipeCard.defaultProps = {
  imageUrl: "",
  nutriScore: null,
  isSaved: false,
  onClick: () => {},
};