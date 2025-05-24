from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class DificultyType(enum.Enum):
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
    dificulty_type: Mapped[DificultyType] = mapped_column(Enum(DificultyType), nullable=False)
    prep_time: Mapped[int] = mapped_column(nullable=True) #In minutes(covertion made at the frontend)
    steps: Mapped[str] = mapped_column(Text, nullable=False)

    #Relatioship with other tables
    medias: Mapped[list["Media"]] = relationship(back_populates="recipe")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "dificulty_type": self.dificulty_type.value,
            "prep_time": self.prep_time,
            "steps": self.steps,
            "media": self.medias
        } 

class MediaType(enum.Enum):
    IMAGE = "image"

class Media(db.Model):
    __tablename__='medias'
    id: Mapped[int] = mapped_column(primary_key=True)
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


class Ingredient(db.Model):
    __tablename__='ingredients'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False) #opciones en frontend

    def serialize(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "unit": self.unit,
            "name": self.name
        } 

