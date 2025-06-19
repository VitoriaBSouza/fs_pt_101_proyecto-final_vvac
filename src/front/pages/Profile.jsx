import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { RightMenu } from "../components/RightMenu";
import { useNavigate } from "react-router-dom";
import userServices from "../services/recetea_API/userServices.js";
import { useState, useEffect, useRef } from "react";

export const Profile = () => {
    const navigate = useNavigate();

    const { dispatch, store } = useGlobalReducer();
    const [formData, setFormData] = useState({ // Inicialización segura
        username: "",
        email: "",
        password: "",
        photo_url: ""
    });
    const [repeatPasswd, setRepeatPasswd] = useState("");

    // Estados para imagen de perfil y modal
    const [profileImage, SetProfileImage] = useState(store.user?.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/');
    const fileInputRef = useRef(null); // Ref para el input de archivo
    const [showUrlModal, setShowUrlModal] = useState(false); // Control del toggle del modal
    const [tempImageUrl, setTempImageUrl] = useState(""); // URL temporal para el input del modal

    // Función para manejar la subida de imagen desde el ordenador (dentro del modal)
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
                console.log("Imagen local seleccionada, resultado:", reader.result.substring(0, 50) + '...');
                setShowUrlModal(false); // Cierra el modal después de seleccionar el archivo
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para alternar el modal (ABRIR/CERRAR)
    const toggleUrlModal = () => {
        if (!showUrlModal) { // Si va a abrir el modal
            setTempImageUrl(profileImage.startsWith('http') ? profileImage : ''); // Precarga URL si existe
        } else { // Si va a cerrar el modal
            setTempImageUrl(""); // Limpiar URL temporal
        }
        setShowUrlModal(!showUrlModal); // Toggle el estado
    };

    // Función click input del archivo (para usar con el botón dentro del modal)
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Función para guardar la URL desde el modal
    const handleSaveUrlImage = () => {
        if (tempImageUrl) {
            SetProfileImage(tempImageUrl);
            setFormData(prevFormData => ({
                ...prevFormData,
                photo_url: tempImageUrl
            }));
            console.log("Frontend: URL image confirmed from modal:", tempImageUrl);
        }
        toggleUrlModal(); // Cierra el modal con el toggle
    };

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== repeatPasswd) { // Solo si se intenta cambiar la contraseña
            window.alert("The password does not match");
            return;
        }

        try {
            console.log("Frontend: Submitting formData:", formData); // Log de lo que se envía
            const data = await userServices.editUser(formData);
            console.log("Frontend: API response data:", data); // Log de la respuesta de la API

            if (data.success) {
                dispatch({ type: "updateUser", payload: data.user, token: data.token });
                window.alert("Your profile has been updated");
                
                // Resetear formData y repeatPasswd después de un update exitoso
                setFormData({
                    username: data.user.username || "",
                    email: data.user.email || "",
                    password: "", // Limpiar contraseña después de enviar
                    photo_url: data.user.photo_url || "" // Usar la URL actualizada del backend
                });
                setRepeatPasswd("");

            } else {
                window.alert(data.error || "Something went wrong, please try again.");
            }

        } catch (error) {
            console.error("Frontend: Error in handleSubmit:", error); // Log de errores de red/catch
            window.alert("An error occurred: " + (error.message || error));
        }
    };

    // Borrar cuenta
    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const resultado = await userServices.deleteUser();
            if (resultado.success) {
                dispatch({ type: "logout" });
                window.alert("Your account has been deleted");
                navigate("/");
            } else {
                window.alert("Failed to delete account: " + (resultado.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Frontend: Error in handleDeleteAccount:", error);
            window.alert("An error occurred: " + (error.message || error));
        }
    };

    useEffect(() => {
        if (store.user) {
            setFormData({
                username: store.user.username || "",
                email: store.user.email || "",
                password: "",
                photo_url: store.user.photo_url || ""
            });
            SetProfileImage(store.user.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/');
        }
    }, [store.user]);

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

                            {/* COLUMNA PRINCIPAL */}
                            <div className="col-6 main-column-content">
                                <div className="d-flex align-items-start flex-column mb-3 edit-perfil">

                                    {/* ÁREA DE IMAGEN DE PERFIL Y BOTÓN PARA ABRIR MODAL */}
                                    <div className="change-picture mx-auto" data-mdb-ripple-color="light" onClick={toggleUrlModal}> {/* <-- AHORA HACE EL TOGGLE DEL MODAL */}
                                        <img src={profileImage} alt="Your profile pic" className="rounded-circle pic-perfil" />
                                        <div className="mask-change-pic">
                                            <h4><i className="fa-solid fa-camera"></i></h4>
                                            <p className="text-change">Edit</p>
                                        </div>
                                        {/* El input de tipo file ahora estará DENTRO DEL MODAL */}
                                    </div>

                                    {/* ELIMINADO: Ya no necesitamos este botón aquí, el clic en la imagen abre el modal */}
                                    {/* <div className="mt-3 text-center w-100">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={handleOpenUrlModal}
                                        >
                                            O pegar URL de imagen
                                        </button>
                                    </div> */}

                                    <form className="text-start form-perfil w-75 mx-auto" onSubmit={handleSubmit}>
                                        {/* ... (resto del formulario) ... */}
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
                                            {store.user?.success && (
                                                <div className="alert alert-info mt-2">
                                                    "Your email has been updated."
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="form-label my-3 fw-bold">Change password</label>
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
                                <div className="d-grid row-gap-5 b-grids-right h-100">
                                    <RightMenu />
                                    <div className="align-self-end">
                                        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalDeleteAccount">Delete account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación para eliminar cuenta (sin cambios) */}
            <div className="modal fade" id="modalDeleteAccount" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalDeleteAccountLabel">
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
                            <button type="button" className="btn btn-danger p-0" data-bs-dismiss="modal" aria-label="Delete&Close" onClick={() => { document.activeElement?.blur() }, handleDeleteAccount}>YES</button>
                            <button type="button" className="btn btn-secondary p-0 ms-3" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.activeElement?.blur() }}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL PARA CAMBIAR IMAGEN (AHORA CON OPCIÓN DE SUBIR ARCHIVO DENTRO) --- */}
            {showUrlModal && (
                <div className="modal fade show" id="imageUrlModal" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="imageUrlModalLabel" aria-hidden={!showUrlModal}> {/* <-- Solución para aria-hidden */}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="imageUrlModalLabel">Cambiar imagen de perfil</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={toggleUrlModal} // <-- Llama al toggle
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="modalImageUrl" className="form-label">Pega la URL de la imagen:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modalImageUrl"
                                        placeholder="Ej: https://example.com/mi-foto.jpg"
                                        value={tempImageUrl}
                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                    />
                                    {tempImageUrl && (
                                        <div className="mt-3 text-center modal-url-profile">
                                            <img src={tempImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} className="img-thumbnail" />
                                        </div>
                                    )}
                                </div>
                                <hr /> {/* Separador */}
                                <div className="mb-3 text-center">
                                    <label className="form-label">O sube una imagen desde tu ordenador:</label>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary mt-2" 
                                        onClick={triggerFileInput} // <-- Botón para activar el input de archivo
                                    >
                                        Subir imagen
                                    </button>
                                    {/* Input de archivo oculto - AHORA DENTRO DEL MODAL */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }} // <-- Oculto
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleUrlModal}>Cancelar</button> {/* <-- Llama al toggle */}
                                <button type="button" className="btn btn-primary" onClick={handleSaveUrlImage}>Guardar URL</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUrlModal && <div className="modal-backdrop fade show"></div>}
            {/* --- FIN MODAL --- */}
        </>
    );
};