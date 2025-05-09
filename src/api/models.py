from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from typing import List, Optional

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    reportes: Mapped[List["Reporte"]] = relationship("Reporte", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
    
class Reporte(db.Model):
    __tablename__ = "reportes"
    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    author_id = relationship('User', back_populates='reportes')

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "author": self.author_id
        }
    
class Media(db.Model):
    __tablename__ = "medias"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[enumerate] = mapped_column(String(120), unique=True, nullable=False)
    image: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    post_id = relationship('Media', back_populates='reportes')

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "image": self.image,
            "post_id": self.post_id
        }
    
# class Favorites(db.Model):
#     __tablename__ = 'favorites'
    
#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    
#     user: Mapped["User"] = relationship("User", back_populates="favorites")
#     reporte: Mapped[Optional["Reporte"]] = relationship("Reporte", back_populates="favorites")  

#     def serialize(self):
#         return {
#             "id": self.id,
#             "user_id": self.user_id,
#             "person_id": self.reporte
#         }
    
# class Comments(db.Model):
#     __tablename__ = 'comments'
    
#     id: Mapped[int] = mapped_column(primary_key=True)
#     comment_text: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
#     votos: Mapped[bool] = mapped_column(unique=True, nullable=False)
#     user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
#     post_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)


#     def serialize(self):
#         return {
#             "id": self.id,
#             "user_id": self.user_id,
#             "person_id": self.reporte
#         }