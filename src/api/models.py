from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, DateTime, func, ForeignKey, Text
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
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)  # guarda como texto plano hasta que se hashee
    status: Mapped[UserStatus] = mapped_column(Enum(UserStatus), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now()) # 
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

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
    # recipe_id: Mapped[int] = mapped_column(ForeignKey('recipe.id'), nullable=False)
    username: Mapped[str] = mapped_column(ForeignKey('users.username'), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relaciones
    #user = relationship("User", backref="comments", lazy=True)
    #recipe = relationship("Recipe", backref="comments", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            #"recipe_id": self.recipe_id,
            "username": self.username,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
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
    recipe: Mapped["Recipe"] = relationship(back_populates=""media"")
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