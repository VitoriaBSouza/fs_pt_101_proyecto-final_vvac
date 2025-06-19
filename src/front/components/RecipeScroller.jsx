import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ id, name, url, onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        minWidth: "250px",
        maxWidth: "250px",
        marginRight: "16px",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        backgroundColor: "#fff",
        flexShrink: 0,
        border: "2px solid #ca3e49",
      }}
    >
      <img
        src={url}
        alt={name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <div style={{ padding: "10px" }}>
        <h5 style={{ margin: 0 }}>{name}</h5>
      </div>
    </div>
  );
};

export const RecipeScroller = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const promises = Array.from({ length: 10 }, () =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (res) => res.json()
          )
        );

        const results = await Promise.all(promises);
        const formatted = results.map((data) => {
          const meal = data.meals[0];
          return {
            id: meal.idMeal,
            name: meal.strMeal,
            url: meal.strMealThumb,
          };
        });

        setRecipes(formatted);
      } catch (err) {
        console.error("Error fetching random recipes:", err);
      }
    };

    fetchRandomRecipes();
  }, []);

  const handleClick = (id) => {
    navigate("/recipes/" + id);
    // Si quieres desactivar scroll automático en el historial:
    window.history.scrollRestoration = 'manual';
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#eff0ea" }}>
      <h2 style={{ textAlign: "center" }}>Some Random Ideas!!</h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "20px 0",
          gap: "16px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {recipes.map((recipe) => (
          <div key={recipe.id} style={{ scrollSnapAlign: "start" }}>
            <RecipeCard {...recipe} onClick={handleClick} />
          </div>
        ))}
      </div>
    </div>
  );
};