from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, DateTime, func, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum

db = SQLAlchemy()

class UserStatus(enum.Enum): 
    active = "active"
    suspended = "suspended"
    deleted = "deleted"

class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)  # guarda como texto plano hasta que se hashee
    status: Mapped[UserStatus] = mapped_column(Enum(UserStatus), default=UserStatus.active, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

    #Relatioship with other tables
    score: Mapped[list["RecipeScore"]] = relationship(back_populates="user")
    comments: Mapped[list["Comment"]] = relationship(back_populates="user")
    collection: Mapped[list["Collection"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "status": self.status.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            # No se serializa la contraseña
        }
    
class Comment(db.Model):
    __tablename__ = 'comments'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    recipe_id: Mapped[int] = mapped_column(ForeignKey('recipes.id'), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    #Relatioship with other tables
    user: Mapped["User"] = relationship(back_populates="comments")
    recipe: Mapped["Recipe"] = relationship(back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "username": self.user.username,
            "content": self.content,
            "timestamp": self.published.isoformat() if self.published else None
        }

class DifficultyType(enum.Enum):
    # Requires little to basic cooking skills and common ingredients.
    EASY = "easy"
    # Requires more experience, more prep and cooking time.
    # Maybe some ingredients you don’t already have in your kitchen.
    MODERATE = "moderate"
    # Challenging recipes that require more advanced skills, experience and maybe some special equipment.
    HARD = "hard"
    
class Recipe(db.Model):
    __tablename__='recipes'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    difficulty_type: Mapped[DifficultyType] = mapped_column(Enum(DifficultyType), nullable=False)
    prep_time: Mapped[int] = mapped_column(nullable=True) #In minutes(covertion made at the frontend)
    steps: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    #Relatioship with other tables
    media: Mapped[list["Media"]] = relationship(back_populates="recipe")
    score: Mapped[list["RecipeScore"]] = relationship(back_populates="recipe")
    ingredients: Mapped[list["RecipeIngredient"]] = relationship(back_populates="recipe") #cambio de ingredient a ingredients por reutilizacion en distintas recetas
    comments: Mapped[list["Comment"]] = relationship(back_populates="recipe")
    collection: Mapped[list["Collection"]] = relationship(back_populates="recipe")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "media": [media.serialize() for media in self.media],
            "dificulty_type": self.difficulty_type.value,
            "prep_time": self.prep_time,
            "steps": self.steps,
            "published": self.published.isoformat() if self.published else None
        }
    
class RecipeScore(db.Model):
    __tablename__='recipe_scores'

    user_id: Mapped["User"] = mapped_column(ForeignKey("users.id"), primary_key=True)
    recipe_id: Mapped["Recipe"] = mapped_column(ForeignKey("recipes.id"), primary_key=True)
    score: Mapped[int] = mapped_column(nullable=True) #On frontend we make the calculation for final score
    
    #Relatioship with other tables
    user: Mapped["User"] = relationship(back_populates="score")
    recipe: Mapped["Recipe"] = relationship(back_populates="score")

    def serialize(self):
        return {
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "score": self.score
        } 
    
class MediaType(enum.Enum):
    IMAGE = "image"

class Media(db.Model):
    __tablename__='medias'

    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"))
    type_media: Mapped[MediaType] = mapped_column(Enum(MediaType), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)

    #Relatioship with other tables
    recipe: Mapped["Recipe"] = relationship(back_populates="media")
    
    def serialize(self):
        return {
            "id": self.id,
            "type": self.type_media.value,
            "link": self.url
        }
    
class Collection(db.Model):
    __tablename__ = 'collections'

    recipe_id: Mapped["Recipe"] = mapped_column(ForeignKey("recipes.id"), primary_key=True)
    user_id: Mapped["User"] = mapped_column(ForeignKey("users.id"), primary_key=True)

    #Relatioship with other tables
    user: Mapped["User"] = relationship(back_populates="collection")
    recipe: Mapped["Recipe"] = relationship(back_populates="collection")

    def serialize(self):
        return {
            "recipe_id": self.recipe_id,
            "user_id": self.user_id,
        }

class Ingredient(db.Model):
    __tablename__='ingredients'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    #Relatioship with other tables
    recipes: Mapped[list["RecipeIngredient"]] = relationship(back_populates="ingredient") #cambio recipe_ingredient por recipes para reutilizacion de ingredientes

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        } 
    
class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'

    recipe_id: Mapped[Recipe] = mapped_column(ForeignKey("recipes.id"), primary_key=True)
    ingredient_id: Mapped[Ingredient] = mapped_column(ForeignKey("ingredients.id"), primary_key=True)

    #Quantity and unit goes here as it will depend on the recipe
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False) #opciones en frontend

    #Relatioship with other tables
    recipe: Mapped["Recipe"] = relationship(back_populates="ingredient")
    ingredient: Mapped["Ingredient"] = relationship(back_populates="recipe_ingredient")

    def serialize(self):
        return {
            "recipe_id": self.recipe_id,
            "ingredient_id": self.ingredient_id,
            "ingredient_name": self.ingredient.name,
            "quantity": self.quantity,
            "unit": self.unit
        } 