import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import recipeServices from "../services/recetea_API/recipeServices.js";
import { SearchView } from "./SearchView.jsx";

export const SearchFilter = () => {
    const { store, dispatch } = useGlobalReducer();

    const [difficulty, setDifficulty] = useState("");
    const [dietInput, setDietInput] = useState("");
    const [ingredientInput, setIngredientInput] = useState("");
    const [dietTags, setDietTags] = useState([]);
    const [ingredientTags, setIngredientTags] = useState([]);
    const [availableDiets, setAvailableDiets] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        recipeServices.getAllRecipes().then(data => {
            dispatch({ type: 'get_all_recipes', payload: data });
            setFilteredRecipes(data);

            const uniqueDiets = [...new Set(
                data
                    .flatMap(recipe =>
                        recipe.diet_label
                            ?.split(",")
                            .map(d => d.trim().toLowerCase()) || []
                    )
                    .filter(label => label && label !== "")
            )];
            setAvailableDiets(uniqueDiets);

            const allIngredients = data
                .flatMap(recipe => recipe.ingredients || [])
                .map(i => i.ingredient_name?.trim().toLowerCase())
                .filter(name => name);
            setAvailableIngredients([...new Set(allIngredients)]);
        });
    }, []);

    useEffect(() => {
        const filtered = store.recipes?.filter(recipe => {
            const recipeDifficulty = recipe.difficulty_type?.toLowerCase().trim() || "";
            const matchesDifficulty = difficulty === "" || recipeDifficulty === difficulty.toLowerCase().trim();

            const recipeDiets = (recipe.diet_label || "")
                .split(",")
                .map(d => d.trim().toLowerCase());
            const matchesDiet =
                dietTags.length === 0 ||
                dietTags.some(tag => recipeDiets.includes(tag.toLowerCase()));

            const recipeIngredients = recipe.ingredients?.map(i => i.ingredient_name?.trim().toLowerCase()) || [];
            const matchesIngredient =
                ingredientTags.length === 0 ||
                ingredientTags.some(tag => recipeIngredients.includes(tag.toLowerCase()));

            return matchesDifficulty && matchesDiet && matchesIngredient;
        });

        setFilteredRecipes(filtered || []);
    }, [difficulty, dietTags, ingredientTags, store.recipes]);

    const handleIngredientSelect = (value) => {
        if (!ingredientTags.includes(value)) {
            setIngredientTags([...ingredientTags, value]);
        }
        setIngredientInput("");
    };

    const handleDietSelect = (value) => {
        if (!dietTags.includes(value)) {
            setDietTags([...dietTags, value]);
        }
        setDietInput("");
    };

    const onIngredientKeyDown = (e) => {
        if (e.key === "Enter") {
            const match = availableIngredients.find(i => i === ingredientInput.toLowerCase());
            if (match) {
                handleIngredientSelect(match);
            } else {
                setIngredientInput("");
            }
            e.preventDefault();
        }
    };

    const onDietKeyDown = (e) => {
        if (e.key === "Enter") {
            const match = availableDiets.find(d => d === dietInput.toLowerCase());
            if (match) {
                handleDietSelect(match);
            } else {
                setDietInput("");
            }
            e.preventDefault();
        }
    };

    const onIngredientBlur = () => {
        const match = availableIngredients.find(i => i === ingredientInput.toLowerCase());
        if (!match) setIngredientInput("");
    };

    const onDietBlur = () => {
        const match = availableDiets.find(d => d === dietInput.toLowerCase());
        if (!match) setDietInput("");
    };

    const removeDietTag = (tag) =>
        setDietTags(dietTags.filter(t => t !== tag));

    const removeIngredientTag = (tag) =>
        setIngredientTags(ingredientTags.filter(t => t !== tag));

    const resetFilters = () => {
        setDifficulty("");
        setDietInput("");
        setIngredientInput("");
        setDietTags([]);
        setIngredientTags([]);
    };

    const Tag = ({ label, onRemove }) => (
        <span className="badge bg-danger me-2">
            {label}
            <button
                type="button"
                className="btn btn-sm btn-close ms-2"
                onClick={() => onRemove(label)}
                style={{ filter: "invert(1)" }}
            />
        </span>
    );

    const filterSuggestions = (input, list) =>
        input.length > 0
            ? list.filter(item =>
                item.toLowerCase().includes(input.toLowerCase()) &&
                ![...ingredientTags, ...dietTags].includes(item)
            ).slice(0, 5)
            : [];

    return (
        <div className="row">
            <div className="col-md-8 p-3">
                <SearchView recipes={filteredRecipes} />
            </div>

            <div className="col-md-4 p-3">
                <div className="filter-menu">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Filters</h5>
                        <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                            Reset filters
                        </button>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">Ingredients:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={ingredientInput}
                            placeholder="Type an ingredient"
                            onChange={(e) => setIngredientInput(e.target.value)}
                            onKeyDown={onIngredientKeyDown}
                            onBlur={onIngredientBlur}
                            autoComplete="off"
                        />
                        {ingredientInput && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1050 }}>
                                {filterSuggestions(ingredientInput, availableIngredients).map(i => (
                                    <li key={i} className="list-group-item list-group-item-action" onMouseDown={() => handleIngredientSelect(i)}>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-2">
                            {ingredientTags.map(tag => (
                                <Tag key={tag} label={tag} onRemove={removeIngredientTag} />
                            ))}
                        </div>
                    </div>

                    {/* Diets */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">Diet type:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dietInput}
                            placeholder="Type a diet type"
                            onChange={(e) => setDietInput(e.target.value)}
                            onKeyDown={onDietKeyDown}
                            onBlur={onDietBlur}
                            autoComplete="off"
                        />
                        {dietInput && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1050 }}>
                                {filterSuggestions(dietInput, availableDiets).map(d => (
                                    <li key={d} className="list-group-item list-group-item-action" onMouseDown={() => handleDietSelect(d)}>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-2">
                            {dietTags.map(tag => (
                                <Tag key={tag} label={tag} onRemove={removeDietTag} />
                            ))}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="mb-3">
                        <label className="form-label">Difficulty:</label>
                        <select
                            className="form-select"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
