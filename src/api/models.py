from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    photos: Mapped[list["Photo"]] = relationship("Photo", back_populates="user")

    def __str__(self):
        return self.email

    def serialize(self):
        return {"id": self.id, "email": self.email}


class Photo(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="photos")
    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="photo", cascade="all, delete-orphan")


class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    photo_id: Mapped[int] = mapped_column(ForeignKey('photo.id'), nullable=False)

    photo: Mapped["Photo"] = relationship("Photo", back_populates="comments")
