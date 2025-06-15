import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { RightMenu } from "../components/RightMenu";
import { useNavigate } from "react-router-dom";
import userServices from "../services/recetea_API/userServices.js"

export const Profile = () => {
    const navigate = useNavigate();


    //desde aqui
    const handleChangeEmail = async (e) => {
        e.preventDefault();
        try {
            //ToDo-- ver que tiene el userData para poder cambiar SOLO el correo.
            const resultado = await userServices.editUser("userData")
            
        } catch (error) {
            window.alert("Something went wrong. Please try again: " + error)
        }
    }

    const handleUpdatePasswd = async (e) => {
        e.preventDefault();
        try {
            
            //ToDo-- ver que tiene el userData para poder cambiar SOLO el correo.
            
            console.log("vamos a cambiar de esta contraseña!")
            // const resultado = await userServices.editUser("userData")

        } catch (error) {
            window.alert("Something went wrong. Please try again: " + error)
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const resultado = await userServices.deleteUser()
            window.alert("Resultado de la eliminación de la cuenta: " + resultado)
            navigate("/")
        } catch (error) {
            window.alert("Something went wrong. Please try again: " + error)
        }
    }
    // hasta aqui



    return (

        <div className="main-row-all vh-100">
            <div className="profile-container">
                <div className="container text-center sidebar-left-profile">
                    <div className="row align-items-start g-0">
                        {/* COLUMNA IZQ */}

                        <div className="col-12 col-md-3">

                            <div className="d-flex align-items-start">
                                <TurnHome />
                                <LinksMenu />
                            </div>

                        </div>





                    {/* COLUMNA PRINCIPAL  */}
                    <div className="col-6 main-column-content">

                        <div className="d-flex align-items-start flex-column mb-3 edit-perfil">

                            {/* Pendiente hook para cambiar imagen de perfil!!!*/}
                            <div className="change-picture" data-mdb-ripple-color="light">
                                <img src="https://thispersondoesnotexist.com/" alt="Your profile pic" className="rounded-circle pic-perfil" />

                                <div className="mask-change-pic">

                                    <h4><i className="fa-solid fa-camera"></i></h4>
                                    <p className="text-change">Change</p>

                                </div>
                            </div>
                            <form className="text-start form-perfil w-75">

                                <div className="mb-3 ">
                                    <label htmlFor="username" className="form label mt-3">Username </label>
                                    <input type="text" className="form-control" id="username" placeholder="@the_bestcooker" />
                                    <label htmlFor="Email1" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="Email1" placeholder="the_bestcooker@mail.com" />

                                    <p className="change-email">
                                        {/* Link no existe aun! o sera solo un modal?? */}
                                        <Link to="/change-email" onClick={handleChangeEmail}>CHANGE E-MAIL</Link>
                                    </p>

                                </div>
                            </form>
                            <form className="text-start form-perfil w-75" id="passwdchange">
                                <div className="form-group mb-3">
                                    <label htmlFor="curren-password" className="form-label">Change password</label>
                                    <input type="password" className="form-control" id="current-password" placeholder="*Current password" />
                                    <input type="password" className="form-control" id="new-password" placeholder="*Type new password" />
                                    <input type="password" className="form-control" id="repeat-password" placeholder="*Repeat new password" />
                                </div>
                                <div className="actions-profile">

                                    <button type="submit" className="btn btn-secondary" onClick={handleUpdatePasswd}>Update</button>
                                    <button type="reset" className="btn btn-danger ms-2">Cancel</button>
                                </div>
                            </form>

                        </div>
                    </div>

                    {/* COLUMNA DERECHA */}

                    <div className="col-3 right-profile">

                        {/* Pendiente definir altura boton, cambiaría segun el footer. 
                        La mejor opción para que esté el buton [DELETE ACCOUNT] al final de la pagina sería con el viewport (vh) */}

                        <div className="d-grid row-gap-5 b-grids-right h-100">
                            <RightMenu />

                            <div className="align-self-end">
                                {/* ABRIR MODAL PARA CONFIRMAR EL BORRADO DE LA CUENTA */}
                                {/* ESE MODAL TAN SOLO TIENE QUE LLAMAR A:  */}
                                <button type="button" className="btn btn-secondary" >Delete account</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    )
}