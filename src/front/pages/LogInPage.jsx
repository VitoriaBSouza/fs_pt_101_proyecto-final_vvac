import React from "react";

//components
import { LogIn } from "../components/LogIn.jsx";
import { CreateRecipe } from "./CreateRecipe.jsx";


export const LogInPage = () => {

    return (
        <div className="container-fluid logIn_background p-4">
            <h1 className="p-4 text-center logIn_title fw-bold lh-1 mt-4 fs-1 fs-sm-2">Welcome Back to Recetea!</h1>
            <LogIn />
            <CreateRecipe />
        </div>
    )
}