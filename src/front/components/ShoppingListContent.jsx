// src/front/components/ShoppingListContent.jsx
import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import shoppingListServices from "../services/recetea_API/shoppingListService.js";

export const ShoppingListContent = () => {
  const { store, dispatch } = useGlobalReducer();

  const removeIngredient = async (item_id) => {
    if (!confirm("Are you sure you want to remove this ingredient?")) return;
    try {
      await shoppingListServices.deleteItem(item_id);
      const updatedList = store.shoppingList.filter(item => item.id !== item_id);
      dispatch({ type: 'get_shopping_list', payload: updatedList });
    } catch (error) {
      console.error("Error deleting item from shopping list:", error);
      alert("Failed to remove item.");
    }
  };

  const resetList = async () => {
    if (!confirm("Are you sure you want to reset your shopping list?")) return;
    try {
      await shoppingListServices.clearList();
      dispatch({ type: 'get_shopping_list', payload: [] });
    } catch (error) {
      console.error("Error clearing shopping list:", error);
      alert("Failed to reset shopping list.");
    }
  };

  useEffect(() => {
    shoppingListServices.getShoppingList()
      .then(data => {
        if (Array.isArray(data)) {
          dispatch({ type: 'get_shopping_list', payload: data });
        } else {
          console.error("Expected shopping list array, got:", data);
        }
      })
      .catch(err => {
        console.error("Failed to load shopping list:", err);
      });
  }, []);

  return (
    <div className="d-flex align-items-start flex-column mb-3">
      <h2 className="mb-3 shopping-header">
        Shopping List
      </h2>
      <p>Your ingredients list</p>
      <div className="container justify-content-center shopping-button-list">
        <ul className="shopping-list text-start">
          {store.shoppingList.length === 0 ? (
            <li className="empty-shopping-list">You have no items in the list.</li>
          ) : (
            store.shoppingList.map((item) =>
              item && item.ingredient_name && item.total_quantity && item.unit ? (
                <li className="shopping-item" key={item.id}>
                  <span className="item-text-shopping">
                    {item.ingredient_name} - {item.total_quantity} {item.unit}
                  </span>
                  <button
                    className="remove-button"
                    onClick={() => removeIngredient(item.id)}
                    aria-label={`Delete ${item.ingredient_name}`}
                  >
                    ✖
                  </button>
                </li>
              ) : (
                <li className="shopping-item text-danger" key={item?.id || Math.random()}>
                  <em>Invalid item data</em>
                </li>
              )
            )
          )}
        </ul>
        <div className="reset-container">
          <button className="reset-button" onClick={resetList}>
            Reset list
          </button>
        </div>
      </div>
    </div>
  );
};
