// src/front/pages/SearchPage.jsx
import React from "react";
import { TurnHome } from "../components/buttons/TurnHome.jsx";
import { SearchFilter } from "../components/SearchFilter.jsx";
import { LinksMenu } from "../components/LinksMenu.jsx";

export const SearchPage = () => {
    return (
        <div className="container-fluid">
            <TurnHome />
            <div className="row">
                {/* Menú lateral izquierdo */}
                <div className="col-md-2 p-3">
                    <LinksMenu />
                </div>

                {/* SearchFilter contiene filtros + vista de recetas */}
                <div className="col-md-10 p-3">
                    <SearchFilter />
                </div>
            </div>
        </div>
    );
};
