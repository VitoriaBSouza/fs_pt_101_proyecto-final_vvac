import React from "react";

//components
import { SignUp } from "../components/SignUp.jsx";

export const RegisterPage = () =>{

    return(
        <div className="container-fluid sigUp_background p-4">
            <h1 className="p-4 text-center sigUp_title">Welcome to Recetea!</h1>
            <SignUp />
        </div>
    );
}