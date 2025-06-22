# # list_gemini_models.py
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv() # Load environment variables from .env file

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     print("Error: GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")
# else:
#     genai.configure(api_key=GEMINI_API_KEY)

#     print("Listing available Gemini models:")
#     try:
#         for m in genai.list_models():
#             if 'generateContent' in m.supported_generation_methods:
#                 print(f"  Model Name: {m.name}")
#                 print(f"  Description: {m.description}")
#                 print(f"  Supported Methods: {m.supported_generation_methods}")
#                 print("-" * 30)
#     except Exception as e:
#         print(f"An error occurred while listing models: {e}")

# test_gemini_labels.py
import os
from dotenv import load_dotenv
from api.gemini_utils import get_diet_label_gemini # Adjust this import based on your file structure

# Load environment variables
load_dotenv()

# test_gemini_labels.py
import os
from dotenv import load_dotenv
from api.gemini_utils import get_diet_label_gemini # Adjust this import path

load_dotenv()

print("--- Testing Diet Labeling with Refined Prompt (Keto & Dairy-Free Focus) ---")

# --- Test Case 1: Dairy-Free Coconut Curry (your problematic example) ---
# Ingredients: chicken, onions, spices, coconut milk, rice
# Analysis:
# - Dairy-Free: Yes (coconut milk, no dairy)
# - Gluten-Free: Yes (all ingredients are typically GF)
# - Keto: NO (rice disqualifies)
# - Paleo: NO (rice disqualifies)
# - Vegan/Vegetarian/Pescatarian: NO (chicken)
ingredients_df_curry = ["chicken", "onions", "spices", "coconut milk", "rice"]
print(f"Ingredients: {ingredients_df_curry} -> Expected: dairy-free,gluten-free")
print(f"Actual Label: {get_diet_label_gemini(ingredients_df_curry)}\n")

# --- Test Case 2: Keto Chicken Stir Fry (previous problematic keto example) ---
# Ingredients: chicken, bell pepper, zucchini, soy sauce
# Analysis:
# - Keto: Yes (chicken, non-starchy veggies, soy sauce in moderation is often accepted)
# - Paleo: Yes (chicken, veggies)
# - Gluten-Free: NO (standard soy sauce contains wheat)
# - Dairy-Free: Yes
ingredients_stir_fry = ["chicken", "bell pepper", "zucchini", "soy sauce"]
print(f"Ingredients: {ingredients_stir_fry} -> Expected: dairy-free,keto,paleo")
print(f"Actual Label: {get_diet_label_gemini(ingredients_stir_fry)}\n")

# --- Test Case 3: Clearly Keto, also GF/DF/Vegetarian (example with dairy) ---
# Ingredients: eggs, avocado, spinach, butter
# Analysis:
# - Keto: Yes (eggs, avocado, butter, spinach)
# - Gluten-Free: Yes
# - Vegetarian: Yes (eggs, no meat)
# - Dairy-Free: NO (butter is dairy)
# - Vegan: NO (eggs, butter)
ingredients_keto_egg = ["eggs", "avocado", "spinach", "butter"]
print(f"Ingredients: {ingredients_keto_egg} -> Expected: keto,gluten-free,vegetarian")
print(f"Actual Label: {get_diet_label_gemini(ingredients_keto_egg)}\n")

# --- Test Case 4: Something explicitly NOT keto (due to rice/potatoes) ---
# Ingredients: chicken, rice, potatoes
# Analysis:
# - Keto: NO (rice, potatoes disqualify)
# - Paleo: NO (rice, potatoes disqualify)
# - Gluten-Free: Yes (chicken, rice, potatoes are GF)
# - Dairy-Free: Yes (no dairy)
ingredients_not_keto = ["chicken", "rice", "potatoes"]
print(f"Ingredients: {ingredients_not_keto} -> Expected: dairy-free,gluten-free")
print(f"Actual Label: {get_diet_label_gemini(ingredients_not_keto)}\n")

# --- Test Case 5: Vegan, also GF/DF ---
# Ingredients: chickpeas, coconut milk, spinach, rice, curry paste
# Analysis:
# - Vegan: Yes
# - Vegetarian: Yes
# - Dairy-Free: Yes (coconut milk)
# - Gluten-Free: Yes (if curry paste is GF, which is common)
# - Keto: NO (chickpeas, rice disqualify)
# - Paleo: NO (chickpeas, rice disqualify)
ingredients_vegan_curry = ["chickpeas", "coconut milk", "spinach", "rice", "curry paste"]
print(f"Ingredients: {ingredients_vegan_curry} -> Expected: dairy-free,gluten-free,vegan,vegetarian")
print(f"Actual Label: {get_diet_label_gemini(ingredients_vegan_curry)}\n")

# --- Test Case 6: Standard dish, likely 'normal' ---
# Ingredients: beef, pasta, cheese
# Analysis:
# - Keto/Paleo: NO (pasta)
# - Vegan/Vegetarian/Pescatarian: NO (beef)
# - Gluten-Free: NO (pasta)
# - Dairy-Free: NO (cheese)
ingredients_mixed = ["beef", "pasta", "cheese"]
print(f"Ingredients: {ingredients_mixed} -> Expected: normal")
print(f"Actual Label: {get_diet_label_gemini(ingredients_mixed)}\n")

# --- Test Case 7: Gluten-Free Stir Fry (with explicit tamari) ---
# Ingredients: chicken, bell pepper, zucchini, tamari
# Analysis:
# - Keto: Yes
# - Paleo: Yes
# - Gluten-Free: Yes (tamari is GF soy sauce)
# - Dairy-Free: Yes
ingredients_gf_stir_fry = ["chicken", "bell pepper", "zucchini", "tamari"]
print(f"Ingredients: {ingredients_gf_stir_fry} -> Expected: dairy-free,gluten-free,keto,paleo")
print(f"Actual Label: {get_diet_label_gemini(ingredients_gf_stir_fry)}\n")