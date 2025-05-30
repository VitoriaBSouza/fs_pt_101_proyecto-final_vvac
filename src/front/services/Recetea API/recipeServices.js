// This will set the url to the same we added to the env file
const url = import.meta.env.VITE_BACKEND_URL;

const recipeServices = {};

// Utility: Add JWT token
const authHeaders = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  'Content-Type': 'application/json'
});

//Get all recipes (need to log in)
recipeServices.getAllUserRecipes = async () => {
    try {
        const resp = await fetch(url + "/user/recipes", {
        method: 'GET',
        headers: authHeaders()
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || data.message);
        return data;
    } catch (error) {
        console.error("Error fetching user recipes:", error);
        return null;
    }
}

// GET a specific recipe (need to log in)
recipeServices.getOneUserRecipe = async (recipe_id) => {
    try {
        const resp = await fetch(url + "/user/recipes/" + recipe_id, {
        method: 'GET',
        headers: authHeaders()
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return null;
    }
}

// POST a new recipe (need to log in)
recipeServices.createRecipe = async (recipeData) => {
    try {
        const resp = await fetch(url + "/user/recipes", {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(recipeData)
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error creating recipe:", error);
        return null;
    }
}

// PUT to edit an existing recipe (need to log in and be the author of the recipe)
recipeServices.editRecipe = async (recipe_id, recipeData) => {
    try {
        const resp = await fetch(url + "user/recipes/" + recipe_id, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(recipeData)
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error editing recipe:", error);
        return null;
    }
}

  // DELETE a recipe created by the user (need to log in and be the author of the recipe)
recipeServices.deleteRecipe = async (recipe_id) => {
    try {
      const resp = await fetch(url + "/user/recipes/" + recipe_id, {
        method: 'DELETE',
        headers: authHeaders()
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return null;
    }
}

export default recipeServices;