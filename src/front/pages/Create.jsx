

export const Create = () => {

    const [recipe, setRecipe] = useState({
        title: "",
        difficulty_type: "",
        portions: "",
        prep_time: "",
        ingredients: {
            ingredient_name: "",
            quantity: "",
            unit: "",
        },
        steps: ""

    })

    



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
                                {recipeData.ingredient?.map((ing, index) => (
                                    <div key={`${ing.ingredient_id}-${index}`} className="input-group mb-2 rct-ingredient-item d-flex align-items-center">
                                        <input
                                            key={`${ing.ingredient_id}-1-${index}`}
                                            type="number"
                                            className="form-control rct-ingredient-quantity"
                                            placeholder="Cantidad"
                                            name="quantity"
                                            value={ing.quantity}
                                            onChange={e => handleIngredientChange(ing.ingredient_id, 'quantity', e.target.value)}
                                            min="0"
                                        />
                                        <input
                                            key={`${ing.ingredient_id}-2-${index}`}
                                            type="text"
                                            className="form-control rct-ingredient-unit ms-2"
                                            placeholder="Unidad"
                                            name="unit"
                                            value={ing.unit}
                                            onChange={e => handleIngredientChange(ing.ingredient_id, 'unit', e.target.value)}
                                        />
                                        <input
                                            key={`${ing.ingredient_id}-3-${index}`}
                                            type="text"
                                            className="form-control rct-ingredient-name ms-2"
                                            placeholder="Ej: Harina de trigo"
                                            name="name"
                                            value={ing.name}
                                            onChange={e => handleIngredientChange(ing.ingredient_id, 'name', e.target.value)}
                                        />
                                        {recipeData.ingredient.length > 1 && (
                                            <button className="btn btn-outline-danger rct-remove-item-btn ms-2" type="button" onClick={() => removeIngredient(ing.ingredient_id)}>
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
} 