import React, {useState, useEffect} from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import collectionServices from "../services/recetea_API/collectionServices.js"

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'


export const CollectionList = () =>{

    const { store, dispatch } = useGlobalReducer();
    const [collection, setCollection] = useState([]);

    const getUserCollection = async () => collectionServices.getUserCollections().then(data => {

        if (!store.user?.id) return alert("Log in to save or remove recipes");

        //We update the store to match the backend DB
        dispatch({ type: 'get_user_collection', payload: data.data });

        return data.data;
        
    })

    console.log(store.collections?.recipe_id);
    

    useEffect(() => {
        if (store.user?.id) {
            getUserCollection()
        }
    }, [store.user?.id]);

    const handleDelete = async (recipe_id) => {

        const data = await collectionServices.removeFromCollection(recipe_id);

        if (data.success) {

            //Fetch again updated list
            const collectionList = await collectionServices.getUserCollections();

            console.log(collectionList);
            
            setCollection(collectionList);

            //update store.collections
            dispatch({ type: 'update_collections', payload: newList });

            console.log("Recipe was removed from collection: ", data);
            
        } else {
            console.error("Error from service:", data.error);
        }
        
    }

    console.log(store.collections);
    

    return(
        <div className="btn-group border-0 ms-3 ms-auto">
            <button type="button" 
            className="btn rounded-circle nav_collection_btn border-0" 
            aria-expanded="false"
            data-bs-toggle="dropdown">
                <FontAwesomeIcon icon={faBookBookmark} className="icon_nav_collection"/>
            </button>
            <ul className="dropdown-menu dropdown-menu-end nav_drop">
                {/* important to use condition to either show list or a span/comment with no items added */}
                {/* we will only map if there is items on the list */}
            {store.collections && store.collections.length > 0 ? (
                    store.collections.map((el) => (
                        <li key={el.recipe_id} className="d-flex">
                            <button className="dropdown-item m-1" type="button" style={{ textTransform: 'capitalize' }}>
                                {el.recipe_title}
                            </button>
                            <button 
                                type="button" 
                                className="btn-close m-2" 
                                aria-label="Close"
                                onClick={() => handleDelete(el)}
                            ></button>
                        </li>
                    ))
                ) : (
                    <li>
                        <button className="dropdown-item m-1" type="button" disabled>Your collection list is empty</button>
                    </li>
                )}
                
            </ul>
        </div>
        
    )
}