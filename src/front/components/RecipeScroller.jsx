import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../services/recetea_API/recipeServices.js"


export const RecipeScroller = (props) => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();

  const getOneRecipe = async () => recipeServices.getOneRecipe(props.id).then(data => {
    dispatch({ type: 'get_one_recipe', payload: data });
  })

  const handleClick = (e) => {
    navigate("/recipes/" + props.id)
    window.history.scrollRestoration = 'manual'
    getOneRecipe()
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.recipe_id]);

  return (

    <div className="card_row_home_scroll text-white p-3 border-0 position-relative overflow-hidden">
      <div className="m-2 home_cards_bg border" onClick={handleClick}>
        <img src={props.url} className="img-fluid card-img home_card_scroll border-0" alt="recipe_img" />
        <div className="card-img-overlay p-0 d-flex align-items-end">
          <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
            <p className="card-title text-light fs-3 p-3">{props.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};