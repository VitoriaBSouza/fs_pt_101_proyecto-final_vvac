import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { RightMenu } from "../components/RightMenu";
import { useNavigate } from "react-router-dom";
import userServices from "../services/recetea_API/userServices.js"
import { useState, useEffect, useRef } from "react"

export const Profile = () => {
    const navigate = useNavigate();

    const { dispatch, store } = useGlobalReducer();
    const [formData, setFormData] = useState(null);
    const [repeatPasswd, setRepeatPasswd] = useState("")

    //Nuevos estados, modal y refers para imagen de perfil
    const [profileImage, SetProfileImage] = useState(store.user?.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/' );
    const fileInputRef = useRef(null);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] =useState("");

    //Función profile img, para subir desde el ordenador:
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                SetProfileImage(reader.result);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    photo_url: reader.result
                }));
                console.log("Imagen local seleccionada? resultado:", reader.result);
            };
            reader.readAsDataURL(file)
        }
    };
    
    //Función profile img, para subir desde URL:
    const handleUrlChange = (e) => {
        const url = event.target.value;
        if (url) {
            SetProfileImage(url);
            setFormData(prevFormData => ({
                ...prevFormData,
                photo_url: url
            }));
            console.log("URL imagen seleccionada!!!!, URL:", url);
        }
    };

    //Función click input del archivo
    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    //Nueva función modal img por url
    const handleOpenUrlModal = () => {
        setTempImageUrl(profileImage.startWith('http') ? profileImage : '');
        setShowUrlModal(true);
    }

    const handleSaveUrlImage = () => {
        if (tempImageUrl) {
            SetProfileImage(tempImageUrl);
            setFormData(prevFormData => ({
                ...prevFormData,
                photo_url: tempImageUrl
            }));
            console.log("Frontend: URL image confirmed from modal:", tempImageUrl);
        }
        handleCloseUrlModal();
    }

    const handleChange = e => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== repeatPasswd) {
            window.alert("The password does not match")
            //this will stop submission if does not match
            return;
        }

        try {
            const data = await userServices.editUser(formData)

            if (data.success) {
                dispatch({ type: "updateUser", payload: data.user, token: data.token });
                window.alert("Your profile has been updated");
                console.log(data);
                
                setFormData({
                    username: data.user.username || "",
                    email: data.user.email || "",
                    password: "",
                    photo_url: data.user.photo_url || ""
                });
                setRepeatPasswd("");

            } else {
                window.alert(data.error || "Something went wrong, please try again.")
            }

        } catch (error) {
            window.alert(error)
        }
    }

    // Borrar cuenta
    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const resultado = await userServices.deleteUser()
            if(resultado.success){
                //delete from store the user and token saved
                dispatch({ type: "logout" });
                window.alert("You account has been deleted")
                navigate("/")
            }else {
                window.alert("Failed to delete account: " + (resultado.error || "Unknown error"));
            }
            
        } catch (error) {
            window.alert(error || "Something went wrong. Please try again.")
        }
    }

    console.log(store.user);
    
    // hasta aqui

    useEffect(() => {
        if (store.user) {
            setFormData({
                username: store.user.username || "",
                email: store.user.email || "",
                password: "",
                photo_url: store.user.photo_url || ""
            });
            SetProfileImage(store.user.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/')         //Para iniciar profile img con la url del usuario!

        }
    }, [store.user])

    return (
        <>
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


                                    <div className="change-picture mx-auto" data-mdb-ripple-color="light">
                                        <img src={profileImage} alt="Your profile pic" className="rounded-circle pic-perfil" />

                                        <div className="mask-change-pic">

                                            <h4><i className="fa-solid fa-camera"></i></h4>
                                            <p className="text-change">Edit</p>

                                        </div>

                                        {/* Nuevo input para subir img desde ordenador */}
                                        <input 
                                            className="change-profile-img"
                                            type="file"
                                            ref={fileInputRef} 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                    </div>

                                    {/* Opc. cambiar img por URL
                                    <div className="mt-4 w-100">
                                        <div className="mb-3">
                                            <label htmlFor="imageUrl" className="form-label">You can also paste the URL:</label>
                                            <input type="text" className="form-control" id="imageUrl" onChange={handleUrlChange} />
                                        </div>
                                    </div> */}

                                    <form className="text-start form-perfil w-75 mx-auto" onSubmit={handleSubmit}>

                                        <div className="mb-3">
                                            <label htmlFor="username" className="form label my-3 fw-bold">Username</label>
                                            <input type="text" 
                                            className="form-control"
                                            name="username" 
                                            id="username" 
                                            onChange={handleChange}
                                            placeholder={formData?.username || ""} />
                                            <p className="change-email text-danger fw-bold" onClick={handleSubmit}>
                                                CHANGE USERNAME
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Email1" className="form-label my-3 fw-bold">Email address</label>
                                            <input type="email" 
                                            className="form-control"
                                            name="email" 
                                            id="Email1" 
                                            onChange={handleChange}
                                            placeholder={store.user?.email || ""} />

                                            <p className="change-email text-danger fw-bold" onClick={handleSubmit}>
                                                CHANGE E-MAIL
                                            </p>
                                            {/* Mensaje de OK o error */}
                                            {store.user?.success && (
                                                <div className="alert alert-info mt-2">
                                                    "Your email has been updated."
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="form-label my-3 fw-bold">Change password</label>
                                            {/* FALTARIA UN METODO EN LA API PARA COMPROBAR SI LA PASSW ANTIGUA COINCIDE CON LA INTRODUCIDA AQUI.... <input type="password" className="form-control" id="current-password" placeholder="*Current password" /> */}
                                            <input type="password" 
                                            name="password" 
                                            onChange={handleChange} 
                                            className="form-control" 
                                            id="password" 
                                            placeholder="*Type new password" />
                                            <input type="password" 
                                            name="repeatPasswd" 
                                            onChange={e => setRepeatPasswd(e.target.value)} 
                                            className="form-control" 
                                            id="repeatPasswd" 
                                            placeholder="*Repeat new password" />
                                        </div>
                                        <div className="actions-profile">

                                            <button type="submit" className="btn btn-secondary">Update</button>
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
                                        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalDeleteAccount">Delete account</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal setting here, to delete account: */}
            <div className="modal fade" id="modalDeleteAccount" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalDeleteAccountLabel" aria-hidden="true">
                <div className="modal-dialog w-75">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalDeleteAccountLabel">Are you sure?</h5>
                            <button type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => { document.activeElement?.blur(); }}></button>
                        </div>
                        <div className="modal-body">
                            <button type="button" className="btn btn-danger p-0" data-bs-dismiss="modal" aria-label="Delete&Close" onClick={handleDeleteAccount}>YES</button>
                            <button type="button" className="btn btn-secondary p-0 ms-3" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                        </div>

                    </div>
                </div>
            </div>

            
             {/* --- NUEVO MODAL PARA CAMBIAR IMAGEN POR URL --- */}
            {showUrlModal && ( // Solo renderiza el modal si showUrlModal es true
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="imageUrlModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="imageUrlModalLabel">Cambiar imagen por URL</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    aria-label="Close" 
                                    onClick={handleCloseUrlModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="modalImageUrl" className="form-label">You can also paste the URL:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modalImageUrl"
                                        placeholder="Ej: https://example.com/my-avatar.jpg"
                                        value={tempImageUrl} // Controla el input con el estado
                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                    />
                                    {/* Pequeña vista previa en el modal (opcional) */}
                                    {tempImageUrl && (
                                        <div className="mt-3 text-center modal-url-profile">
                                            <img src={tempImageUrl} alt="Preview" className="img-thumbnail" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseUrlModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveUrlImage}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUrlModal && <div className="modal-backdrop fade show"></div>} {/* Para el fondo oscuro del modal */}
            {/* --- FIN NUEVO MODAL --- */}
            
        </>
    )
}