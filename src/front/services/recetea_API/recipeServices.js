// This will set the url to the same we added to the env file
const url = import.meta.env.VITE_BACKEND_URL;

const recipeServices = {};

// Utility: Add JWT token
const authHeaders = () => ({
    // Fuerzo el token sacado del postman .. al final de la linea esta lo que deberá haber quitando este token.
  'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0ODQ2MDUwOSwianRpIjoiYTk4ODJiMDEtM2ZmNy00NmZkLWJkYzEtNTY2ZTNiNjdiYWExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjExIiwibmJmIjoxNzQ4NDYwNTA5LCJjc3JmIjoiNzI4MjZlMmUtZjYwMi00MGQ3LThlMDgtN2FmYzM3ZGFkYjUzIiwiZXhwIjoxNzQ4NDYxNDA5fQ.ZjQciimHrl7QjWwNdWCD1E_7w2QspXBJ6TV7zD3016g', //localStorage.getItem('token'),
  'Content-Type': 'application/json'
});

// Get all recipes (guests)
recipeServices.getAllRecipes = async () => {
    // // MIENTRAS LA API NO FUNCIONE, FORZAMOS LOS DATOS DEVUELTOS.
    // try {
    //     const resp = await fetch(url + "/api/recipes", {
    //         method: 'GET',
    //         // mode: 'cors',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });

    //     const data = await resp.json();
    //     if (!resp.ok) throw new Error(data.error || data.message);
    //     console.log("PASAAAAAAAAAAAANDO de estos errores de la API..... forzando la ingesta de datos a mano....");
    //     data = '{"recipe_id":231,"title":"masssaaaassss","nutri_score":4,"name":"teestststst"}';
    //     return data;
    // } catch (error) {
    //     console.error("Error fetching all recipes:", error);
    //     return error;
    // }
        console.log("getAllRecipes ---- PASAAAAAAAAAAAANDO de estos errores de la API..... forzando la ingesta de datos a mano....");
        let data = '{"recipes":[{"recipe_id":1,"name":"testttt","url":"http://www.google.es","nutri_score":5},{"recipe_id":2,"name":"testttt222","url":"http://www.googl3333e.es","nutri_score":5}]}'
        return data;
};

// Get a specific recipe by ID (guests)
recipeServices.getOneRecipe = async (id) => {
    try {
        const resp = await fetch(url + "/api/recipes/" + id, {
            method: 'GET',
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || data.message);

        return data;

    } catch (error) {
        console.error("Error fetching recipe:" + id, error);
        return error;
    }
};

//For mis recetas option
//Get all recipes (need to log in)
recipeServices.getAllUserRecipes = async () => {
    // // LO MISMO, FUERZO DATOS MIENTRAS LA API NO FUNCIONE.
    // try {
    //     const resp = await fetch(url + "/api/user/recipes", {
    //     method: 'GET',
    //     headers: authHeaders()
    //     });

    //     const data = await resp.json();
    //     if (!resp.ok) throw new Error(data.error || data.message);
    //     return data;
    // } catch (error) {
    //     console.error("Error fetching user recipes:", error);
    //     return error;
    // }
    let test434 = '{"recipes":[{"recipe_id":1,"name":"testttt","url":"http://www.google.es","nutri_score":5},{"recipe_id":2,"name":"testttt222","url":"http://www.googl3333e.es","nutri_score":5}]}'
    console.log("---> GETALLUSERrecipes .. forzamos a: " + test434);
    return test434;
}

// GET a specific recipe (need to log in)
recipeServices.getOneUserRecipe = async (id) => {
    try {
        const resp = await fetch(url + "/api/user/recipes/" + id, {
        method: 'GET',
        headers: authHeaders()
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return error;
    }
}

// POST a new recipe (need to log in)
recipeServices.createRecipe = async (recipeData) => {
    try {
        const resp = await fetch(url + "/api/user/recipes", {
        method: 'POST',
        headers: authHeaders(),
        //Need to have title, difficulty_type, steps and ingredients. Prep_time is optional.
        //The author and username fields will be filled automatically as well publised field.
        //The ingredients require quantity, name and unit fields filled. If does not exist on the dabatase will be added.
        body: JSON.stringify(recipeData)
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error creating recipe:", error);
        return error;
    }
}

// PUT to edit an existing recipe (need to log in and be the author of the recipe)
recipeServices.editRecipe = async (id, recipeData) => {
    try {
        const resp = await fetch(url + "/api/user/recipes/" + id, {
        method: 'PUT',
        headers: authHeaders(),
        //Same as the post body.
        body: JSON.stringify(recipeData)
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error("Error editing recipe:", error);
        return error;
    }
}

  // DELETE a recipe created by the user (need to log in and be the author of the recipe)
recipeServices.deleteRecipe = async (id) => {
    try {
      const resp = await fetch(url + "/api/user/recipes/" + id, {
        method: 'DELETE',
        headers: authHeaders()
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return error;
    }
}

export default recipeServices;