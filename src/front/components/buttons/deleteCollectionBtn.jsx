import React from "react";
import { useNavigate } from "react-router-dom";

//hooks
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

//services
import collectionServices from "../../services/recetea_API/collectionServices.js";

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const DeleteCollectionBtn = ({ recipe_id, loadUserCollections }) => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleDelete = async () => {

        const data = await collectionServices.removeFromCollection(recipe_id);

        if (data.success) {

            const updatedCollections = store.collections.filter(
                item => item.recipe_id !== recipe_id
            );

            //update store.collections
            dispatch({ type: 'update_collections', payload: updatedCollections });
            loadUserCollections()

        } else {
            console.error("Error from service:", data.error);
        }

    }

    return (
        <div className="d-flex gap-2">
            <div className="recipe-action-buttons bg-opacity-50 rounded d-flex p-1 gap-2">
                <button className="btn btn-sm border-0 p-1" type="button" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} className="fs-4 recipe-delete-buttons" />
                </button>
            </div>

        </div>
    );
};
