from dotenv import load_dotenv
import os

load_dotenv() 
import requests
from datetime import datetime, timezone
from sqlalchemy import func
from api.models import GeminiUsage, Recipe, db

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY not found in environment variables.")

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

MAX_DAILY_TOKENS = 400_000  # 400k tokens/day cap (approx. safe under free tier)


def estimate_tokens(text):
    # Approx 0.75 words/token
    return int(len(text.split()) * 1.33)


def get_gemini_token_usage():
    today = datetime.utcnow().date()
    usage = db.session.query(GeminiUsage).filter_by(date=today).first()
    return usage.tokens_used if usage else 0


def update_gemini_token_usage(tokens_used):
    today = datetime.utcnow().date()
    usage = db.session.query(GeminiUsage).filter_by(date=today).first()
    if not usage:
        usage = GeminiUsage(date=today, tokens_used=0)
        db.session.add(usage)
    usage.tokens_used += tokens_used
    db.session.commit()

def track_gemini_usage(feature_name: str, user_id: int | None) -> None:
    usage = db.session.query(GeminiUsage).filter_by(user_id=user_id, feature_name=feature_name).one_or_none()

    if usage:
        usage.usage_count += 1
        usage.last_used = datetime.now(timezone.utc)
    else:
        usage = GeminiUsage(
            user_id=user_id,
            feature_name=feature_name,
            usage_count=1,
            last_used=func.now()
        )
        db.session.add(usage)
    db.session.flush()


def analyze_diet_type(recipe: Recipe):
    if recipe.diet_label:
        return recipe.diet_label

    # Build a clear ingredient list text for Gemini
    ingredient_lines = []
    for ri in recipe.ingredients:
        ingredient_lines.append(f"{ri.quantity} {ri.unit} {ri.ingredient.name}")
    ingredients_text = "\n".join(ingredient_lines)

    prompt = (
        "Classify the diet of this recipe based on the ingredients only.\n"
        "Respond using ONE word: vegan, vegetarian, keto, paleo, gluten-free, dairy-free, pescatarian, or normal.\n\n"
        "Examples:\n"
        "Ingredients: chickpeas, olive oil, spinach → vegan\n"
        "Ingredients: salmon, dill, lemon → pescatarian\n"
        "Ingredients: bacon, eggs, cheese → normal\n\n"
        f"Ingredients:\n{ingredients_text}\n\n"
        "Diet:"
    )

    tokens_needed = estimate_tokens(prompt)
    if (get_gemini_token_usage() + tokens_needed) > MAX_DAILY_TOKENS:
        return "Normal"  # fallback to Normal to avoid charges

    ingredients_text = "\n".join(
    f"{ri.quantity} {ri.unit} {ri.ingredient.name}" for ri in recipe.ingredients
)

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }


    response = requests.post(
        f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}",
        json=payload
    )
    if not response.ok:
        return "Normal"

    result = response.json()
    try:
        message = result["candidates"][0]["content"]["parts"][0]["text"].lower()
        if "vegan" in message:
            diet_type = "Vegan"
        elif "vegetarian" in message:
            diet_type = "Vegetarian"
        elif "keto" in message:
            diet_type = "Keto"
        elif "paleo" in message:
            diet_type = "Paleo"
        elif "gluten-free" in message or "gluten free" in message:
            diet_type = "Gluten-Free"
        elif "dairy-free" in message or "dairy free" in message:
            diet_type = "Dairy-Free"
        elif "pescatarian" in message:
            diet_type = "Pescatarian"
        else:
            diet_type = "Normal"
    except (KeyError, IndexError):
        diet_type = "Standard"

    recipe.diet_label = diet_type
    return diet_type

# Add to post and put method:
# analyze_diet_type(new_recipe)

# Add diet_type to Recipe table

# Add table to track token and avoid charges
# class GeminiUsage(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     date = db.Column(db.Date, default=datetime.utcnow().date, unique=True)
#     tokens_used = db.Column(db.Integer, default=0)