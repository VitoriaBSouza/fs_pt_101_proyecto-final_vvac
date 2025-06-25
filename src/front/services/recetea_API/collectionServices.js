const url = import.meta.env.VITE_BACKEND_URL;

const collectionService = {};

const authHeaders = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  'Content-Type': 'application/json'
});

// Get current user's collection
collectionService.getUserCollections = async () => {
  try {
    const resp = await fetch(url + "/api/user/collection", {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, ...data };

  } catch (error) {
     return { success: false, error: error.message }
  }
};

  

// Add recipe to collection
collectionService.addToCollection = async (recipe_id) => {
  try {
    const resp = await fetch(url + "/api/user/collection/recipes/" + recipe_id, {
      method: "POST",
      headers: authHeaders(),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { success: false, error: data.error || 'Unknown error' };
    }

    return { success: true, ...data };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove recipe from collection
collectionService.removeFromCollection = async (recipe_id) => {
  try {
    const resp = await fetch(url + "/api/user/collection/recipes/" + recipe_id, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { success: false, error: data.error || 'Unknown error' };
    }

    return { success: true, ...data };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default collectionService;
