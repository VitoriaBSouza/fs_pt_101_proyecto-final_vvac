import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { faBookMedical } from '@fortawesome/free-solid-svg-icons'

import collectionServices from "../services/recetea_API/collectionServices.js";

export const RecipeCard = ({ id, imageUrl, title, ingredientsList, authorName, savedDate, onClick }) => {

    const { store, dispatch } = useGlobalReducer();

    const isAdded = store.collections?.some(item => item.recipe_id === Number(id));

    //ESTE CODIGO SE DEBERIA UNIFICAR CON COLLECTIONBUTTON.JSX (YA QUE ESTAS 3 FUNC. SON DE ALLI Y LIGERAMENTE ADAPTADAS)
    const getUserCollection = async () => collectionServices.getUserCollections().then(data => {
        if (!store.user?.id) return alert("Log in to save or remove recipes");
        dispatch({ type: 'get_user_collection', payload: data.data });
        return data.data;
    })

    const addToCollection = async () => {
        const updatedCollection = await getUserCollection();
        const exists = updatedCollection.some(item => item.recipe_id === Number(id));
        if (!exists) {
            const data = await collectionServices.addToCollection(id);
            if (data.success) {
                const newList = await getUserCollection();
                dispatch({ type: 'update_collections', payload: newList });
            } else {
                console.error("Error from service:", data.error);
            }
        }
    };

    const removeFromCollection = async () => {
        const updatedCollection = await getUserCollection();
        const exists = updatedCollection.some(item => item.recipe_id === Number(id));
        if (exists) {
            const data = await collectionServices.removeFromCollection(id);
            if (data.success) {
                const newList = await getUserCollection();
                dispatch({ type: 'update_collections', payload: newList });
            } else {
                console.error("Error from service:", data.error);
            }
        }
    };
    // !

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
                    <img src={imageUrl} className="recipe_card_img_small" alt={title || "Recipe Image"} />
                </div>
                {/* Contenido de la Receta */}
                <div className="col-8">
                    <div className="card-body recipe_card_body">
                        <h5 className="card-title recipe_card_title">{title}</h5>
                        <p className="card-text recipe_card_ingredients">{ingredientsList}</p>
                        <div className="d-flex align-items-center mt-2">
                            <p className="card-text recipe_card_author_name mb-0 ms-2">{authorName}</p>
                        </div>
                        {savedDate && (
                            <p className="card-text recipe_card_date mt-1">Saved on {savedDate}</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Icono de Libro en la esquina superior derecha */}
            <div className="recipe_card_collection_icon" onClick={(e) => { e.stopPropagation(); isAdded ? removeFromCollection() : addToCollection() }}>
                {isAdded ? (<FontAwesomeIcon icon={faBook} />) : (<FontAwesomeIcon icon={faBookMedical} />)}
            </div>
        </div>
    );
};




// import { useNavigate} from "react-router-dom";
// import { useEffect } from "react";

// //hooks
// import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// //services
// import recipeServices from "../services/recetea_API/recipeServices.js"


// export const RecipeCard = (props) => {

//     const navigate = useNavigate()
//     const {store, dispatch} = useGlobalReducer();

//     const getOneRecipe = async () => recipeServices.getOneRecipe(props.id).then(data=>{
//         dispatch({type: 'get_one_recipe', payload:data});
//     })

//     const handleClick = (e) => {
//         navigate("/recipes/" + props.id)
//         window.history.scrollRestoration = 'manual'
//         getOneRecipe()
//     }

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [props.recipe_id]);

//     return(
//         <div className="m-2 recipes_cards_bg border" onClick={handleClick}>
//             <div className="card row_bg_suggestions text-white p-3 border-0 position-relative overflow-hidden">
//                 <img src={props.url} className="img-fluid card-img recipes_card_img border-0" alt="recipe_img"/>
//                 <div className="card-img-overlay p-0 d-flex align-items-end">
//                     <div className="w-100 bg-opacity-50 text-center title_suggestion_card m-3">
//                         <p className="card-title text-light fs-3 p-3">{props.name}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }