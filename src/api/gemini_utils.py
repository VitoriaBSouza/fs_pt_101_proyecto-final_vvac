import google.generativeai as genai
import os
import re # Import regex for robust cleaning

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
model = genai.GenerativeModel('gemini-pro')

def get_diet_label_gemini(ingredients_list):
    """
    Classifies a list of ingredients into a single diet label using the Gemini API.

    Args:
        ingredients_list (list): A list of strings, where each string is an ingredient name.

    Returns:
        str: The diet label (e.g., 'vegan', 'vegetarian', 'keto', 'normal'),
             or 'normal' if an error occurs or no specific label applies.
    """
    if not ingredients_list:
        return "normal" # No ingredients, can't classify

    # Convert the list of ingredients to a comma-separated string for the prompt
    ingredients_text = ", ".join(ingredients_list)

    # Define the precise set of valid labels
    valid_labels = {
        "vegan", "vegetarian", "keto", "paleo", "gluten-free",
        "dairy-free", "pescatarian", "normal"
    }

    # The enhanced prompt for Gemini
    prompt_message = f"""
    Analyze the following list of raw ingredients and classify the dish into ONE single, most appropriate diet label from the allowed list.

    **Allowed Diet Labels (Return ONLY ONE of these words, lowercase):**
    {", ".join(sorted(valid_labels))}

    **Rules:**
    1.  **Strict Ingredient Analysis:** Base the label *strictly* on the ingredients provided. Do NOT make assumptions about preparation methods, hidden ingredients (like oils not listed), or cross-contamination.
    2.  **No Extraneous Text:** Return *only* the single diet label word. Do NOT include explanations, punctuation, or any other text.
    3.  **Hierarchy/Specificity:** Prioritize the most restrictive label that applies. For example, if it's vegan, it's also vegetarian, but prefer 'vegan'.
        * **Vegan:** Contains NO animal products (meat, poultry, fish, dairy, eggs, honey, gelatin, etc.).
        * **Vegetarian:** Contains NO meat, poultry, or fish. May contain dairy, eggs, or honey.
        * **Pescatarian:** Contains fish/seafood. May contain dairy, eggs. No other meat/poultry.
        * **Keto:** High fat, adequate protein, very low carb. Look for common keto ingredients (e.g., meat, fish, eggs, high-fat dairy, low-carb vegetables, avocados, nuts, seeds). AVOID grains, sugars, high-carb fruits/vegetables, legumes.
        * **Paleo:** Focuses on foods available to Stone Age humans. Look for lean meats, fish, fruits, vegetables, nuts, seeds. AVOID dairy, grains, legumes, processed foods, refined sugar, certain vegetable oils.
        * **Gluten-Free:** Contains NO wheat, barley, rye, or derivatives.
        * **Dairy-Free:** Contains NO dairy products (milk, cheese, yogurt, butter, whey, casein, lactose).
        * **Normal:** If none of the above labels strictly apply, or if it contains ingredients that disqualify it from specific categories (e.g., a dish with both chicken and fish would be 'normal' from a "pescatarian" perspective, but might be "paleo" or simply "normal" if no other specific label applies). This is the default if no other label fits perfectly.

    **Ingredients to Analyze:**
    {ingredients_text}

    **Your single word diet label:**
    """
    
    try:
        # Using generate_content directly as it's often simpler for single-turn prompts
        response = model.generate_content(prompt_message)
        
        # Access the text from the response
        if response.candidates:
            raw_label = response.candidates[0].content.parts[0].text.strip().lower()
            
            # Clean the label to ensure it's a single word and matches
            # Use regex to find only alphabetic characters and hyphens, allowing for "gluten-free" or "dairy-free"
            cleaned_label = re.sub(r'[^a-z-]', '', raw_label).strip()

            if cleaned_label in valid_labels:
                print(f"Gemini raw response: '{raw_label}' -> Cleaned label: '{cleaned_label}'")
                return cleaned_label
            else:
                print(f"Gemini returned an invalid label: '{raw_label}'. Defaulting to 'normal'.")
                return "normal"
        else:
            print(f"Gemini response had no candidates. Raw response: {response}")
            return "normal"

    except Exception as e:
        print(f"Gemini API error during diet labeling: {e}")
        # Optionally, print more detailed error info: print(response.prompt_feedback)
        return "normal"