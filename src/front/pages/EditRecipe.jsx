import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

//hooks
import useGlobalReducer from "../hooks/useGlobalReducer";

//services
import recipeServices from "../services/recetea_API/recipeServices";
import mediaServices from "../services/recetea_API/mediaServices";

//components
import { TurnHome } from "../components/buttons/TurnHome";
import { LinksMenu } from "../components/LinksMenu";
import { EditRecipeMedia } from "../components/editRecipeMedia";

export const EditRecipe = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const { id } = useParams();
    const recipe_id = Number(id)

    const difficultyOptions = ["Easy", "Moderate", "Hard"];
    const [images, setImages] = useState([]);

    const recipeToEdit = Array.isArray(store.recipes) ? store.recipes.find(r => r.id === Number(id)) : undefined;

    const [recipe, setRecipe] = useState({
        title: "",
        difficulty_type: "",
        portions: 0,
        prep_time: 0,
        ingredients: [
            { id: 0, name: "", quantity: 0, unit: "" }
        ],
        steps: [{ id: 0, description: "" }],
        media: []
    });

    useEffect(() => {
        if (recipeToEdit) {
            console.log("Recipe to edit:", recipeToEdit);

            setRecipe({
                ...recipeToEdit,
                ingredients: Array.isArray(recipeToEdit.ingredients)
                    ? recipeToEdit.ingredients.map((ing, i) => ({
                        id: ing.id ?? i,
                        name: ing.name || "",
                        quantity: ing.quantity || 0,
                        unit: ing.unit || ""
                    }))
                    : [],
                steps: typeof recipeToEdit.steps === "string"
                    ? JSON.parse(recipeToEdit.steps)
                    : Array.isArray(recipeToEdit.steps)
                        ? recipeToEdit.steps
                        : [],
                media: recipeToEdit.media || []
            });
            setImages(recipeToEdit.media || []);
        }
    }, [recipeToEdit]);

    //handle changes of recipe details and converts to number the string 
    // of the portions and prep_time
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({
            ...recipe,
            [name]: name === "portions" || name === "prep_time" ? Number(value) : value
        });
    };

    //handle changes of ingredients details, converts to number quatity string
    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...recipe.ingredients];
        updated[index][name] = (name === "quantity") ? Number(value) : value;
        setRecipe(prev => ({ ...prev, ingredients: updated }));
    };

    //handles changes of steps
    const handleStepChange = (index, e) => {
        const updated = [...recipe.steps];
        updated[index][e.target.name] = e.target.value;
        setRecipe(prev => ({ ...prev, steps: updated }));
    };

    //this adds the ingredients to the list
    const addIngredient = () => {
        const newId = Math.max(0, ...recipe.ingredients.map(i => i.id)) + 1;
        setRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { id: newId, name: "", quantity: 0, unit: "" }]
        }));
    };

    //this wil remove ingredients from list
    const removeIngredient = idToRemove => {
        setRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i.id !== idToRemove)
        }));
    };

    //adds steps to list
    const addStep = () => {
        const newId = Math.max(0, ...recipe.steps.map(s => s.id)) + 1;
        setRecipe(prev => ({
            ...prev,
            steps: [...prev.steps, { id: newId, description: "" }]
        }));
    };

    //this will remove steps
    const removeStep = idToRemove => {
        setRecipe(prev => ({
            ...prev,
            steps: prev.steps.filter(s => s.id !== idToRemove)
        }));
    };

    //this will delete full details of the form to start from scratch
    const handleDiscard = () => {
        if (window.confirm("Discard all changes?")) {
            setRecipe({
                title: store.recipe?.title,
                difficulty_type: store.recipe?.difficulty_type,
                portions: store.recipe?.portions,
                prep_time: store.recipe?.prep_time,
                ingredients: [{
                    id: store.recipe?.ingredients?.ingredients_id,
                    name: store.recipe?.ingredients?.ingredients_name,
                    quantity: store.recipe?.ingredients?.quantity,
                    unit: store.recipe?.ingredients?.unit
                }],
                steps: [{ id: store.recipe?.steps, description: store.recipe?.description }]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // we will just delete the recipes the user want as well add if any new is found
            for (const img of images) {
                console.log(images);

                if (img.deleted && img.id) {
                    await mediaServices.deleteMediaFromRecipe(recipe_id, img.id);
                }
            }

            const validImages = images.filter(img => !img.deleted);
            console.log(validImages);

            // After media is deleted we edit recipe
            const response = await recipeServices.editRecipe(recipe_id, {
                ...recipe,
                media: [],
            });

            // load new images be URL or base64 with the images
            const newImages = validImages.filter(img => !img.id && img.url?.trim())
                .map(img => ({ type_media: "image", url: img.url.trim() }));

            if (newImages.length > 0) {
                const added = await mediaServices.addMediaToRecipe(recipe_id, newImages);
                console.log(added);
            }


            const fullRecipe = await recipeServices.getOneUserRecipe(recipe_id);

            //call it here after media was added
            dispatch({ type: "update_recipe", payload: { recipe: fullRecipe, recipes: response } });

            //will got back to collection to see recipe added to user list of my recipes
            navigate("/your-collection");

        } catch (err) {
            console.error(err);
            alert("Could not update recipe, please try again.");
        }
    };

    return (
        <div className="rct-create-recipe-wrapper fs-5">
            <div className="rct-create-recipe-container container-fluid">
                <div className="row g-0">
                    <div className="col-12 col-md-3 rct-left-sidebar">
                        <div className="d-flex align-items-start rct-sidebar-content">
                            <TurnHome />
                            <LinksMenu />
                        </div>
                    </div>

                    <div className="col-12 col-md-9 rct-main-content">
                        <form className="rct-recipe-form-area d-flex flex-column mb-3" onSubmit={handleSubmit}>
                            {/* Top bar */}
                            <EditRecipeMedia images={images} setImages={setImages} />

                            <div className="rct-top-section row g-0 mb-4">
                                <div className="col-12 col-md-6 d-flex justify-content-end mt-3 mt-md-0 ms-auto">
                                    <button type="button" className="btn btn-outline-danger me-2 fs-4"
                                        onClick={() => navigate("/your-collection")}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary me-2 fs-4"
                                        onClick={handleDiscard}>
                                        Clear
                                    </button>
                                    <button type="submit" className="btn btn-success fs-4">Update</button>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-2"
                                    name="title"
                                    required
                                    autoFocus
                                    value={recipe.title}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Details */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <label className="form-label">Servings</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="portions"
                                        value={recipe.portions}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Difficulty</label>
                                    <select
                                        className="form-select"
                                        name="difficulty_type"
                                        value={recipe.difficulty_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Difficulty</option>
                                        {difficultyOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Prep Time (min)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="prep_time"
                                        value={recipe.prep_time}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div className="mb-4">
                                <h3>Ingredients</h3>
                                {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, idx) => (
                                    <div key={ing.id || idx} className="d-flex mb-2">
                                        <input
                                            type="number"
                                            className="form-control me-2"
                                            name="quantity"
                                            value={ing.quantity}
                                            onChange={(e) => handleIngredientChange(idx, e)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            name="unit"
                                            value={ing.unit}
                                            onChange={(e) => handleIngredientChange(idx, e)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            name="name"
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(idx, e)}
                                        />
                                        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 1 && (
                                            <button type="button" className="btn btn-outline-danger" onClick={() => removeIngredient(ing.id)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline-success p-2 d-flex" onClick={addIngredient}>
                                    <i className="fa-solid fa-plus mx-2 mt-2"></i>
                                    <p className="fs-5">Add ingredients</p>
                                </button>
                            </div>

                            {/* Steps */}
                            <div className="mb-4">
                                <h3>Steps</h3>
                                {Array.isArray(recipe.steps) && recipe.steps?.map((step, idx) => (
                                    <div key={step.id || idx} className="mb-3">
                                        <label className="form-label">Step {idx + 1}</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="description"
                                            value={step.description}
                                            onChange={(e) => handleStepChange(idx, e)}
                                        />
                                        {Array.isArray(recipe.steps) && recipe.steps.length > 1 && (
                                            <button type="button" className="btn btn-sm btn-outline-danger mt-1 d-flex" onClick={() => removeStep(step.id)}>
                                                <i className="fa-solid fa-trash mt-2 mx-2"></i>
                                                <p className="fs-5">Remove</p>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline-success d-flex" onClick={addStep}>
                                    <i className="fa-solid fa-plus mt-2 mx-2"></i>
                                    <p className="fs-5">Add Steps</p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
