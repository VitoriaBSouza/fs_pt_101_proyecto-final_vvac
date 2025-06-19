import React, { useState, useEffect  } from "react";
import { useNavigate, Link  } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

export const Search = () =>{

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate()

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filter, setFilter] = useState("Title"); // default filter

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            // You might want to navigate to the first matched recipe or show results
            navigate("/recipes/" + searchResults[0].id);
        }
    };

   useEffect(() => {
        if (!search) {
            setSearchResults([]);
            return;
        }

        const filtered = store.recipes.filter((recipe) => {
            if (filter === "title") {
                return recipe.title?.toLowerCase().includes(search.toLowerCase());
            }

            if (filter === "allergens" && Array.isArray(recipe.allergens)) {
                return recipe.allergens.some(allergen =>
                    allergen.toLowerCase().includes(search.toLowerCase())
                );
            }

            return false;
        });

        setSearchResults(filtered);
    }, [search, filter, store.recipes?.id]);

    return(
        
        <div className="container">
            <form onSubmit={handleSearch} className=" d-flex mx-auto align-items-center 
            p-2 rounded-pill border-0 search_box_bg">
                <input 
                className="form-control me-2 search_input_bg border-0" 
                type="search" 
                    placeholder={`Search by ${filter}`}
                value={search}
                onChange={handleChange}/>
                <div className="dropdown border-start">
                    <button 
                    className="btn border-0 dropdown-toggle" 
                    type="button" 
                    id="filterDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
                        <FontAwesomeIcon icon={faFilter} />
                        <span className="ms-1 text-capitalize">{filter}</span>
                    </button>

                    <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                        <li className="m-2">
                            <button className="dropdown-item" onClick={() => setFilter('title')}>Title</button>
                        </li>
                        <li className="m-2">
                            <button className="dropdown-item" onClick={() => setFilter('ingredients')}>Allergens</button>
                        </li>
                        <li className="m-2">
                            <button className="dropdown-item" onClick={() => setFilter('category')}>Diets</button>
                        </li>
                    </ul>
                </div>
            </form>
            {store.recipes?.length != 0 && (
                <div className="searchResult mx-auto mt-2">
                    {store.recipes?.map((value, key) => {
                        return (
                        <Link className="dataItem" to={"/recipes/" + value.id}>
                            <p>{value.title} </p>
                        </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}