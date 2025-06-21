import os
import requests
from datetime import datetime, timezone
from sqlalchemy import func
from api.models import GeminiUsage, Recipe, db

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
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
    if recipe.diet_label:  # Already labeled
        return recipe.diet_label

    full_text = f"{recipe.title}\n\nSteps:\n{recipe.steps}"
    for ri in recipe.ingredients:
        full_text += f"\nIngredient: {ri.quantity} {ri.unit} {ri.ingredient.name}"

    tokens_needed = estimate_tokens(full_text)
    if (get_gemini_token_usage() + tokens_needed) > MAX_DAILY_TOKENS:
        return "Unknown"  # Skip to avoid charges

    payload = {
        "contents": [{
            "parts": [{"text": f"What diet is this recipe? Be concise: vegan, vegetarian, keto, etc. If unclear, say 'Unknown'.\n\n{full_text}"}]
        }]
    }

    response = requests.post(
        f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}",
        json=payload
    )

    if not response.ok:
        return "Unknown"

    result = response.json()
    try:
        message = result["candidates"][0]["content"]["parts"][0]["text"]
        diet_type = message.strip().split()[0].capitalize()
    except (KeyError, IndexError):
        diet_type = "Unknown"

    # **Set diet_label on the passed recipe instance but DO NOT commit here**
    recipe.diet_label = diet_type

# Add to post and put method:
# analyze_diet_type(new_recipe)

# Add diet_type to Recipe table

# Add table to track token and avoid charges
# class GeminiUsage(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     date = db.Column(db.Date, default=datetime.utcnow().date, unique=True)
#     tokens_used = db.Column(db.Integer, default=0)