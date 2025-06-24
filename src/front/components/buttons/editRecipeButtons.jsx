import React from "react";
import { useNavigate } from "react-router-dom";

//hooks
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

//services
import recipeServices from "../../services/recetea_API/recipeServices.js"

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export const EditRecipeButtons = ({ recipe_id, loadUserRecipes }) => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const data = await recipeServices.deleteRecipe(recipe_id);

            if (data.success) {
                dispatch({ type: 'delete_recipe', payload: recipe_id });

                if (loadUserRecipes) {
                    await loadUserRecipes();
                }

            } else {
                window.alert(data.error || "Could not delete the recipe, please try again.");
            }
        } catch (error) {
            window.alert("Error deleting recipe, try again.");
            console.error(error);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation(); // Previene navegación
        navigate("/recipes/edit/" + recipe_id);

    };

    return (
        <div className="d-flex gap-2">
            <div className="recipe-action-buttons bg-opacity-50 rounded d-flex p-1 gap-2">
                <button className="btn btn-sm border-0 p-1" type="button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} className="fs-4 recipe-edit-buttons" />
                </button>
                <button className="btn btn-sm border-0 p-1" type="button" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} className="fs-4 recipe-delete-buttons" />
                </button>
            </div>

        </div>
    );
};
