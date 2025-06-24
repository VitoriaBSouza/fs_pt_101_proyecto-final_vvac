import { useNavigate } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../services/recetea_API/recipeServices.js"

export const UserRecipeCard = (props) => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate()

    const name = props.name || props.title;
    const url = props.url || props.imageUrl;

    // Fetch of the comments by recipe_id
    const getOneUserRecipe = async () => recipeServices.getOneUserRecipe(props.recipe_id).then(data => {
        dispatch({ type: 'get_user_recipe', payload: data });
    })

    const handleClick = (e) => {
        navigate("/recipes/" + props.id);
        getOneUserRecipe();
    };

    return (
        <div className="m-2 recipes_cards_bg border">
            <div className="card row_bg_suggestions text-white p-0 border-0 position-relative h-100">
                <img
                    src={url}
                    className="img-fluid card-img recipes_card_user border-0"
                    alt="recipe_img"
                />

                <div className="card-img-overlay d-flex flex-column justify-content-between p-2 p-sm-3 overflow-auto">
                    {/* Botones arriba derecha */}
                    <div className="d-flex justify-content-end position-absolute top-0 end-0 m-1 m-sm-2 z-2">
                        {props.children}
                    </div>

                    {/* Título + Fecha abajo */}
                    <div
                        className="text-center bg-dark bg-opacity-75 rounded p-1 p-sm-2 mt-auto"
                        onClick={handleClick}
                    >
                        <p className="card-title text-light fs-6 fs-sm-5 mb-1 lh-1">{name}</p>
                        <small className="text-light">{props.published}</small>
                    </div>
                </div>
            </div>
        </div>

    );
};
