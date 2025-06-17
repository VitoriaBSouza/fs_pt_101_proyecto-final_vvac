import React, { useState } from "react";

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

export const Search = () =>{

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('title'); // default filter

    const handleSearch = (e) => {
        e.preventDefault();

        // Use searchQuery and filter here
        console.log(`Searching for "${searchQuery}" in "${filter}"`);
    };

    return(
        <form onSubmit={handleSearch} 
        className="d-flex mx-auto w-75 align-items-center position-relative 
        p-2 rounded-pill border-0 search_box_bg">
            <input 
                className="form-control me-2 search_input_bg border-0" 
                type="search" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="dropdown border-start">
                <button 
                className="btn border-0 dropdown-toggle" 
                type="button" 
                id="filterDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                >
                <FontAwesomeIcon icon={faFilter} />
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
    )
}