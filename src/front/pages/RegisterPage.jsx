import React from "react";

//components
import { SignUp } from "../components/SignUp.jsx";

export const RegisterPage = () =>{

    return(
        <div className="container-fluid sigUp_background p-4">
            <h3 className="p-4 text-center fw-bold lh-1 mt-4 sigUp_title">
                Welcome to Recetea!
            </h3>
            <SignUp />
        </div>
    );
}