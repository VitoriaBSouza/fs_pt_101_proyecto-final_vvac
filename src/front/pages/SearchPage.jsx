import React from "react";
import { Navbar } from "react-bootstrap";
import { TurnHome } from "../components/buttons/TurnHome.jsx";
import { SearchFilter } from "../components/SearchFilter.jsx";

export const SearchPage = () => {
    return (
        <div className="container-fluid">
            <TurnHome />
            <SearchFilter />
        </div>
    );
};



