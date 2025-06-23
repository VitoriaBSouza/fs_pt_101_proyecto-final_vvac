import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import userServices from "../services/recetea_API/userServices.js"

export const SignUp = () => {

    const {store, dispatch} = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username:"",
        email: "",
        password: ""
    })

    const handleChange = e => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await userServices.signup(formData);
            
            if (data.success){
                dispatch({ type: "signUp"});
                navigate("/login")
            } else{
                window.alert(data.error || "Could not sign up, try again.")
            }
        } catch(error){
            window.alert("An unexpected error occurred. Please try again later.")
        }
    }    

    return (
        <div className="row d-flex mb-4 mt-4">
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 mx-auto">
                <div className="card p-4 shadow recipe_card_bg1 mx-auto">
                    <h3 className="mb-3 text-center text-danger fs-1 fw-bold">Sign Up Now!</h3>
                    <form onSubmit={handleSubmit} className="mt-2">
                        <div className="mb-4 fs-4">
                            <label htmlFor="exampleInputEmail1" className="form-label mb-2">Username</label>
                            <input 
                            type="text"
                            value={formData.username}
                            name="username"
                            onChange={handleChange}
                            className="form-control fs-4" 
                            id="exampleInputUsername1" 
                            aria-describedby="usernameHelp"/>
                        </div>
                        <div className="mb-4 fs-4">
                            <label htmlFor="exampleInputEmail1" className="form-label mb-2">Email</label>
                            <input 
                            type="email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            className="form-control fs-4" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp"/>
                        </div>
                        <div className="mb-3 fs-4">
                            <label htmlFor="exampleInputPassword1" className="form-label mb-2">Password</label>
                            <input 
                            type="password"
                            value={formData.password} 
                            name="password"
                            onChange={handleChange}
                            className="form-control fs-4" 
                            id="exampleInputPassword1"/>
                        </div>
                        <button type="submit" className="btn btn-danger mt-2 fs-5 mb-4">Sign Up</button>

                        <h4 className="mb-0 mt-4 text-end fs-5">
                            {/* Need to add link to forgot password page*/}
                            <Link to="/forgot-password" className="text-decoration-none">
                                <span className="text-danger fw-bold"> Forgot your password?</span>
                            </Link>
                        </h4>

                        <div className="mb-0 mt-1 text-end fs-5 d-sm-flex">
                            <p className="p-0 m-0 me-sm-2 ms-auto">Already have an account?</p>
                            {/* Need to add link to sign up page */}
                            <Link to="/login" className="text-decoration-none">
                                <span className="text-danger fw-bold"> Log In here!</span>
                            </Link>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};