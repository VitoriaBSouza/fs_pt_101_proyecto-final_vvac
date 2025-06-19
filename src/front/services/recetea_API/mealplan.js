const url = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const mealPlanServices = {};

// Utility: add JWT token
const authHeaders = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  'Content-Type': 'application/json'
});

// Ensure date is in ISO format
const ensureISODate = (date) => {
  if (typeof date === "string") return date; // Already formatted
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString(); // fallback
};

// GET: all meal plan entries
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

// GET: structured by date and meal_type
mealPlanServices.getStructuredEntries = async () => {
  try {
    const flatEntries = await mealPlanServices.getAllEntries();
    const structured = {};

    for (const entry of flatEntries) {
      const { date, meal_type } = entry;
      if (!structured[date]) structured[date] = {};
      structured[date][meal_type] = entry;
    }

    return structured;
  } catch (error) {
    console.error("Error structuring meal plan entries:", error);
    return {};
  }
};

// GET: entries by specific date
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

// POST: add a new entry
mealPlanServices.addEntry = async ({ date, recipe_id, meal_type }) => {
  try {
    const payload = {
      date: ensureISODate(date),
      recipe_id,
      meal_type
    };
    const resp = await fetch(`${url}/user/mealplan`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || data.message);
    return data;
  } catch (error) {
    console.error("Error adding meal plan entry:", error);
    return error;
  }
};

// PUT: update existing entry
mealPlanServices.updateEntry = async (entry_id, { date, recipe_id, meal_type }) => {
  try {
    const payload = {
      date: ensureISODate(date),
      recipe_id,
      meal_type
    };
    const resp = await fetch(`${url}/user/mealplan/${entry_id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
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

// DELETE: clear all entries
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
