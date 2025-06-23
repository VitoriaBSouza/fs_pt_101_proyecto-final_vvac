import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import userServices from "../services/recetea_API/userServices.js"

export const LogIn = () => {

    const {store, dispatch} = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
            const data = await userServices.login(formData);

            if (data.success){

                // Store token on store
                localStorage.setItem("token", data.token);

                // Store full user data on store to easy fetch
                localStorage.setItem("user", JSON.stringify(data.user));

                // Dispatch user data including token if needed
                dispatch({ type: "logIn", payload: { token: data.token, user: data.user } });

                //Will keep on home page but for users
                navigate("/profile")
            
            } else{
                //we can set another page here or change to a banner
                window.alert(data.error)
            }

        } catch(error){
            console.log("Login error:", error);
            window.alert(error)
        }
    }    

    return (
        <div className="row d-flex mb-4 mt-4">
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 mx-auto">
                <div className="card p-4 shadow recipe_card_bg1 mx-auto">
                    <h3 className="mb-3 text-center text-danger fs-1 fw-bold">Let's cook Chef!</h3>
                    <form onSubmit={handleSubmit} className="mt-2">
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
                        <button type="submit" className="btn btn-danger mt-2 fs-5 mb-4">Log In</button>

                        <h4 className="mb-0 mt-3 text-end fs-5">
                            {/* Need to add link to forgot password page*/}
                            <Link to="/forgot-password" className="text-decoration-none">
                                <span className="text-danger fw-bold"> Forgot your password?</span>
                            </Link>
                        </h4>

                        <div className="mb-0 mt-1 text-end fs-5 d-sm-flex">
                           <p className="p-0 m-0 me-sm-2 ms-auto"> Are you not registered yet?</p>
                            {/* Need to add link to sign up page */}
                            <Link to="/signup" className="text-decoration-none">
                                <span className="text-danger fw-bold"> Sign Up here!</span>
                            </Link>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};