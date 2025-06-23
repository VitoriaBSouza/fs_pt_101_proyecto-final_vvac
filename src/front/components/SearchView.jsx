// src/front/components/SearchView.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import recipeServices from "../services/recetea_API/recipeServices.js";

export const SearchView = ({ recipes }) => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleClick = (id) => {
        recipeServices.getOneRecipe(id).then(data => {
            dispatch({ type: 'get_one_recipe', payload: data });
            navigate(`/recipes/${id}`);
        });
    };

    useEffect(() => {
        // Solo para depuración, puedes eliminar este log si todo funciona
        console.log("Recetas recibidas por SearchView:", recipes);
    }, [recipes]);

    if (!recipes || recipes.length === 0) {
        return <p className="text-muted mt-4">No se encontraron recetas con esos filtros.</p>;
    }

    return (
        <div className="d-flex flex-column">
            {recipes.map(recipe => (
                <div key={recipe.id} className="m-2 recipes_cards_bg border" onClick={() => handleClick(recipe.id)} style={{ cursor: "pointer" }}>
                    <div className="card p-3 d-flex flex-row align-items-center">
                        <img
                            src={recipe.media?.[0]?.url || "/default.jpg"}
                            className="img-fluid rounded"
                            alt={recipe.title}
                            style={{ maxWidth: "150px", height: "auto", marginRight: "1rem" }}
                        />
                        <div>
                            <h5>{recipe.title}</h5>
                            <p className="text-muted">
                                {recipe.ingredients?.map(i => i.ingredient_name).join(", ") || "No ingredients listed"}
                            </p>
                            <div className="d-flex gap-3">
                                <span>⏱ {recipe.prep_time}m</span>
                                <span>⚙️ {recipe.difficulty_type}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
