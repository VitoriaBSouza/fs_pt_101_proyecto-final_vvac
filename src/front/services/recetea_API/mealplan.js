const url = import.meta.env.VITE_BACKEND_URL;

const mealPlanServices = {};

// Utility: add JWT token
const authHeaders = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  'Content-Type': 'application/json'
});

// GET: all meal plan entries for the logged-in user
mealPlanServices.getAllEntries = async () => {
  try {
    const resp = await fetch(`${url}/user/mealplan`, {
      method: "GET",
      headers: authHeaders(),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error fetching meal plan entries:", error);
    return [];
  }
};

// ✅ NEW: Get entries structured by date and meal_type
mealPlanServices.getStructuredEntries = async () => {
  try {
    const flatEntries = await mealPlanServices.getAllEntries();

    const structured = {};

    for (const entry of flatEntries) {
      const { date, meal_type } = entry;

      if (!structured[date]) {
        structured[date] = {};
      }

      // Only one recipe per meal_type per date (latest one wins)
      structured[date][meal_type] = entry;
    }

    return structured; // Example: { "2025-06-17": { breakfast: {…}, lunch: {…} } }
  } catch (error) {
    console.error("Error structuring meal plan entries:", error);
    return {};
  }
};

// GET: entries by specific date (YYYY-MM-DD)
mealPlanServices.getEntriesByDate = async (date) => {
  try {
    const resp = await fetch(`${url}/user/mealplan/${date}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error fetching entries by date:", error);
    return [];
  }
};

// POST: add a new meal plan entry
mealPlanServices.addEntry = async ({ date, recipe_id, meal_type }) => {
  try {
    const resp = await fetch(`${url}/user/mealplan`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ date, recipe_id, meal_type }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error adding meal plan entry:", error);
    return error;
  }
};

// PUT: update an existing entry
mealPlanServices.updateEntry = async (entry_id, { date, recipe_id, meal_type }) => {
  try {
    const resp = await fetch(`${url}/user/mealplan/${entry_id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ date, recipe_id, meal_type }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error updating meal plan entry:", error);
    return error;
  }
};

// DELETE: remove a single entry
mealPlanServices.deleteEntry = async (entry_id) => {
  try {
    const resp = await fetch(`${url}/user/mealplan/${entry_id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error deleting meal plan entry:", error);
    return error;
  }
};

// DELETE: clear all meal plan entries for the user
mealPlanServices.clearAllEntries = async () => {
  try {
    const resp = await fetch(`${url}/user/mealplan`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error clearing all meal plan entries:", error);
    return error;
  }
};

export default mealPlanServices;
