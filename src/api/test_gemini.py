# test_gemini_labels.py
import os
from dotenv import load_dotenv
from api.gemini_utils import get_diet_label_gemini # Adjust this import based on your file structure

# Load environment variables
load_dotenv()

# --- Test Cases ---

# Test Case 1: Clearly Vegan
ingredients1 = ["tofu", "broccoli", "rice", "soy sauce"]
print(f"Ingredients: {ingredients1} -> Expected: vegan")
print(f"Actual Label: {get_diet_label_gemini(ingredients1)}\n")

# Test Case 2: Vegetarian (contains egg, no meat/fish)
ingredients2 = ["eggs", "milk", "flour", "sugar"]
print(f"Ingredients: {ingredients2} -> Expected: vegetarian")
print(f"Actual Label: {get_diet_label_gemini(ingredients2)}\n")

# Test Case 3: Keto (high fat, low carb)
ingredients3 = ["avocado", "bacon", "spinach", "olive oil"]
print(f"Ingredients: {ingredients3} -> Expected: keto")
print(f"Actual Label: {get_diet_label_gemini(ingredients3)}\n")

# Test Case 4: Paleo (no dairy/grains/legumes, meat/veg/fruit)
ingredients4 = ["chicken breast", "sweet potato", "asparagus"]
print(f"Ingredients: {ingredients4} -> Expected: paleo")
print(f"Actual Label: {get_diet_label_gemini(ingredients4)}\n")

# Test Case 5: Gluten-Free (e.g., using specific GF flours)
ingredients5 = ["almond flour", "eggs", "sugar", "baking powder"]
print(f"Ingredients: {ingredients5} -> Expected: gluten-free")
print(f"Actual Label: {get_diet_label_gemini(ingredients5)}\n")

# Test Case 6: Dairy-Free
ingredients6 = ["chicken", "rice", "vegetables", "coconut milk"]
print(f"Ingredients: {ingredients6} -> Expected: dairy-free")
print(f"Actual Label: {get_diet_label_gemini(ingredients6)}\n")

# Test Case 7: Pescatarian
ingredients7 = ["salmon", "quinoa", "lemon"]
print(f"Ingredients: {ingredients7} -> Expected: pescatarian")
print(f"Actual Label: {get_diet_label_gemini(ingredients7)}\n")

# Test Case 8: Normal (mixed, or hard to classify)
ingredients8 = ["beef", "pasta", "cheese"] # Beef disqualifies vegan/vegetarian/pescatarian, pasta disqualifies keto/paleo
print(f"Ingredients: {ingredients8} -> Expected: normal")
print(f"Actual Label: {get_diet_label_gemini(ingredients8)}\n")

# Test Case 9: Ambiguous/Minimal (should lean towards normal unless very clear)
ingredients9 = ["water", "salt"]
print(f"Ingredients: {ingredients9} -> Expected: normal")
print(f"Actual Label: {get_diet_label_gemini(ingredients9)}\n")

# Test Case 10: Empty list
ingredients10 = []
print(f"Ingredients: {ingredients10} -> Expected: normal")
print(f"Actual Label: {get_diet_label_gemini(ingredients10)}\n")

# Test Case 11: Complex scenario that should be normal
ingredients11 = ["chicken", "shrimp", "rice", "vegetables"] # Has both poultry and seafood, not strictly pescatarian (as it implies *only* fish/seafood for meat)
print(f"Ingredients: {ingredients11} -> Expected: normal")
print(f"Actual Label: {get_diet_label_gemini(ingredients11)}\n")

# Test Case 12: Vegan with common "tricky" ingredients (model should know these are vegan)
ingredients12 = ["lentils", "nutritional yeast", "maple syrup", "avocado"]
print(f"Ingredients: {ingredients12} -> Expected: vegan")
print(f"Actual Label: {get_diet_label_gemini(ingredients12)}\n")

# Test Case 13: Vegetarian with common "tricky" ingredients
ingredients13 = ["feta cheese", "eggs", "spinach", "olives"]
print(f"Ingredients: {ingredients13} -> Expected: vegetarian")
print(f"Actual Label: {get_diet_label_gemini(ingredients13)}\n")

# Test Case 14: Gluten-free with wheat flour (should be normal)
ingredients14 = ["wheat flour", "eggs", "milk"]
print(f"Ingredients: {ingredients14} -> Expected: normal (or specific error related to GF)")
print(f"Actual Label: {get_diet_label_gemini(ingredients14)}\n")