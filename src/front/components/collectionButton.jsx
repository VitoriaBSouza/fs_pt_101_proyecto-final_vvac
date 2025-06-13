import React, { useEffect, useRef } from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import collectionServices from "../services/recetea_API/collectionServices.js"

//components
import { PopOver } from '../components/buttons/popOver.jsx';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

export const CollectionButton = (props) =>{

    const { store, dispatch } = useGlobalReducer()
    
    const getUserCollection = async () => collectionServices.getUserCollections().then(data => {

        if (!store.user?.user_id) return alert("Log in to save recipes");

        dispatch({ type: 'get_user_collection', payload: data });
    })

    console.log("collections", store.collections);
    console.log("collections for user", store.collections?.[store.user?.user_id]);

    // Check if the current user has added already this recipe to list
    const isAdded = Array.isArray(store.collections)
    ? store.collections.some(r => r.recipe_id === props.recipe_id)
    : false;

    //Fetch POST for adding collection to database under user_id and recipe_id
    const addToCollection = async () => collectionServices.addToCollection(props.recipe_id).then(data => {

        getUserCollection()

        const arrayCollections = Array.isArray(data.data) ? data.data : [];

        dispatch({
            type: 'add_recipe',
            payload: { user_id: store.user?.user_id, collections: arrayCollections }
        });

        console.log("recipe added to collection", data);
        return data;
    })

    const removeFromCollection = async () => collectionServices.collectionServices.removeFromCollection(props.recipe_id).then(data => {

        getUserCollection()

        const arrayCollections = Array.isArray(data.data) ? data.data : [];

        dispatch({
            type: 'remove_recipe',
            payload: { user_id: store.user?.user_id, collections: arrayCollections }
        });

        console.log("recipe removed from collection", data);
        return data;
    })

    const handleCollection = (e) =>{
        e.preventDefault()

        if(!isAdded){
            addToCollection()
        }else{
            removeFromCollection
        }

    }
    
    useEffect(() => {
        store.collections?.user_id
        // Re-run effect if recipe_id or user login status changes
    }, [props.recipe_id, dispatch, store.user?.user_id]);

     // Debugging logs
    useEffect(() => {
        console.log(`UserID: ${store.user?.user_id}`);
        console.log(`Collections:`, store.collections);
        console.log(`Is Added: ${isAdded}`);
        console.log("user token: " + store.user?.token);

    }, [store.user?.user_id, isAdded, store.collections]);

    return(
        <div>
            {store.user?.user_id ?

                <button type="button" 
                className="bnt border-0"
                onClick={handleCollection}>
                    {isAdded ? 
                        ""
                        :
                        <FontAwesomeIcon icon={faBook} className="pe-3 buttons_recipe color_icons border-end border-secondary"/>
                    }
                </button>

                :

                <PopOver>
                    <button type="button" 
                    className="btn border-0">
                        <FontAwesomeIcon icon={faBook} className="pe-3 buttons_recipe color_icons border-end border-secondary"/>
                    </button>
                </PopOver>
            }
        </div>
    );
}