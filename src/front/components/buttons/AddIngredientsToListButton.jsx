import React from "react";
import shoppingListServices from "../../services/recetea_API/shoppingListService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

export const AddIngredientsToListButton = ({ ingredientList = [] }) => {
  const handleAddIngredients = async () => {
    if (!ingredientList.length) return;

    const itemsToAdd = ingredientList
      .filter(item => item.name || item.ingredient_name)
      .map((ingredient) => ({
        ingredient_name: ingredient.name || ingredient.ingredient_name,
        total_quantity: ingredient.quantity ?? 1,
        unit: ingredient.unit || ""
      }));

    if (!itemsToAdd.length) {
      alert("No valid ingredients to add.");
      return;
    }

    try {
      const result = await shoppingListServices.addItemsToList(itemsToAdd);
      console.log("Ingredients added to shopping list:", result);
      alert(`${itemsToAdd.length} ingredients added to shopping list!`);
    } catch (err) {
      console.error("Failed to add ingredients:", err);
      alert("Error adding ingredients to list.");
    }
  };

  return (
    <button
      type="button"
      className="btn border-0"
      onClick={handleAddIngredients}
    >
      <FontAwesomeIcon 
      icon={faCartPlus}
      className="ms-4 fs-2 color_icons" 
      />
    </button>
  );
};
