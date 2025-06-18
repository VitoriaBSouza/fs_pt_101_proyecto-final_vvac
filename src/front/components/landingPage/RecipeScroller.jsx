import React, { useEffect, useState } from 'react';


export const RecipeScroller = () => {
  const [recipes, setRecipes] = useState([]);

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
    <div className="recipe-scroller-container">
      <h1 className="title">Some random ideas!!</h1>
      <div className="scroller">
        {recipes.map(recipe => (
          <div className="card" key={recipe.id}>
            <img src={recipe.img} alt={recipe.name} />
            <h2>{recipe.name}</h2>
            <ul>
              {recipe.ingredients.slice(0, 5).map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

