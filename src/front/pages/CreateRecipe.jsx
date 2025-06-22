import React, { useState, useEffect, useRef } from "react";
import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import useGlobalReducer from "../hooks/useGlobalReducer";
import recipeServices from "../services/recetea_API/recipeServices";
import { useParams, useNavigate } from "react-router-dom";

export const CreateRecipe = () => {
    const { store } = useGlobalReducer();
    const { id } = useParams();
    const navigate = useNavigate();

    const initialRecipeState = {
        title: "",
        id: store.user?.id || null,
        username: store.user?.username || "",
        description: "",
        image_url: "",
        servings: 1, // Maps to 'portions' in backend JSON
        allergens: [], // New field
        difficulty_type: "", // New field, maps to 'difficulty_type' in backend JSON
        prep_time: "",
        ingredient: [{ id: 1, text: "" }],
        steps: [{ id: 1, text: "", time: "" }],
        status: "draft"
    };

        // Función de utilidad para convertir string de tiempo (ej. "1h 30m") a minutos
    const parseTime = (timeString) => {
        if (!timeString) return 0;

        let totalMinutes = 0;
        const hoursMatch = timeString.match(/(\d+)\s*h/i); // Busca Xh o X h
        const minutesMatch = timeString.match(/(\d+)\s*min/i); // Busca Xmin o X min
        const minutesOnlyMatch = timeString.match(/^(\d+)\s*m$/i); // Busca solo Xm

        if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1]) * 60;
        }
        if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1]);
        } else if (minutesOnlyMatch && !hoursMatch) { // Si no hay horas, y solo hay "Xm"
            totalMinutes += parseInt(minutesOnlyMatch[1]);
        }
        return totalMinutes;
    };

    // Función de utilidad para convertir minutos totales de vuelta a un formato legible (opcional)
    const formatMinutesToHumanReadable = (totalMinutes) => {
        if (totalMinutes === 0) return "";
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        let result = "";
        if (hours > 0) {
            result += `${hours}h `;
        }
        if (minutes > 0) {
            result += `${minutes}min`;
        }
        return result.trim();
    };

    const difficultyOptions = ["Easy", "Medium", "Hard"]; // Options for difficulty dropdown

    const [recipeData, setRecipeData] = useState(initialRecipeState);
    const [mainRecipeImage, setMainRecipeImage] = useState('https://via.placeholder.com/200x200?text=Attach+dish+photo');
    const fileInputRef = useRef(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState("");
    const [currentAllergenInput, setCurrentAllergenInput] = useState(""); // State for new allergen input

    useEffect(() => {
        const fetchRecipe = async () => {
            if (id) {
                try {
                    const response = await recipeServices.getOneRecipe(id);
                    if (response.success && response.recipe) {
                        const fetchedRecipe = response.recipe;
                        setRecipeData({
                            title: fetchedRecipe.title || "",
                            id: fetchedRecipe.id || null,
                            username: fetchedRecipe.username || "",
                            description: fetchedRecipe.description || "",
                            image_url: fetchedRecipe.image_url || "",
                            servings: fetchedRecipe.portions || 1, // Map 'portions' from backend to 'servings'
                            allergens: fetchedRecipe.allergens || [], // Load allergens
                            difficulty_type: fetchedRecipe.difficulty_type || "", // Load difficulty
                            prep_time: fetchedRecipe.prep_time || "",
                            ingredient: fetchedRecipe.ingredient.map(ing => ({ id: ing.id, text: ing.text || ing.name })),
                            steps: fetchedRecipe.steps.map(step => ({ id: step.id, text: step.text || step.description, time: step.time || "" })),
                            status: fetchedRecipe.status || "draft"
                        });
                        setMainRecipeImage(fetchedRecipe.image_url || 'https://via.placeholder.com/200x200?text=Attach+dish+photo');
                    } else {
                        console.error("Error fetching recipe:", response.error || "Recipe not found.");
                        window.alert("Could not load recipe for editing.");
                        navigate('/create-recipe');
                    }
                } catch (error) {
                    console.error("Error fetching recipe by ID:", error);
                    window.alert("An error occurred while loading the recipe.");
                    navigate('/create-recipe');
                }
            } else {
                setRecipeData(initialRecipeState);
                setMainRecipeImage('https://via.placeholder.com/200x200?text=Attach+dish+photo');
            }
        };

        fetchRecipe();
    }, [id, store.user, navigate]);

        useEffect(() => {
        const totalStepsMinutes = recipeData.steps.reduce((sum, step) => {
            return sum + parseTime(step.time);
        }, 0);

        // Formatear el total de minutos a un string legible
        const formattedTotalTime = formatMinutesToHumanReadable(totalStepsMinutes);

        // Actualizar el estado de prep_time si ha cambiado
        if (formattedTotalTime !== recipeData.prep_time) {
            setRecipeData(prevData => ({
                ...prevData,
                prep_time: formattedTotalTime
            }));
        }
    }, [recipeData.steps]);

    const handleChange = (e) => {
        setRecipeData({
            ...recipeData,
            [e.target.name]: e.target.value
        });
    };

    const handleAllergenInputChange = (e) => {
        setCurrentAllergenInput(e.target.value);
    };

    const addAllergen = (e) => {
        if (e.key === 'Enter' && currentAllergenInput.trim() !== "") {
            e.preventDefault(); // Prevent form submission
            const newAllergen = currentAllergenInput.trim().toLowerCase();
            if (!recipeData.allergens.includes(newAllergen)) {
                setRecipeData(prevData => ({
                    ...prevData,
                    allergens: [...prevData.allergens, newAllergen]
                }));
            }
            setCurrentAllergenInput("");
        }
    };

    const removeAllergen = (allergenToRemove) => {
        setRecipeData(prevData => ({
            ...prevData,
            allergens: prevData.allergens.filter(allergen => allergen !== allergenToRemove)
        }));
    };

    const toggleImageModal = () => {
        if (!showImageModal) {
            setTempImageUrl(mainRecipeImage.startsWith('http') ? mainRecipeImage : '');
        } else {
            setTempImageUrl("");
        }
        setShowImageModal(!showImageModal);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setMainRecipeImage(base64Image);
                setRecipeData(prevData => ({ ...prevData, image_url: base64Image }));
                setShowImageModal(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveUrlImage = (e) => {
        e.preventDefault();
        if (tempImageUrl) {
            setMainRecipeImage(tempImageUrl);
            setRecipeData(prevData => ({ ...prevData, image_url: tempImageUrl }));
            setShowImageModal(false);
        }
    };

    const handleIngredientChange = (ingId, value) => {
        setRecipeData(prevData => ({
            ...prevData,
            ingredient: prevData.ingredient.map(ing =>
                ing.id === ingId ? { ...ing, text: value } : ing
            )
        }));
    };

    const addIngredient = () => {
        const newId = recipeData.ingredient.length > 0
            ? Math.max(...recipeData.ingredient.map(ing => ing.id)) + 1
            : 1;
        setRecipeData(prevData => ({
            ...prevData,
            ingredient: [...prevData.ingredient, { id: newId, text: "" }]
        }));
    };

    const removeIngredient = (ingId) => {
        setRecipeData(prevData => ({
            ...prevData,
            ingredient: prevData.ingredient.filter(ing => ing.id !== ingId)
        }));
    };

    const handleStepChange = (stepId, field, value) => {
        setRecipeData(prevData => ({
            ...prevData,
            steps: prevData.steps.map(step =>
                step.id === stepId ? { ...step, [field]: value } : step
            )
        }));
    };

    const addStep = () => {
        const newId = recipeData.steps.length > 0
            ? Math.max(...recipeData.steps.map(step => step.id)) + 1
            : 1;
        setRecipeData(prevData => ({
            ...prevData,
            steps: [...prevData.steps, { id: newId, text: "", time: "" }]
        }));
    };

    const removeStep = (stepId) => {
        setRecipeData(prevData => ({
            ...prevData,
            steps: prevData.steps.filter(step => step.id !== stepId)
        }));
    };

    const handleSubmit = async (e, submitStatus) => {
        e.preventDefault();

        const cleanedIngredients = recipeData.ingredient.filter(ing => ing.text.trim() !== "");
        const cleanedSteps = recipeData.steps.filter(step => step.text.trim() !== "");

        const dataToSend = {
            ...recipeData,
            portions: recipeData.servings || 1,
            ingredient: cleanedIngredients,
            steps: cleanedSteps,
            status: submitStatus
        };

        // Remove the 'servings' key before sending to backend, as it's now 'portions'
        delete dataToSend.servings;

        try {
            let response;
            if (id) {
                console.log("Frontend createRecipe: Sending UPDATE recipe data to backend:", dataToSend);
                response = await recipeServices.editRecipe(id, dataToSend);
            } else {
                console.log("Frontend createRecipe: Sending CREATE recipe data to backend:", dataToSend);
                response = await recipeServices.createRecipe(dataToSend);
            }

            console.log("Frontend: Backend response:", response);

            if (response.success) {
                window.alert(`createRecipe- Recipe ${submitStatus === 'published' ? 'published' : 'saved as draft'} successfully!`);
                navigate(`/recipes/${response.recipe_id || id}`);
            } else {
                window.alert(`createRecipe-Error ${submitStatus === 'published' ? 'publishing' : 'saving'} recipe: ` + (response.error || "Unknown error."));
            }
        } catch (error) {
            console.error("Frontend createRecipe: Error submitting recipe:", error);
            window.alert("An error occurred while trying to save the recipe.");
        }
    };

    const handleDiscard = () => {
        if (window.confirm("Are you sure you want to discard all changes?")) {
            if (id) {
                window.location.reload();
            } else {
                setRecipeData(initialRecipeState);
                setMainRecipeImage('https://via.placeholder.com/200x200?text=Attach+dish+photo');
                setTempImageUrl("");
                setShowImageModal(false);
                setCurrentAllergenInput("");
            }
            // window.alert("Changes discarded.");
        }
    };

    return (
        <div className="rct-create-recipe-wrapper">
            <div className="rct-create-recipe-container container-fluid">
                <div className="row g-0">
                    {/* LEFT COLUMN (Menu) */}
                    <div className="col-12 col-md-3 rct-left-sidebar">
                        <div className="d-flex align-items-start rct-sidebar-content">
                            <TurnHome />
                            <LinksMenu />
                        </div>
                    </div>

                    {/* MAIN COLUMN */}
                    <div className="col-12 col-md-9 rct-main-content">
                        <div className="rct-recipe-form-area d-flex flex-column mb-3">

                            {/* Top Section: Image and Buttons */}
                            <div className="rct-top-section row g-0 mb-4">
                                {/* Dish Image Area - TOP LEFT */}
                                {/* Added flex-grow-1 for image container to push buttons right on smaller screens within the col-md-6 */}
                                <div className="rct-recipe-image-upload col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start" onClick={toggleImageModal}>
                                    <img src={mainRecipeImage} alt="Finished dish" className="rct-recipe-main-image" />
                                    <div className="rct-image-upload-mask">
                                        <h4><i className="fa-solid fa-camera"></i></h4>
                                        <p className="rct-upload-text">Attach photo of your dish</p>
                                        <p className="rct-upload-hint">Show what your finished dish looks like</p>
                                    </div>
                                </div>

                                {/* Action Buttons - TOP RIGHT */}
                                {/* Using ms-auto (margin-left: auto) to push buttons to the far right within its column */}
                                <div className="rct-action-buttons col-12 col-md-6 d-flex justify-content-end align-items-start ms-auto mt-3 mt-md-0">
                                    <button className="btn btn-outline-danger rct-btn-discard me-2" onClick={handleDiscard}>Delete</button>
                                    <button className="btn btn-primary rct-btn-publish" onClick={(e) => handleSubmit(e, 'published')}>Publish</button>
                                </div>
                            </div>

                            {/* Title and Author */}
                            <div className="rct-recipe-header-section w-100 mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2 rct-title-input"
                                    name="title"
                                    placeholder="Title: My favorite pumpkin cream"
                                    value={recipeData.title}
                                    onChange={handleChange}
                                />
                                <div className="d-flex align-items-center rct-author-info">
                                    <img src={store.user?.photo_url || 'https://via.placeholder.com/30'} alt="Avatar" className="rct-author-avatar-small rounded-circle me-2" />
                                    <span className="fw-bold rct-author-username">{recipeData.username || "Unknown User"}</span>
                                </div>
                                <textarea
                                    className="form-control mt-3 rct-description-textarea"
                                    name="description"
                                    rows="3"
                                    placeholder="Share a little more about this dish. What or who inspired you to cook? What makes it special for you? What's your favorite way to cook?"
                                    value={recipeData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Servings, Allergens, Difficulty */}
                            <div className="rct-details-section w-100 mb-4 row g-3">
                                {/* Servings Input */}
                                <div className="col-12 col-md-4">
                                    <label htmlFor="servingsInput" className="form-label rct-form-label">Servings</label>
                                    <input
                                        type="number"
                                        className="form-control rct-servings-input"
                                        id="servingsInput"
                                        name="servings"
                                        value={recipeData.servings}
                                        onChange={handleChange}
                                        placeholder="Ex: 4"
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Difficulty Level Dropdown */}
                                <div className="col-12 col-md-4">
                                    <label htmlFor="difficultySelect" className="form-label rct-form-label">Difficulty Level</label>
                                    <select
                                        className="form-select rct-difficulty-select"
                                        id="difficultySelect"
                                        name="difficulty_type"
                                        value={recipeData.difficulty_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Difficulty</option>
                                        {difficultyOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Allergens Input */}
                                <div className="col-12 col-md-4">
                                    <label htmlFor="allergenInput" className="form-label rct-form-label">Allergens</label>
                                    <input
                                        type="text"
                                        className="form-control rct-allergen-input"
                                        id="allergenInput"
                                        placeholder="Type allergen and press Enter (Ex: Gluten)"
                                        value={currentAllergenInput}
                                        onChange={handleAllergenInputChange}
                                        onKeyPress={addAllergen}
                                    />
                                    <div className="rct-allergen-tags-container mt-2">
                                        {recipeData.allergens.map((allergen, index) => (
                                            <span key={index} className="badge bg-secondary rct-allergen-tag me-2 mb-2">
                                                {allergen}
                                                <button type="button" className="btn-close btn-close-white ms-1" aria-label="Remove" onClick={() => removeAllergen(allergen)}></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {/* Ingredients */}
                            <div className="rct-ingredient-section w-100 mb-4">
                                <h3 className="mb-3 rct-section-title">Ingredients</h3>
                                {recipeData.ingredient.map((ingredient) => (
                                    <div key={ingredient.id} className="input-group mb-2 rct-ingredient-item">
                                        <input
                                            type="text"
                                            className="form-control rct-ingredient-input"
                                            placeholder={`Ex: 250g flour`}
                                            value={ingredient.text}
                                            onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                                        />
                                        {recipeData.ingredient.length > 1 && (
                                            <button className="btn btn-outline-danger rct-remove-item-btn" type="button" onClick={() => removeIngredient(ingredient.id)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-outline-success mt-2 rct-add-ingredient-btn" onClick={addIngredient}>
                                    <i className="fa-solid fa-plus"></i> Add Ingredient
                                </button>
                            </div>

                            {/* Steps */}
                            <div className="rct-steps-section w-100 mb-4">
                                <h3 className="mb-3 rct-section-title">Steps</h3>
                                {recipeData.steps.map((step, index) => (
                                    <div key={step.id} className="mb-3 p-3 border rounded rct-step-item">
                                        <div className="d-flex justify-content-between align-items-center mb-2 rct-step-header">
                                            <span className="fw-bold rct-step-number">Step {index + 1}</span>
                                            {recipeData.steps.length > 1 && (
                                                <button className="btn btn-sm btn-outline-danger rct-remove-step-btn" type="button" onClick={() => removeStep(step.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <div className="d-flex mb-2 rct-step-time-input-group">
                                            <span className="me-2 rct-step-time-label">Time</span>
                                            <input
                                                type="text"
                                                className="form-control rct-step-time-input w-50"
                                                placeholder="Ex: 1h 30 min"
                                                value={step.time}
                                                onChange={(e) => handleStepChange(step.id, 'time', e.target.value)}
                                            />
                                        </div>
                                        <textarea
                                            className="form-control mt-2 rct-step-description-textarea"
                                            rows="3"
                                            placeholder="Ex: Mix the eggs with milk until..."
                                            value={step.text}
                                            onChange={(e) => handleStepChange(step.id, 'text', e.target.value)}
                                        ></textarea>
                                    </div>
                                ))}
                                <button className="btn btn-outline-success mt-2 rct-add-step-btn" onClick={addStep}>
                                    <i className="fa-solid fa-plus"></i> Add Step
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FOR CHANGING MAIN RECIPE IMAGE --- */}
            {showImageModal && (
                <div className="modal fade show rct-image-modal" id="recipeImageModal" tabIndex="-1" role="dialog" aria-labelledby="recipeImageModalLabel" aria-hidden={!showImageModal}>
                    <div className="modal-dialog rct-modal-dialog">
                        <div className="modal-content rct-modal-content">
                            <div className="modal-header rct-modal-header">
                                <h5 className="modal-title rct-modal-title" id="recipeImageModalLabel">Attach dish photo</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={toggleImageModal}></button>
                            </div>
                            <div className="modal-body rct-modal-body">
                                <div className="mb-3">
                                    <label htmlFor="modalImageUrl" className="form-label rct-modal-label">Paste image URL:</label>
                                    <input
                                        type="text"
                                        className="form-control rct-modal-url-input"
                                        id="modalImageUrl"
                                        placeholder="Ex: https://example.com/my-dish.jpg"
                                        value={tempImageUrl}
                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                    />
                                    {tempImageUrl && (
                                        <div className="mt-3 text-center rct-modal-image-preview">
                                            <img src={tempImageUrl} alt="Preview" className="img-thumbnail rct-modal-preview-thumbnail" />
                                        </div>
                                    )}
                                </div>
                                <hr />
                                <div className="mb-3 text-center">
                                    <label className="form-label rct-modal-label">Or upload an image from your computer:</label>
                                    <button type="button" className="btn btn-primary mt-2 rct-modal-upload-btn" onClick={triggerFileInput}>
                                        Upload image
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="rct-hidden-file-input"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer rct-modal-footer">
                                <button type="button" className="btn btn-secondary rct-modal-cancel-btn" onClick={toggleImageModal}>Cancel</button>
                                <button type="button" className="btn btn-primary rct-modal-save-url-btn" onClick={handleSaveUrlImage}>Save URL</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showImageModal && <div className="modal-backdrop fade show"></div>}
            {/* --- END MODAL --- */}
        </div>
    );
};