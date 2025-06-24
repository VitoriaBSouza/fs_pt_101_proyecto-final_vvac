// This will set the url to the same we added to the env file
const url = import.meta.env.VITE_BACKEND_URL;

const mediaServices = {};

const authHeaders = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  'Content-Type': 'application/json'
});


//Add media to a recipe (must be the author of said recipe)
mediaServices.addMediaToRecipe = async (recipe_id, mediaData) => {
  try {
    const resp = await fetch(url + "/api/user/recipes/" + recipe_id + "/media", {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(mediaData)
    });

    if (!resp.ok) {
      // Intenta obtener el error del JSON, si falla muestra status
      let errorData;
      try {
        errorData = await resp.json();
      } catch {
        throw new Error(`Error HTTP ${resp.status}`);
      }
      throw new Error(errorData.error || `Error HTTP ${resp.status}`);
    }

    const data = await resp.json();
    return data;

  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
}


//Delete the media of the recipe (must be the author of said recipe)
mediaServices.deleteMediaFromRecipe = async (recipe_id, media_id) => {
    try {
      const resp = await fetch(url + "/api/user/recipes/" + recipe_id + "/media/" + media_id, {
        method: 'DELETE',
        headers: authHeaders()
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error("Error deleting media:", error);
      return null;
    }
}

export default mediaServices;
