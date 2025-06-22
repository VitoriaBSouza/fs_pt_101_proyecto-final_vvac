const BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/?$/, "/api/user/shopping-list");

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const parseJSONResponse = async (resp) => {
  const data = await resp.json();
  if (!resp.ok) {
    console.error("HTTP Error:", resp.status, resp.statusText);
    throw new Error(data.error || data.message || "Unknown error");
  }
  return data;
};

const request = async (path = "", method = "GET", body = null) => {
  const config = {
    method,
    headers: authHeaders(),
    ...(body && { body: JSON.stringify(body) }),
  };
  const response = await fetch(`${BASE_URL}${path}`, config);
  return parseJSONResponse(response);
};

const shoppingListServices = {
  getShoppingList: () => request(),
  addRecipesToList: (recipe_ids = []) => request("", "POST", { recipe_ids }),
  addItemsToList: (items = []) => request("/items", "POST", { items }),
  deleteItem: (item_id) => request(`/${item_id}`, "DELETE"),
  clearList: async () => {
    await request("", "DELETE");
    return [];
  },
};

export default shoppingListServices;
