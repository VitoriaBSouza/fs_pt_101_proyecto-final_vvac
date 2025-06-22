import google.generativeai as genai
import os
import re# Import regex for robust cleaning
 
# Make sure GEMINI_API_KEY is loaded from your .env file
# This assumes you have `python-dotenv` installed and are calling `load_dotenv()`
# at the start of your application.
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# Define the model to use
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

def get_diet_label_gemini(ingredients_list):
    """
    Classifies ingredients into all applicable diet labels using multiple, focused Gemini API calls.
    Leverages concise rules and implicit online knowledge for each diet check.
    """
    if not ingredients_list:
        return "normal"

    ingredients_text = ", ".join(ingredients_list)

    specific_valid_labels = {
        "vegan", "vegetarian", "keto", "paleo", "gluten-free",
        "dairy-free", "pescatarian"
    }

    identified_labels = []

    # Define concise, common-sense rules for each diet type
    diet_rules = {
        "vegan": "Contains NO animal products (meat, fish, dairy, eggs, honey).",
        "vegetarian": "Contains NO meat or fish. May contain dairy, eggs, honey.",
        "pescatarian": "Contains ONLY fish or seafood as animal protein. No other meat. May contain dairy, eggs.",
        "keto": "Very low carb. AVOIDS: Grains (like rice, pasta, bread), sugar, high-carb fruits, starchy vegetables (like potatoes), legumes (beans, chickpeas). Allows: Meats, fats, non-starchy veggies.",
        "paleo": "Aims for Stone Age diet. AVOIDS: Dairy, all grains (like rice), legumes, processed sugar. Allows: Meats, fish, fruits, vegetables, nuts, seeds.",
        "gluten-free": "Contains NO wheat, barley, rye (e.g., standard soy sauce is NOT GF unless specified as 'tamari' or 'GF soy sauce').",
        "dairy-free": "Contains NO milk, cheese, butter, or any other dairy products. (Note: Coconut milk IS dairy-free)."
    }

    # Iterate through each diet label and make a separate API call
    for label_type in sorted(specific_valid_labels): # Sort for consistent order of checks
        current_rule = diet_rules.get(label_type, "Check if ingredients align with typical online rules for this diet.")

        # Prompt focuses on one label, leveraging general online knowledge
        prompt = f"""
        Considering common online knowledge about diet classifications and the following rule, analyze these ingredients: "{ingredients_text}"

        **Rule for {label_type}:** {current_rule}

        Based strictly on these ingredients and the rule, is this recipe **{label_type}**?
        Answer ONLY 'yes' or 'no'.
        """
        try:
            response = model.generate_content(prompt)
            if response.candidates:
                answer = response.candidates[0].content.parts[0].text.strip().lower()
                if answer == 'yes':
                    identified_labels.append(label_type)
            else:
                # Debugging output for cases where model provides no candidates
                print(f"DEBUG: No candidate response from Gemini for '{label_type}' with ingredients: {ingredients_list}")

        except Exception as e:
            # Debugging output for API errors
            print(f"DEBUG: API error checking '{label_type}' for ingredients {ingredients_list}: {e}")
            # Continue processing other labels even if one API call fails

    # Final result compilation
    if not identified_labels:
        return "normal"
    else:
        return ",".join(sorted(set(identified_labels))) # Ensure unique labels and consistent sorting
