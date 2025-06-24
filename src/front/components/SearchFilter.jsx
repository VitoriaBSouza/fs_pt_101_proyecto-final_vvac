import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import recipeServices from "../services/recetea_API/recipeServices.js";
import "../index.css"; // importa estilos incluyendo .filter-menu

export const SearchFilter = ({ onRecipesFiltered }) => {
  const { store, dispatch } = useGlobalReducer();

  const [difficulty, setDifficulty] = useState("");
  const [dietInput, setDietInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [dietTags, setDietTags] = useState([]);
  const [ingredientTags, setIngredientTags] = useState([]);
  const [allergenTags, setAllergenTags] = useState([]);
  const [availableDiets, setAvailableDiets] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [availableAllergens, setAvailableAllergens] = useState([]);

  // Cargar dietas, ingredientes y alérgenos disponibles
  useEffect(() => {
    recipeServices.getAllRecipes().then(data => {
      dispatch({ type: 'get_all_recipes', payload: data });

      const uniqueDiets = [...new Set(
        data
          .flatMap(r => r.diet_label?.split(",").map(d => d.trim().toLowerCase()) || [])
          .filter(label => label)
      )];
      setAvailableDiets(uniqueDiets);

      const allIngredients = data
        .flatMap(r => r.ingredients || [])
        .map(i => i.ingredient_name?.trim().toLowerCase())
        .filter(name => name);
      setAvailableIngredients([...new Set(allIngredients)]);

      // Extraer todos los alérgenos de todas las recetas (array de strings)
      const allAllergens = data
        .flatMap(r => Array.isArray(r.allergens) ? r.allergens : [])
        .map(a => a && a.trim().toLowerCase())
        .filter(Boolean);
      setAvailableAllergens([...new Set(allAllergens)]);

      // Notificar recetas iniciales si hace falta
      if (onRecipesFiltered) onRecipesFiltered(data);
    });
  }, [dispatch, onRecipesFiltered]);

  // Filtrado reactivo - ahora el filtro de alérgenos es EXCLUYENTE
  useEffect(() => {
    const filtered = store.recipes?.filter(recipe => {
      const rd = recipe.difficulty_type?.toLowerCase().trim() || "";
      const md = !difficulty || rd === difficulty.toLowerCase().trim();

      const rds = recipe.diet_label?.split(",").map(d => d.trim().toLowerCase()) || [];
      const mdt = dietTags.length === 0 || dietTags.some(tag => rds.includes(tag.toLowerCase()));

      const rins = recipe.ingredients?.map(i => i.ingredient_name?.trim().toLowerCase()) || [];
      const mit = ingredientTags.length === 0 || ingredientTags.some(tag => rins.includes(tag.toLowerCase()));

      // EXCLUYENTE: la receta se elimina si contiene alguno de los alérgenos en allergenTags
      const rAllergens = Array.isArray(recipe.allergens)
        ? recipe.allergens.map(a => a && a.trim().toLowerCase())
        : [];
      const mat = allergenTags.length === 0 || allergenTags.every(tag => !rAllergens.includes(tag.toLowerCase()));

      return md && mdt && mit && mat;
    }) || [];
    if (onRecipesFiltered) onRecipesFiltered(filtered);
  }, [difficulty, dietTags, ingredientTags, allergenTags, store.recipes, onRecipesFiltered]);

  // Handlers para autocompletado
  const handleIngredientSelect = v => {
    if (!ingredientTags.includes(v)) setIngredientTags(prev => [...prev, v]);
    setIngredientInput("");
  };
  const handleDietSelect = v => {
    if (!dietTags.includes(v)) setDietTags(prev => [...prev, v]);
    setDietInput("");
  };
  const handleAllergenSelect = v => {
    if (!allergenTags.includes(v)) setAllergenTags(prev => [...prev, v]);
    setAllergenInput("");
  };

  const onIngredientKeyDown = e => {
    if (e.key === "Enter") {
      const match = availableIngredients.find(i => i === ingredientInput.toLowerCase());
      if (match) handleIngredientSelect(match);
      setIngredientInput("");
      e.preventDefault();
    }
  };
  const onDietKeyDown = e => {
    if (e.key === "Enter") {
      const match = availableDiets.find(d => d === dietInput.toLowerCase());
      if (match) handleDietSelect(match);
      setDietInput("");
      e.preventDefault();
    }
  };
  const onAllergenKeyDown = e => {
    if (e.key === "Enter") {
      const match = availableAllergens.find(a => a === allergenInput.toLowerCase());
      if (match) handleAllergenSelect(match);
      setAllergenInput("");
      e.preventDefault();
    }
  };
  const onIngredientBlur = () => {
    if (!availableIngredients.includes(ingredientInput.toLowerCase())) setIngredientInput("");
  };
  const onDietBlur = () => {
    if (!availableDiets.includes(dietInput.toLowerCase())) setDietInput("");
  };
  const onAllergenBlur = () => {
    if (!availableAllergens.includes(allergenInput.toLowerCase())) setAllergenInput("");
  };

  const removeDietTag = tag => setDietTags(prev => prev.filter(t => t !== tag));
  const removeIngredientTag = tag => setIngredientTags(prev => prev.filter(t => t !== tag));
  const removeAllergenTag = tag => setAllergenTags(prev => prev.filter(t => t !== tag));

  const resetFilters = () => {
    setDifficulty("");
    setDietInput("");
    setIngredientInput("");
    setAllergenInput("");
    setDietTags([]);
    setIngredientTags([]);
    setAllergenTags([]);
  };

  const Tag = ({ label, onRemove }) => (
    <span className="badge me-2">
      {label}
      <button
        type="button"
        className="btn btn-sm btn-danger btn-close ms-2"
        onClick={() => onRemove(label)}
      />
    </span>
  );

  const filterSuggestions = (input, list, taken=[]) =>
    input
      ? list.filter(item =>
          item.toLowerCase().includes(input.toLowerCase()) &&
          !taken.includes(item)
        ).slice(0, 5)
      : [];

  return (
    <div className="filter-menu card border-0" style={{ height: "auto", maxWidth: "100%" }}>
      <div className="card-body p-0">
        <div className="filter-menu">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Filters</h5>
            <button className="btn btn-sm btn-outline-light" onClick={resetFilters}>
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
              onChange={e => setIngredientInput(e.target.value)}
              onKeyDown={onIngredientKeyDown}
              onBlur={onIngredientBlur}
              autoComplete="off"
            />
            {ingredientInput && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1050 }}>
                {filterSuggestions(ingredientInput, availableIngredients, ingredientTags).map(i => (
                  <li
                    key={i}
                    className="list-group-item list-group-item-action"
                    onMouseDown={() => handleIngredientSelect(i)}
                  >
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
              onChange={e => setDietInput(e.target.value)}
              onKeyDown={onDietKeyDown}
              onBlur={onDietBlur}
              autoComplete="off"
            />
            {dietInput && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1050 }}>
                {filterSuggestions(dietInput, availableDiets, dietTags).map(d => (
                  <li
                    key={d}
                    className="list-group-item list-group-item-action"
                    onMouseDown={() => handleDietSelect(d)}
                  >
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

          {/* Allergens */}
          <div className="mb-3 position-relative">
            <label className="form-label">Allergens:</label>
            <input
              type="text"
              className="form-control"
              value={allergenInput}
              placeholder="Type an allergen"
              onChange={e => setAllergenInput(e.target.value)}
              onKeyDown={onAllergenKeyDown}
              onBlur={onAllergenBlur}
              autoComplete="off"
            />
            {allergenInput && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1050 }}>
                {filterSuggestions(allergenInput, availableAllergens, allergenTags).map(a => (
                  <li
                    key={a}
                    className="list-group-item list-group-item-action"
                    onMouseDown={() => handleAllergenSelect(a)}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2">
              {allergenTags.map(tag => (
                <Tag key={tag} label={tag} onRemove={removeAllergenTag} />
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-3">
            <label className="form-label">Difficulty:</label>
            <select
              className="form-select"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
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
