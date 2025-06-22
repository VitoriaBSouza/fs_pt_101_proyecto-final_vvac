import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// services
import recipeServices from "../services/recetea_API/recipeServices.js";

export const RecipeScroller = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeServices.getAllRecipes(); // usa tu servicio aquí
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes from service:', err);
      }
    };

    fetchRecipes();
  }, []);

  const handleClick = async (id) => {
    navigate("/recipes/" + id);
    window.history.scrollRestoration = 'manual';
    try {
      const data = await recipeServices.getOneRecipe(id);
      dispatch({ type: 'get_one_recipe', payload: data });
    } catch (err) {
      console.error('Error fetching recipe:', err);
    }
  };

  return (
    <div className="card_row_scroll my-5">
      <h2 className="title_Recipe_Scroller text-center fw-bold mb-0 text-dark">Some Random Ideas!!</h2>
      <div
        className="d-flex overflow-auto gap-3 pb-3"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {recipes.map(recipe => (
          <div
            className="m-2 home_cards_bg border flex-shrink-0"
            style={{ width: '280px', scrollSnapAlign: 'start', cursor: 'pointer' }}
            key={recipe.id}
            onClick={() => handleClick(recipe.id)}
          >
            <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
              <img
                src={recipe.img}
                className="img-fluid recipes_card_img border-0"
                alt="recipe_img"
              />
              <div className="card-img-overlay p-0 d-flex align-items-end">
                <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
                  <p className="card-title text-light fs-3 p-3">{recipe.name}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};