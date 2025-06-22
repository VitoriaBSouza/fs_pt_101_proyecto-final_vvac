import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../services/recetea_API/recipeServices.js"

export const RecipeCard = (props) => {

    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    //Hay que limitar a mostrar 10-15 random cards

    const getOneRecipe = async () => recipeServices.getOneRecipe(props.id).then(data => {
        dispatch({ type: 'get_one_recipe', payload: data });
    });

    const handleClick = (e) => {
        navigate("/recipes/" + props.id);
        getOneRecipe();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [props.recipe_id]);

    const name = props.name || props.title || "Untitled";
    const url = props.url || props.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

    return (
        <div className="m-2 recipes_cards_bg border" onClick={handleClick}>
            <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
                <img src={url} className="img-fluid card-img recipes_card_img border-0" alt="recipe_img" />
                <div className="card-img-overlay p-0 d-flex align-items-end">
                    <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
<<<<<<< HEAD
                        <p className="card-title text-light fs-3 p-3">{name}</p>
=======
                        <p className="card-title text-light fs-3 p-3">{props.title}</p>
>>>>>>> 4cc6ac9951f854a9364ae21a5cd7c7aadbf28943
                    </div>
                </div>
            </div>
        </div>
    );
};
