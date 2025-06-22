import React, { useState, useEffect, useRef } from "react";
import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import useGlobalReducer from "../hooks/useGlobalReducer";
import recipeServices from "../services/recetea_API/recipeServices";
import { useParams, useNavigate } from "react-router-dom";

export const CreateRecipe = () => {
    const difficultyOptions = ["Easy", "Moderate", "Hard"];
    const { store, dispatch } = useGlobalReducer();
    const { id } = useParams();
    const navigate = useNavigate();

    const initialRecipeState = {
        title: "",
        username: "",
        description: "",
        servings: 1,
        difficulty_type: "",
        prep_time: 0,
        allergens: [],
        ingredient: [{ id: 1, name: "", quantity: "", unit: "" }],
        steps: [{ id: 1, text: "" }],
        status: "draft",
        image_url: ""
    };

    const [recipeData, setRecipeData] = useState(initialRecipeState);
    const [mainRecipeImage, setMainRecipeImage] = useState("https://picsum.photos/200/300");
    const fileInputRef = useRef(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState("");

    useEffect(() => {
        // if recipe already in store, use it
        if (id && store.recipe && store.recipe.title != "") {
            const f = store.recipe;
            let parsedStepsFromStore = [];
            try {
                // Confirmamos que f.steps es un string que contiene un array de strings JSON.
                if (typeof f.steps === 'string') {
                    // JSON.parse() convierte "[\"Paso 1\", \"Paso 2\"]" a ["Paso 1", "Paso 2"]
                    const tempSteps = JSON.parse(f.steps);
                    // Si el parseo resulta en un array de strings, mapeamos para crear objetos { id, text }
                    if (Array.isArray(tempSteps)) {
                        parsedStepsFromStore = tempSteps.map((text, index) => ({ id: index + 1, text: text }));
                    }
                } else if (Array.isArray(f.steps)) {
                    // Si por alguna razón ya es un array de objetos (ej. [{text: "Paso 1"}]), lo mapeamos
                    parsedStepsFromStore = f.steps.map((s, index) => ({ id: s.id || (index + 1), text: s.text || s.description || '' }));
                }
            } catch (e) {
                console.error("Error al parsear los pasos desde store.recipe:", e);
                parsedStepsFromStore = []; // En caso de error, un array vacío para evitar que se rompa
            }
            setRecipeData({
                title: f.title || "",
                username: f.username || "",
                description: f.description || "",
                servings: f.portions || 1,
                difficulty_type: f.difficulty_type || "",
                prep_time: f.prep_time || 0,
                allergens: f.allergens || [],
                ingredient: f.ingredient?.map(ing => ({
                    id: ing.id,
                    name: ing.name || "",
                    quantity: ing.quantity?.toString() || "",
                    unit: ing.unit || ""
                })) || [],
                steps: parsedStepsFromStore || [],
                status: f.status || "draft",
                image_url: f.media?.[0]?.url || initialRecipeState.image_url
            });
            setMainRecipeImage(f.media?.[0]?.url || initialRecipeState.image_url);
            return;
        }

        // otherwise fetch from API
        if (!id) return;

        (async () => {
            try {
                const res = await recipeServices.getOneRecipe(id);
                if (res) {
                    const f = res;
                    // dispatch to store
                    dispatch({ type: 'get_one_recipe', payload: f });
                    // autofill form
                    let parsedStepsFromAPI = [];
                    try {
                        // Confirmamos que f.steps es un string que contiene un array de strings JSON.
                        if (typeof f.steps === 'string') {
                            // JSON.parse() convierte "[\"Paso 1\", \"Paso 2\"]" a ["Paso 1", "Paso 2"]
                            const tempSteps = JSON.parse(f.steps);
                            // Si el parseo resulta en un array de strings, mapeamos para crear objetos { id, text }
                            if (Array.isArray(tempSteps)) {
                                parsedStepsFromAPI = tempSteps.map((text, index) => ({ id: index + 1, text: text }));
                            }
                        } else if (Array.isArray(f.steps)) {
                            // Si por alguna razón ya es un array de objetos, lo mapeamos
                            parsedStepsFromAPI = f.steps.map((s, index) => ({ id: s.id || (index + 1), text: s.text || s.description || '' }));
                        }
                    } catch (e) {
                        console.error("Error al parsear los pasos desde la API:", e);
                        parsedStepsFromAPI = []; // En caso de error, un array vacío
                    }

                    setRecipeData({
                        title: f.title || "",
                        username: f.username || "",
                        description: f.description || "",
                        servings: f.portions || 1,
                        difficulty_type: f.difficulty_type || "",
                        prep_time: f.prep_time || 0,
                        allergens: f.allergens || [],
                        ingredient: f.ingredient?.map(ing => ({
                            id: ing.id,
                            name: ing.name || "",
                            quantity: ing.quantity?.toString() || "",
                            unit: ing.unit || ""
                        })) || [],
                        steps: parsedStepsFromAPI || [],
                        status: f.status || "draft",
                        image_url: f.media?.[0]?.url || initialRecipeState.image_url
                    });
                    setMainRecipeImage(f.media?.[0]?.url || initialRecipeState.image_url);
                }
            } catch (err) {
                console.error('Error loading recipe:', err);
                // navigate('/recipes/new');
            }
        })();
    }, [id, store.recipe, dispatch, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: (name === 'servings' || name === 'prep_time')
                ? parseInt(value, 10) || 0
                : value
        }));
    };


    const toggleImageModal = () => {
        setTempImageUrl(showImageModal ? "" : mainRecipeImage.startsWith('http') ? mainRecipeImage : "");
        setShowImageModal(!showImageModal);
    };
    const triggerFileInput = () => fileInputRef.current.click();
    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainRecipeImage(reader.result);
                setRecipeData(prev => ({ ...prev, image_url: reader.result }));
                setShowImageModal(false);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSaveUrlImage = e => {
        e.preventDefault();
        if (tempImageUrl) {
            setMainRecipeImage(tempImageUrl);
            setRecipeData(prev => ({ ...prev, image_url: tempImageUrl }));
            setShowImageModal(false);
        }
    };

    const handleIngredientChange = (ingId, field, value) => {
        setRecipeData(prev => ({
            ...prev,
            ingredient: prev.ingredient.map(ing => ing.id === ingId ? { ...ing, [field]: value } : ing)
        }));
    };
    const addIngredient = () => {
        const newId = Math.max(...recipeData.ingredient.map(i => i.id)) + 1;
        setRecipeData(prev => ({ ...prev, ingredient: [...prev.ingredient, { id: newId, name: "", quantity: "", unit: "" }] }));
    };
    const removeIngredient = idToRemove => setRecipeData(prev => ({ ...prev, ingredient: prev.ingredient.filter(i => i.id !== idToRemove) }));

    const handleStepChange = (stepId, value) => {
        setRecipeData(prev => ({
            ...prev,
            steps: prev.steps.map(step => step.id === stepId ? { ...step, text: value } : step)
        }));
    };
    const addStep = () => {
        const newId = Math.max(...recipeData.steps.map(s => s.id)) + 1;
        setRecipeData(prev => ({ ...prev, steps: [...prev.steps, { id: newId, text: "" }] }));
    };
    const removeStep = stepId => setRecipeData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== stepId) }));

    const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/200/300';

    const handleSubmit = async (e, submitStatus) => {
        e.preventDefault();
        const cleanedIngredients = recipeData.ingredient
            .filter(i => i.name.trim())
            .map(i => ({ name: i.name.trim(), quantity: parseFloat(i.quantity) || 0, unit: i.unit.trim() }));
        const cleanedSteps = recipeData.steps
            .filter(s => s.text.trim())
            .map(s => s.text.trim());
        const media_to_send = recipeData.image_url && recipeData.image_url !== PLACEHOLDER_IMAGE_URL
            ? [{ url: recipeData.image_url, type_media: "image" }]
            : [];

        const dataToSend = {
            ...recipeData,
            title: recipeData.title,
            description: recipeData.description,
            difficulty_type: recipeData.difficulty_type,
            prep_time: parseInt(recipeData.prep_time, 10),
            portions: parseInt(recipeData.servings, 10),
            ingredient: cleanedIngredients,
            steps: JSON.stringify(cleanedSteps),
            status: submitStatus,
            media: media_to_send

        };
        delete dataToSend.servings;
        delete dataToSend.username;
        delete dataToSend.id;
        delete dataToSend.image_url;

        dispatch({ type: 'get_one_recipe', payload: dataToSend });

        try {
            const response = id
                ? await recipeServices.editRecipe(id, dataToSend)
                : await recipeServices.createRecipe(dataToSend);
            if (response.success) {
                window.alert(`Recipe ${submitStatus === 'published' ? 'published' : 'saved'} successfully!`);
                navigate(`/recipes/${response.recipe_id || id}`);
            } else {
                window.alert(`Error saving recipe: ${response.error}`);
            }
        } catch (error) {
            console.error(error);
            window.alert("Error connecting to server.");
        }
    };

    const handleDiscard = () => {
        if (window.confirm("Discard all changes?")) {
            id ? window.location.reload() : setRecipeData(initialRecipeState);
        }
    };

    return (
        <div className="rct-create-recipe-wrapper">
            <div className="rct-create-recipe-container container-fluid">
                <div className="row g-0">
                    <div className="col-12 col-md-3 rct-left-sidebar">

                        <div className="d-flex align-items-start rct-sidebar-content">
                            <TurnHome />
                            <LinksMenu />
                        </div>
                    </div>
                    <div className="col-12 col-md-9 rct-main-content">
                        <div className="rct-recipe-form-area d-flex flex-column mb-3">
                            <div className="rct-top-section row g-0 mb-4">
                                <div className="rct-recipe-image-upload col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start" onClick={toggleImageModal}>
                                    <img src={mainRecipeImage} alt="Finished dish" className="rct-recipe-main-image" />
                                    <div className="rct-image-upload-mask">
                                        <h4><i className="fa-solid fa-camera"></i></h4>
                                        <p className="rct-upload-text">Attach photo of your dish</p>
                                        <p className="rct-upload-hint">Show what your finished dish looks like</p>
                                    </div>
                                </div>
                                <div className="rct-action-buttons col-12 col-md-6 d-flex justify-content-end align-items-start ms-auto mt-3 mt-md-0">
                                    <button className="btn btn-outline-danger rct-btn-discard me-2" onClick={handleDiscard}>Delete</button>
                                    <button className="btn btn-primary rct-btn-publish" onClick={(e) => handleSubmit(e, 'published')}>Publish</button>
                                </div>
                            </div>
                            <div className="rct-recipe-header-section w-100 mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2 rct-title-input"
                                    name="title"
                                    required
                                    placeholder="Title: My favorite pumpkin cream"
                                    value={recipeData.title}
                                    onChange={handleChange}
                                />
                                <div className="d   flex align-items-center rct-author-info">
                                    <img src={store.user?.photo_url || 'https://via.placeholder.com/30'} alt="Avatar" className="rct-author-avatar-small rounded-circle me-2" />
                                    <span className="fw-bold rct-author-username">{recipeData.username}</span>
                                </div>
                            </div>
                            <div className="rct-details-section w-100 mb-4 row g-3">
                                <div className="col-12 col-md-4">
                                    <label className="form-label rct-form-label">Servings</label>
                                    <input
                                        type="number"
                                        className="form-control rct.servings-input"
                                        name="servings"
                                        value={recipeData.servings}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label rct-form-label">Difficulty Level</label>
                                    <select
                                        className="form-select rct-difficulty-select"
                                        name="difficulty_type"
                                        value={recipeData.difficulty_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Difficulty</option>
                                        {difficultyOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label rct-form-label">Prep Time (min)</label>
                                    <input
                                        type="number"
                                        className="form-control rct-prep-time-input"
                                        name="prep_time"
                                        min="0"
                                        value={recipeData.prep_time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {/* Ingredients Section */}
                            <div className="rct-ingredient-section w-100 mb-4">
                                <h3 className="mb-3 rct-section-title">Ingredients</h3>
                                {recipeData.ingredient.map(ing => (
                                    <div key={ing.id} className="input-group mb-2 rct-ingredient-item d-flex align-items-center">
                                        <input
                                            type="number"
                                            className="form-control rct-ingredient-quantity"
                                            placeholder="Cantidad"
                                            name="quantity"
                                            value={ing.quantity}
                                            onChange={e => handleIngredientChange(ing.id, 'quantity', e.target.value)}
                                            min="0"
                                        />
                                        <input
                                            type="text"
                                            className="form-control rct-ingredient-unit ms-2"
                                            placeholder="Unidad"
                                            name="unit"
                                            value={ing.unit}
                                            onChange={e => handleIngredientChange(ing.id, 'unit', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control rct-ingredient-name ms-2"
                                            placeholder="Ej: Harina de trigo"
                                            name="name"
                                            value={ing.name}
                                            onChange={e => handleIngredientChange(ing.id, 'name', e.target.value)}
                                        />
                                        {recipeData.ingredient.length > 1 && (
                                            <button className="btn btn-outline-danger rct-remove-item-btn ms-2" type="button" onClick={() => removeIngredient(ing.id)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-outline-success mt-2 rct-add-ingredient-btn" type="button" onClick={addIngredient}>
                                    <i className="fa-solid fa-plus"></i> Añadir Ingrediente
                                </button>
                            </div>
                            {/* Steps Section without time input */}
                            <div className="rct-steps-section w-100 mb-4">
                                <h3 className="mb-3 rct-section-title">Steps</h3>
                                {recipeData.steps.map((step, idx) => (
                                    <div key={step.id} className="mb-3 p-3 border rounded rct-step-item">
                                        <div className="d-flex justify-content-between align-items-center mb-2 rct-step-header">
                                            <span className="fw-bold rct-step-number">Step {idx + 1}</span>
                                            {recipeData.steps.length > 1 && (
                                                <button className="btn btn-sm btn-outline-danger rct-remove-step-btn" type="button" onClick={() => removeStep(step.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            className="form-control mt-2 rct-step-description-textarea"
                                            rows="3"
                                            placeholder="Ex: Mix the eggs with milk until..."
                                            name="text"
                                            value={step.text}
                                            onChange={e => handleStepChange(step.id, e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                ))}
                                <button className="btn btn-outline-success mt-2 rct-add-step-btn" type="button" onClick={addStep}>
                                    <i className="fa-solid fa-plus"></i> Add Step
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Image Modal omitted for brevity (unchanged) */}
        </div>
    );
};
