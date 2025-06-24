import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

//services
import userServices from "../services/recetea_API/userServices.js"

export const ChangePasswd = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const { token } = useParams();

    const [passwordData, setPasswordData] = useState({
        password: "",
    })

    const [repeatPasswd, setRepeatPasswd] = useState("")

    const handleChange = e => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handlePassword = async (e) => {
        e.preventDefault();

        if (passwordData.password != repeatPasswd) {
            window.alert("Your passwords do not match.")
        }

        try {
            const data = await userServices.resetPassword(token, passwordData.password);

            if (data.success) {

                // Dispatch user data including token if needed
                dispatch({ type: "resetPasswd" });
                navigate("/login");

            } else {
                //we can set another page here or change to a banner
                window.alert(data.error)
            }

        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <div className="container-fluid sigUp_background pb-4 p-4">
            <div className="row d-flex mb-4 mt-4">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
                    <div className="card p-4 shadow recipe_card_bg1 mx-auto">
                        <p className="mb-3 text-center text-danger fs-2 fw-bold">Change your password</p>
                        <form onSubmit={handlePassword} className="mt-2">
                            <div className="my-4 fs-4 pt-2">
                                <input
                                    type="password"
                                    value={passwordData.password}
                                    name="password"
                                    onChange={handleChange}
                                    className="form-control fs-4"
                                    id="exampleInputPwd1"
                                    placeholder="New Password"
                                    aria-describedby="pwdHelp" />
                            </div>

                            <div className="my-4 fs-4 pt-2">
                                <input
                                    type="password"
                                    value={repeatPasswd}
                                    name="repeatPasswd"
                                    onChange={(e) => setRepeatPasswd(e.target.value)}
                                    className="form-control fs-4"
                                    id="exampleInputPwd2"
                                    placeholder="Repeat your new password"
                                    aria-describedby="newPwdHelp" />
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
        </div>
    );
};