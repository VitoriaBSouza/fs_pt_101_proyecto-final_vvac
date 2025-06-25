// src/front/pages/SearchPage.jsx
import React, { useState } from "react";
import { SearchFilter } from "../components/SearchFilter.jsx";
import { SearchView } from "../components/SearchView.jsx";
import { LinksMenu } from "../components/LinksMenu.jsx";

export const SearchPage = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap min-vh-100">
        {/* Left sidebar */}
        <div className="col-12 col-sm-3 col-md-2 p-2 d-flex flex-column">
          <LinksMenu />
        </div>

        {/* Center: recipes view */}
        <div className="col-12 col-sm-6 col-md-8 p-2 d-flex flex-column">
          <SearchView recipes={filteredRecipes} />
        </div>

        {/* Right sidebar: filters */}
        <div className="col-12 col-sm-3 col-md-2 p-2 d-flex flex-column">
          <SearchFilter onRecipesFiltered={setFilteredRecipes} />
        </div>
      </div>
    </div>
  );
};
