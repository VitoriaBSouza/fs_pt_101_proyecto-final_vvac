import React from "react";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CollectionList = () =>{

    const { store, dispatch } = useGlobalReducer();

    return(
        <div className="btn-group border-0">
            <button type="button" 
            className="btn btn-secondary dropdown-toggle" 
            data-bs-toggle="dropdown" 
            aria-expanded="false">
                Add icon here
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                {store.collections.map((collection, i) => (
                    <li key={i} className="dropdown-item m-0 p-0 d-flex justify-content-center justify-content-lg-start">
                        <p className="text_ing1 me-2" >{collection.recipe_id}</p>
                    </li>
                ))}
            </ul>
        </div>
        
    )
}