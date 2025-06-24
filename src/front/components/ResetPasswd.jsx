import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import userServices from "../services/recetea_API/userServices.js"

export const ResetPasswd = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
    })

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const data = await userServices.forgotPassword(formData.email);

            if (data.success) {
                // Dispatch user data including token if needed
                dispatch({ type: "forgotPasswd", payload: data.user });

                alert(data.message)
                navigate("/")

            } else {
                //we can set another page here or change to a banner
                window.alert(data.error)
                navigate("/forgot-password")
            }

        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <div className="row d-flex mb-4 mt-4">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
                <div className="card p-4 shadow recipe_card_bg1 mx-auto">
                    <p className="mb-3 text-center text-danger fs-3 fw-bold">Forgot your password?</p>
                    <form onSubmit={handleReset} className="mt-2">

                        <p className="text-center fs-5 lh-1 mt-2 mb-4">
                            Enter your email below to reset your password.
                        </p>
                        <div className="my-4 fs-4 pt-2">
                            <input
                                type="email"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                className="form-control fs-4"
                                id="exampleInputEmail1"
                                placeholder="Email"
                                aria-describedby="emailHelp" />
                        </div>
                        
                        <button type="submit" className="btn btn-danger my-4 fs-5">Submit</button>

                        <h4 className="mb-0 mt-4 text-end fs-6 d-flex">
                            {/* Need to add link to forgot password page*/}
                            <Link to="/login" className="text-decoration-none ms-auto">
                                <span className="text-danger fw-bold fs-5"> Log In!</span>
                            </Link>

                            <p className="mx-2 fw-bold fs-5">or</p>

                            <Link to="/signup" className="text-decoration-none">
                                <span className="text-danger fw-bold fs-5"> Sign Up!</span>
                            </Link>
                        </h4>
                    </form>
                </div>
            </div>
        </div>
    );
};