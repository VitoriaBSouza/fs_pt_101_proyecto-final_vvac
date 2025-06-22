from werkzeug.security import generate_password_hash
from random import randint, choice, uniform
<<<<<<< HEAD
from api.models import User, Recipe, Ingredient, RecipeIngredient, Comment, Media, Collection, RecipeScore, ShoppingListItem, UserStatus, DifficultyType, MediaType
=======
from api.models import (
    User, Recipe, Ingredient, RecipeIngredient, Comment, Media,
    Collection, RecipeScore, ShoppingListItem, UserStatus, DifficultyType, MediaType
)
from app import app, db
import os
>>>>>>> 39ce49373115be8059f1a59905890fe823598adf
from dotenv import load_dotenv

load_dotenv()
<<<<<<< HEAD
from app import app, db
print("Using DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])
=======
>>>>>>> 39ce49373115be8059f1a59905890fe823598adf

with app.app_context():
    # Reset DB
    db.drop_all()

    print("DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])
    db.create_all()

    # Create Users
    users = [
        User(
            username=f"user{i+1}",
            email=f"user{i+1}@mail.com",
            password=generate_password_hash('user123'),
            status=UserStatus.active,
        ) for i in range(3)
    ]
    db.session.add_all(users)
    db.session.commit()  # commit to get user IDs

    # Create Ingredients with allergens
    ingredient_names = ["Harina", "Leche", "Huevo", "Azúcar", "Sal", "Aceite", "Tomate", "Queso", "Pollo", "Cebolla"]
    allergens_list = ["gluten", "lactose", "", "", "", "", "", "lactose", "", ""]
    ingredients = [
        Ingredient(name=ingredient_names[i], allergens=allergens_list[i])
        for i in range(len(ingredient_names))
    ]
    db.session.add_all(ingredients)
    db.session.commit()  # commit to get ingredient IDs

    # Create Recipes
    recipes = []
    for i in range(10):
        recipe = Recipe(
            author=choice(users).id,
            title=f"Receta {i+1}",
            difficulty_type=choice(list(DifficultyType)),
            portions=randint(1, 6),
            prep_time=randint(10, 60),
            steps=f"Paso 1 de la receta {i+1}. Paso 2 de la receta {i+1}."
        )
        recipes.append(recipe)
    db.session.add_all(recipes)
    db.session.commit()  # commit to get recipe IDs

    # Create RecipeIngredients: 10 ingredients per recipe, no repeats
    recipe_ingredients = []
    for recipe in recipes:
        used_ids = set()
        for _ in range(10):
            ing = choice(ingredients)
            while ing.id in used_ids:
                ing = choice(ingredients)
            used_ids.add(ing.id)

            ri = RecipeIngredient(
                recipe_id=recipe.id,
                ingredient_id=ing.id,
                quantity=round(uniform(10, 500), 2),
                unit="g",
                calories=round(uniform(10, 300), 2),
                fat=round(uniform(0, 20), 2),
                saturated_fat=round(uniform(0, 10), 2),
                carbs=round(uniform(0, 50), 2),
                sugars=round(uniform(0, 20), 2),
                fiber=round(uniform(0, 10), 2),
                protein=round(uniform(0, 30), 2),
                salt=round(uniform(0, 5), 2),
                sodium=round(uniform(0, 2), 2)
            )
            recipe_ingredients.append(ri)
    db.session.add_all(recipe_ingredients)
    db.session.commit()

    # Create Media (1 per recipe)
    medias = [
        Media(
            recipe_id=recipe.id,
            type_media=MediaType.IMAGE,
            url="https://loremflickr.com/400/400/food"
        ) for recipe in recipes
    ]
    db.session.add_all(medias)
    db.session.commit()

    # Create Comments (1 per recipe)
    comments = [
        Comment(
            user_id=choice(users).id,
            recipe_id=recipe.id,
            content=f"Comentario sobre la receta {recipe.id}"
        ) for recipe in recipes
    ]
    db.session.add_all(comments)
    db.session.commit()

    # Create RecipeScores (1 per recipe)
    scores = [
        RecipeScore(
            user_id=choice(users).id,
            recipe_id=recipe.id,
            score=randint(1, 5)
        ) for recipe in recipes
    ]
    db.session.add_all(scores)
    db.session.commit()

    # Create Collections (1 per recipe)
    collections = [
        Collection(
            user_id=choice(users).id,
            recipe_id=recipe.id
        ) for recipe in recipes
    ]
    db.session.add_all(collections)
    db.session.commit()

    # Create ShoppingListItems
    shopping_items = [
        ShoppingListItem(
            user_id=choice(users).id,
            ingredient_name=choice(ingredient_names),
            total_quantity=round(uniform(100, 1000), 2),
            unit="g"
        ) for _ in range(10)
    ]
    db.session.add_all(shopping_items)
    db.session.commit()

    print("Seeder executed successfully.")
