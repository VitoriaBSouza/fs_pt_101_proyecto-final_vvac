const API_URL = import.meta.env.VITE_BACKEND_URL;

// GET all meal plan entries
const getAllEntries = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/mealplan`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GET failed: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching meal plan entries:", error);
    throw error;
  }
};

// POST new meal plan entry
const addEntry = async (data) => {
  try {
    const res = await fetch(`${API_URL}/api/user/mealplan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`POST failed: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding meal plan entry:", error);
    throw error;
  }
};

// PUT update meal plan entry
const updateEntry = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/api/user/mealplan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`PUT failed: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating meal plan entry:", error);
    throw error;
  }
};

// DELETE a meal plan entry
const deleteEntry = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/user/mealplan/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`DELETE failed: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error deleting meal plan entry:", error);
    throw error;
  }
};

export default {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry,
};
