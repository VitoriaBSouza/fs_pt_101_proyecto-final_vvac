import os
import requests

API_LEAGUE_BASE_URL = "https://api.apileague.com/search-recipes"
API_LEAGUE_KEY = os.getenv("API_LEAGUE_KEY")

def filter_recipes_by_diet(diet_type, query=None):
    params = {
        "api-key": API_LEAGUE_KEY,
        "diet": diet_type,
        "number": 5  # number of recipes to return
    }
    if query:
        params["query"] = query

    try:
        response = requests.get(API_LEAGUE_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"API error: {e}")
        return None

# Example usage
result = filter_recipes_by_diet("vegan", "salad")
print(result)
