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
