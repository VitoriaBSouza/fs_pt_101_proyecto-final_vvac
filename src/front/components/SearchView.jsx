// src/front/components/SearchView.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import recipeServices from "../services/recetea_API/recipeServices.js";
import "../index.css";

export const SearchView = ({ recipes }) => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleClick = (id) => {
    recipeServices.getOneRecipe(id).then(data => {
      dispatch({ type: 'get_one_recipe', payload: data });
      navigate(`/recipes/${id}`);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [orderAsc, setOrderAsc] = useState(false);
  const recipesPerPage = 5;

  // Helper for number of likes from store.scores
  const getLikes = (recipeId) => {
    return store.scores?.[recipeId]?.length || 0;
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    let valA, valB;
    if (sortBy === "date") {
      valA = new Date(a.published).getTime();
      valB = new Date(b.published).getTime();
    } else {
      valA = getLikes(a.id);
      valB = getLikes(b.id);
    }
    return orderAsc ? valA - valB : valB - valA;
  });

  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = sortedRecipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [recipes, sortBy, orderAsc]);

  if (!recipes || recipes.length === 0) {
    return <p className="text-muted mt-4">No se encontraron recetas con esos filtros.</p>;
  }

  return (
    <div>
      {/* Sorting Tabs and Order Toggle */}
      <div className="d-flex align-items-center mb-3 searchview-tabs">
        <ul className="nav nav-tabs me-3">
          <li className="nav-item">
            <button
              className={`nav-link ${sortBy === "date" ? "active" : "text-danger"}`}
              onClick={() => setSortBy("date")}
            >
              Published
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${sortBy === "score" ? "active" : "text-danger"}`}
              onClick={() => setSortBy("score")}
            >
              Liked
            </button>
          </li>
        </ul>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => setOrderAsc(prev => !prev)}
        >
          {orderAsc ? "Ascending ↑" : "Descending ↓"}
        </button>
      </div>

      {/* Recipe List */}
      <div className="d-flex flex-column">
        {currentRecipes.map(recipe => {
          const likes = getLikes(recipe.id);
          return (
            <div
              key={recipe.id}
              className="m-2 searchview-recipecard"
              onClick={() => handleClick(recipe.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card p-3 d-flex flex-row align-items-center">
                <img
                  src={recipe.media?.[0]?.url || "/default.jpg"}
                  className="img-fluid rounded me-3"
                  alt={recipe.title}
                  style={{ maxWidth: "150px", height: "auto" }}
                />
                <div>
                  <h5>{recipe.title}</h5>
                  <p className="text-muted">
                    {recipe.ingredients?.map(i => i.ingredient_name).join(", ") || "No ingredients listed"}
                  </p>
                  <div className="d-flex gap-3">
                    <span><i className="fa-solid fa-clock"></i> {recipe.prep_time}m</span>
                    <span><i className="fa-solid fa-gear"></i> {recipe.difficulty_type}</span>
                    {sortBy === "date" && (
                      <span><i className="fa-solid fa-calendar"></i> {new Date(recipe.published).toLocaleDateString()}</span>
                    )}
                    {sortBy === "score" && (
                      <span><i className="fa-solid fa-heart"></i> {likes}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <nav aria-label="Recipe pagination">
        <ul className="pagination justify-content-center mt-3 searchview-pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
