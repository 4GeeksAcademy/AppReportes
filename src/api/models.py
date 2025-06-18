from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    fullname: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    profile_picture: Mapped[str] = mapped_column(String(300), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    is_moderator: Mapped[bool] = mapped_column(Boolean, default=False)

    reportes = relationship("Reporte", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="user", cascade="all, delete-orphan")

    denuncias_realizadas = relationship(
        "Denuncia",
        foreign_keys="[Denuncia.denunciante_id]",
        back_populates="denunciante",
        cascade="all, delete-orphan"
    )
    denuncias_recibidas = relationship(
        "Denuncia",
        foreign_keys="[Denuncia.denunciado_id]",
        back_populates="denunciado",
        cascade="all, delete-orphan"
    )

    sanciones = relationship("Sancion", back_populates="user", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "fullname": self.fullname,
            "firebase_uid": self.user_id,
            "email": self.email,
            "profile_picture": self.profile_picture,
            "isActive": self.is_active,
            "is_moderator": self.is_moderator
        }

class Reporte(db.Model):
    __tablename__ = "reportes"

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)
    text: Mapped[str] = mapped_column(String(200), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    author = relationship("User", back_populates="reportes")
    images = relationship("Media", back_populates="reporte", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="reporte", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="reporte", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="reporte", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
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
    image: Mapped[str] = mapped_column(String(500), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id", ondelete="CASCADE"), nullable=False)

    reporte = relationship("Reporte", back_populates="images")

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
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id", ondelete="CASCADE"), nullable=False)

    author = relationship("User", back_populates="comments")
    reporte = relationship("Reporte", back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "comment_text": self.comment_text,
            "usuario": {
                "id": self.author_id,
                "fullname": self.author.fullname if self.author else None
            } if self.author else None,
        }

class Favorite(db.Model):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="favorites")
    reporte = relationship("Reporte", back_populates="favorites")

class Vote(db.Model):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id", ondelete="CASCADE"), nullable=False)
    is_upvote: Mapped[bool] = mapped_column(nullable=False)

    user = relationship("User", back_populates="votes")
    reporte = relationship("Reporte", back_populates="votes")

class Denuncia(db.Model):
    __tablename__ = "denuncias"

    id: Mapped[int] = mapped_column(primary_key=True)

    denunciante_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    denunciado_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    reporte_id: Mapped[int] = mapped_column(ForeignKey("reportes.id", ondelete="CASCADE"), nullable=False)
    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)

    motivo: Mapped[str] = mapped_column(Text, nullable=False)
    created_at = mapped_column(db.DateTime, server_default=db.func.now())

    denunciante = relationship("User", foreign_keys=[denunciante_id], back_populates="denuncias_realizadas")
    denunciado = relationship("User", foreign_keys=[denunciado_id], back_populates="denuncias_recibidas")

    reporte = relationship("Reporte", passive_deletes=True)
    comment = relationship("Comment", passive_deletes=True)

    def serialize(self):
        return {
            "id": self.id,
            "denunciante_id": self.denunciante_id,
            "denunciante_fullname": self.denunciante.fullname if self.denunciante else None,
            "denunciado_id": self.denunciado_id,
            "denunciado_fullname": self.denunciado.fullname if self.denunciado else None,
            "user_id": self.denunciado.id if self.denunciado else None,
            "reporte_id": self.reporte_id,
            "reporte_titulo": self.reporte.titulo if self.reporte else None,
            "comment_id": self.comment_id,
            "comment_text": self.comment.comment_text if self.comment else None,
            "motivo": self.motivo,
            "created_at": self.created_at.isoformat()
        }

class Sancion(db.Model):
    __tablename__ = "sanciones"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    fullname: Mapped[str] = mapped_column(String(120), nullable=False)
    motivo: Mapped[str] = mapped_column(Text, nullable=False)
    created_at = mapped_column(db.DateTime, server_default=db.func.now())

    user = relationship("User", back_populates="sanciones")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "motivo": self.motivo,
            "fullname": self.fullname,
            "fecha_inicio": self.created_at.isoformat(),
            "mail": self.user.email if self.user else None
        }

class Eliminado(db.Model):
    __tablename__ = "eliminados"

    id: Mapped[int] = mapped_column(primary_key=True)
    fullname: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    motivo: Mapped[str] = mapped_column(Text, nullable=False)
    created_at = mapped_column(db.DateTime, server_default=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "fullname": self.fullname,
            "email": self.email,
            "motivo": self.motivo,
            "created_at": self.created_at.isoformat()
        }
