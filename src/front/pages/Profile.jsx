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

    // Estados para imagen de perfil y modal
    const [profileImage, SetProfileImage] = useState(store.user?.photo_url || 'https://pixabay.com/vectors/avatar-icon-placeholder-profile-3814081/');
    const fileInputRef = useRef(null); // Ref para el input de archivo (oculto)
    const [showUrlModal, setShowUrlModal] = useState(false); // Control del toggle del modal de imagen
    const [tempImageUrl, setTempImageUrl] = useState(""); // URL temporal para el input del modal y previsualización

    // Función para manejar la subida de imagen desde el ordenador (dentro del modal)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => { // Marcado como async para la llamada a la API
                const base64Image = reader.result;
                SetProfileImage(base64Image); // Actualiza la vista previa en el componente

                // Crea un objeto con la photo_url actualizada y fusiona con los datos existentes
                const updatedFormData = {
                    ...formData,
                    photo_url: base64Image // photo_url ahora es la cadena Base64
                };
                setFormData(updatedFormData); // Actualiza el estado formData en React

                console.log("Imagen local seleccionada, resultado (Base64 parcial):", base64Image.substring(0, 50) + '...');

                try {
                    console.log("Frontend: Submitting formData with new photo_url (from file):", updatedFormData);
                    // Llama a la API con el formData actualizado
                    const res = await userServices.editUser(updatedFormData);
                    console.log("Frontend: API response data (from file upload):", res);

                    if (res.success) {
                        // *** CAMBIO PARA OPCIÓN 2 ***
                        // El payload es ahora un objeto que contiene 'user' y 'token'
                        dispatch({ type: "updateUser", payload: { user: res.user, token: res.token } });
                        window.alert("Your profile has been updated with the new image!");

                        // Opcional: Re-sincronizar formData con el user actualizado de la API para mantener consistencia
                        setFormData({
                            username: res.user.username || "",
                            email: res.user.email || "",
                            password: "",
                            photo_url: res.user.photo_url || ""
                        });
                    } else {
                        window.alert(res.error || "Something went wrong during file upload, please try again.");
                    }
                } catch (error) {
                    console.error("Frontend: Error uploading file!!!:", error);
                    window.alert("An error occurred during file upload: " + (error.message || error));
                } finally {
                    setShowUrlModal(false); // Cierra el modal siempre, sin importar el éxito de la API
                }
            };
            reader.readAsDataURL(file); // Lee el archivo como Base64
        }
    };

    // Función para alternar el modal (ABRIR/CERRAR)
    const toggleUrlModal = () => {
        if (!showUrlModal) { // Si el modal va a abrirse
            // Precarga la URL actual del perfil en el input temporal del modal
            setTempImageUrl(profileImage.startsWith('http') ? profileImage : '');
        } else { // Si el modal va a cerrarse
            setTempImageUrl(""); // Limpia la URL temporal al cerrar
        }
        setShowUrlModal(!showUrlModal); // Alterna el estado de visibilidad del modal
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

                // Resetear formData y repeatPasswd después de un update exitoso
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
            const resultado = await userServices.deleteUser();
            if (resultado.success) {
                dispatch({ type: "logout" }); // Limpia el usuario y token del store
                window.alert("Your account has been deleted");
                navigate("/"); // Redirige a la página principal
            } else {
                window.alert("Failed to delete account: " + (resultado.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Frontend: Error in handleDeleteAccount:", error);
            window.alert("An error occurred: " + (error.message || error));
        }
    };

    // Efecto para inicializar formData y profileImage cuando store.user esté disponible
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
                                        {/* El input de tipo file ahora estará DENTRO DEL MODAL */}
                                    </div>

                                    {/* Formulario principal de edición de perfil */}
                                    <form className="text-start form-perfil w-75 mx-auto" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label my-3 fw-bold">Username</label>
                                            <input type="text"
                                                className="form-control"
                                                name="username"
                                                id="username"
                                                onChange={handleChange}
                                                placeholder={formData?.username || ""}
                                                value={formData?.username || ""} // Controla el input con el estado
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Email1" className="form-label my-3 fw-bold">Email address</label>
                                            <input type="email"
                                                className="form-control"
                                                name="email"
                                                id="Email1"
                                                onChange={handleChange}
                                                placeholder={store.user?.email || ""}
                                                value={formData?.email || ""} // Controla el input con el estado
                                            />
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
                                                placeholder="*Type new password"
                                                value={formData?.password || ""} // Controla el input con el estado
                                            />
                                            <input type="password"
                                                name="repeatPasswd"
                                                onChange={e => setRepeatPasswd(e.target.value)}
                                                className="form-control"
                                                id="repeatPasswd"
                                                placeholder="*Repeat new password"
                                                value={repeatPasswd || ""} // Controla el input con el estado
                                            />
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
                            {/* Asegúrate que handleDeleteAccount se llame correctamente */}
                            <button type="button" className="btn btn-danger p-0" data-bs-dismiss="modal" aria-label="Delete&Close" onClick={(e) => { document.activeElement?.blur(); handleDeleteAccount(e); }}>YES</button>
                            <button type="button" className="btn btn-secondary p-0 ms-3" data-bs-dismiss="modal" aria-label="Close" onClick={() => { document.activeElement?.blur(); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL PARA CAMBIAR IMAGEN DE PERFIL --- */}
            {showUrlModal && ( // Solo renderiza el modal si showUrlModal es true
                <div className="modal fade show" id="imageUrlModal" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="imageUrlModalLabel" aria-hidden={!showUrlModal}> {/* `aria-hidden` es dinámico */}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="imageUrlModalLabel">Cambiar imagen de perfil</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={toggleUrlModal} // Llama a la función de toggle para cerrar
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
            {/* --- FIN MODAL --- */}
        </>
    );
};