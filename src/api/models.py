from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)  # Firebase UID
    fullname: Mapped[str] = mapped_column(String(300), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    profile_picture: Mapped[str] = mapped_column(String(300), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    reportes: Mapped[List["Reporte"]] = relationship("Reporte", back_populates="author")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="author")
    favorites: Mapped[List["Favorite"]] = relationship("Favorite", back_populates="user")
    votes: Mapped[List["Vote"]] = relationship("Vote", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "fullname": self.fullname,
            "firebase_uid": self.user_id,
            "email": self.email,
            "propile_picture": self.profile_picture,
            "isActive": self.is_active
        }
    
class Reporte(db.Model):
    __tablename__ = "reportes"

    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(String(200), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    author: Mapped["User"] = relationship("User", back_populates="reportes")
    images: Mapped[List["Media"]] = relationship("Media", back_populates="reporte", cascade="all, delete-orphan")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="reporte", cascade="all, delete-orphan")
    favorites: Mapped[List["Favorite"]] = relationship("Favorite", back_populates="reporte", cascade="all, delete-orphan")
    votes: Mapped[List["Vote"]] = relationship("Vote", back_populates="reporte", cascade="all, delete-orphan")

    
    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "author_id": self.author_id,
            "author": self.author.serialize() if self.author else None,
            "images": [image.serialize() for image in self.images],
            "comments": [comment.serialize() for comment in self.comments],
            "favorites_count": len(self.favorites),
            "votes": [{"user_id": vote.user_id, "is_upvote": vote.is_upvote} for vote in self.votes]
        }


class Media(db.Model):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(20), default="image")
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id"), nullable=False)

    reporte: Mapped["Reporte"] = relationship("Reporte", back_populates="images")

    def serialize(self):
        return {
                "id": self.id,
                "reporte_id": self.reporte_id, 
                "type": self.type, 
                "image": self.image
                }


class Comment(db.Model):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    comment_text: Mapped[str] = mapped_column(String(200), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id"), nullable=False)

    author: Mapped["User"] = relationship("User", back_populates="comments")
    reporte: Mapped["Reporte"] = relationship("Reporte", back_populates="comments")

    def serialize(self):
        return {
                "id": self.id, 
                "comment_text": self.comment_text
                }


class Favorite(db.Model):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="favorites")
    reporte: Mapped["Reporte"] = relationship("Reporte", back_populates="favorites")


class Vote(db.Model):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id"), nullable=False)
    is_upvote: Mapped[bool] = mapped_column(nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="votes")
    reporte: Mapped["Reporte"] = relationship("Reporte", back_populates="votes")

