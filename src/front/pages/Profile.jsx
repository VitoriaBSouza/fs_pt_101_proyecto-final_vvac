import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
// import { Link } from "react-router-dom"; // Link no se usa, se puede quitar si no hay rutas internas explícitas
import useGlobalReducer from "../hooks/useGlobalReducer";
import { RightMenu } from "../components/RightMenu";
import { useNavigate } from "react-router-dom";
import userServices from "../services/recetea_API/userServices.js";
import { useState, useEffect, useRef } from "react";

export const Profile = () => {
    const navigate = useNavigate();

    const { dispatch, store } = useGlobalReducer();
    const [formData, setFormData] = useState({ // Inicialización segura para evitar nulls
        username: "",
        email: "",
        password: "",
        photo_url: ""
    });
    const [repeatPasswd, setRepeatPasswd] = useState("");

    //Nuevos estados, modal y refers para imagen de perfil
    const [profileImage, SetProfileImage] = useState(store.user?.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/');
    const fileInputRef = useRef(null);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState("");

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

    // Función click input del archivo (para usar con el botón dentro del modal)
    const triggerFileInput = () => {
        fileInputRef.current.click(); // Simula el clic en el input de tipo file oculto
    };

    // Función para guardar la URL escrita en el modal
    const handleSaveUrlImage = async (e) => {
        e.preventDefault(); // Previene la recarga de la página si es llamado por un submit

        if (tempImageUrl) {
            SetProfileImage(tempImageUrl); // Actualiza la vista previa del componente
            
            // Crea una copia de formData con la nueva photo_url
            const updatedFormData = {
                ...formData,
                photo_url: tempImageUrl
            };
            setFormData(updatedFormData); // Actualiza el estado formData en React

            console.log("Frontend: URL image confirmed from modal:", tempImageUrl);
            try {
                console.log("Frontend: Submitting formData with new photo_url (from URL input):", updatedFormData);
                // Llama a la API con el formData actualizado
                const res = await userServices.editUser(updatedFormData);
                console.log("Frontend: API response data (from URL save):", res);

                if (res.success) {
                    // *** CAMBIO PARA OPCIÓN 2 ***
                    // El payload es ahora un objeto que contiene 'user' y 'token'
                    dispatch({ type: "updateUser", payload: { user: res.user, token: res.token } });
                    window.alert("Your profile has been updated with the new image!");

                    // Opcional: Re-sincronizar formData con el user actualizado de la API
                    setFormData({
                        username: res.user.username || "",
                        email: res.user.email || "",
                        password: "",
                        photo_url: res.user.photo_url || ""
                    });

                } else {
                    window.alert(res.error || "Something went wrong while saving the URL, please try again.");
                }
            } catch (error) {
                console.error("Frontend: Error in handleSaveUrlImage!!!:", error);
                window.alert("An error occurred while saving the URL: " + (error.message || error));
            } finally {
                toggleUrlModal(); // Cierra el modal siempre, sin importar el éxito de la API
            }
        }
    };

    // Maneja cambios en los inputs del formulario (username, email, password)
    const handleChange = e => {
        setFormData({
            ...formData,
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Maneja el envío del formulario principal (username, email, password)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Solo valida la contraseña si se está intentando cambiar (el campo password no está vacío)
        if (formData.password && formData.password !== repeatPasswd) {
            window.alert("The password does not match");
            return;
        }
        
        // Crea una copia de formData para evitar enviar campos vacíos si no han sido modificados
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) { // Si la contraseña está vacía, no la envíes
            delete dataToSubmit.password;
        }

        try {
            console.log("Frontend: Submitting main formData:", dataToSubmit);
            const data = await userServices.editUser(dataToSubmit); // Envía solo los campos necesarios
            console.log("Frontend: API response data:", data);

            if (data.success) {
                // *** CAMBIO PARA OPCIÓN 2 ***
                // El payload es ahora un objeto que contiene 'user' y 'token'
                dispatch({ type: "updateUser", payload: { user: data.user, token: data.token } });
                window.alert("Your profile has been updated");
                console.log(data);

                setFormData({
                    username: data.user.username || "",
                    email: data.user.email || "",
                    password: "", // Limpiar el campo de contraseña después de un envío exitoso
                    photo_url: data.user.photo_url || ""
                });
                setRepeatPasswd("");

            } else {
                window.alert(data.error || "Something went wrong, please try again.");
            }

        } catch (error) {
            console.error("Frontend: Error in handleSubmit:", error);
            window.alert("An error occurred: " + (error.message || error));
        }
    };

    // Borrar cuenta
    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const resultado = await userServices.deleteUser()
            if (resultado.success) {
                //delete from store the user and token saved
                dispatch({ type: "logout" });
                window.alert("You account has been deleted")
                navigate("/")
            } else {
                window.alert("Failed to delete account: " + (resultado.error || "Unknown error"));
            }

        } catch (error) {
            console.error("Frontend: Error in handleDeleteAccount:", error);
            window.alert("An error occurred: " + (error.message || error));
        }
    }

    console.log(store.user);

    // hasta aqui

    useEffect(() => {
        if (store.user) {
            setFormData({
                username: store.user.username || "",
                email: store.user.email || "",
                password: "", // Contraseña siempre vacía para seguridad en el frontend
                photo_url: store.user.photo_url || ""
            });
            SetProfileImage(store.user.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/');
        }
    }, [store.user]); // Dependencia: se ejecuta cuando store.user cambia

    return (
        <>
            <div className="main-row-all vh-100">
                <div className="profile-container">
                    <div className="container text-center sidebar-left-profile">
                        <div className="row align-items-start g-0">
                            {/* COLUMNA IZQUIERDA */}
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
                                    {/* Al hacer clic en esta área, se abrirá el modal de cambio de imagen */}
                                    <div className="change-picture mx-auto" data-mdb-ripple-color="light" onClick={toggleUrlModal}>
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

                                    {/* Formulario principal de edición de perfil */}
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
                                <div className="d-grid row-gap-5 b-grids-right h-100">
                                    <RightMenu />
                                    <div className="align-self-end">
                                        {/* Botón para abrir el modal de borrado de cuenta */}
                                        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalDeleteAccount">Delete account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación para eliminar cuenta (sin cambios significativos, usa Bootstrap JS) */}
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


            {/* --- NUEVO MODAL PARA CAMBIAR IMAGEN POR URL --- */}
            {showUrlModal && ( // Solo renderiza el modal si showUrlModal es true
                <div className="modal fade show" id="imageUrlModal" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="imageUrlModalLabel" aria-hidden={!showUrlModal}> {/* `aria-hidden` es dinámico */}
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
                                    <label htmlFor="modalImageUrl" className="form-label">Pega la URL de la imagen:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modalImageUrl"
                                        placeholder="Ej: https://example.com/mi-foto.jpg"
                                        value={tempImageUrl} // Controla el input con el estado temporal
                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                    />
                                    {tempImageUrl && (
                                        <div className="mt-3 text-center modal-url-profile">
                                            {/* Estilos inline para limitar el tamaño de la previsualización */}
                                            <img src={tempImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} className="img-thumbnail" />
                                        </div>
                                    )}
                                </div>
                                <hr /> {/* Separador visual */}
                                <div className="mb-3 text-center">
                                    <label className="form-label">O sube una imagen desde tu ordenador:</label>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-2"
                                        onClick={triggerFileInput} // Activa el input de archivo oculto
                                    >
                                        Subir imagen
                                    </button>
                                    {/* Input de archivo oculto - AHORA DENTRO DEL MODAL */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }} // Input oculto
                                        accept="image/*" // Solo acepta archivos de imagen
                                        onChange={handleFileChange} // Maneja la selección del archivo
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleUrlModal}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveUrlImage}>Guardar URL</button> {/* Este botón guarda la URL y cierra el modal */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUrlModal && <div className="modal-backdrop fade show"></div>} {/* Para el fondo oscuro del modal */}
            {/* --- FIN NUEVO MODAL --- */}

        </>
    );
};