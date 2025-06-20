import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RecipeScroller = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const promises = Array.from({ length: 10 }, () =>
          fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
        );

        const results = await Promise.all(promises);
        const formatted = results.map(data => {
          const meal = data.meals[0];
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) ingredients.push(ingredient);
          }
          return {
            id: meal.idMeal,
            name: meal.strMeal,
            img: meal.strMealThumb,
            ingredients,
          };
        });

        setRecipes(formatted);
      } catch (err) {
        console.error('Error fetching random recipes:', err);
      }
    };

    fetchRandomRecipes();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">Some Random Ideas!!</h2>
      <div
        className="d-flex overflow-auto gap-3 pb-3"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {recipes.map(recipe => (
          <div
            className="card flex-shrink-0"
            key={recipe.id}
            style={{ width: '280px', scrollSnapAlign: 'start' }}
          >
            <img
              src={recipe.img}
              alt={recipe.name}
              className="card-img-top"
              style={{ height: '180px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="card-title">{recipe.name}</h5>
              <ul className="list-unstyled small mb-3">
                {recipe.ingredients.slice(0, 5).map((ing, index) => (
                  <li key={ing.ingredient_id || index}>• {ing.ingredient_name || ing}</li>
                ))}
              </ul>
              <button
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="btn btn-primary btn-sm w-100"
              >
                See Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};