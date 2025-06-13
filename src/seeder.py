from app import app, db
from api.models import User, Reporte, Media, Comment, Favorite, Vote, Denuncia, Sancion
from faker import Faker
import random

faker = Faker()

with app.app_context():
    db.drop_all()
    db.create_all()

    users = []
    for _ in range(10):
        user = User(
            user_id=faker.uuid4(),
            fullname=faker.name(),
            email=faker.unique.email(),
            profile_picture=faker.image_url(),
            is_active=True,
            is_moderator=random.choice([True, False])
        )
        db.session.add(user)
        users.append(user)

    db.session.commit()

    reportes = []
    for i in range(10):
        reporte = Reporte(
            titulo=faker.sentence(nb_words=5),  # NUEVO CAMPO
            text=faker.text(max_nb_chars=150),
            author_id=random.choice(users).id
        )
        db.session.add(reporte)
        reportes.append(reporte)

    db.session.commit()

    medias = []

    # ✅ Asegurar al menos una imagen por reporte
    for reporte in reportes:
        width = random.randint(400, 800)
        height = random.randint(300, 600)
        image = f"https://loremflickr.com/{width}/{height}/city"
        media = Media(
            type="image",
            image=image,
            reporte_id=reporte.id
        )
        db.session.add(media)
        medias.append(media)

    # 🔁 (Opcional) Añadir más imágenes aleatorias extra
    for _ in range(5):
        width = random.randint(400, 800)
        height = random.randint(300, 600)
        image = f"https://loremflickr.com/{width}/{height}/nature"
        media = Media(
            type="image",
            image=image,
            reporte_id=random.choice(reportes).id
        )
        db.session.add(media)
        medias.append(media)


    db.session.commit()


    comments = []
    for i in range(10):
        comment = Comment(
            comment_text=faker.sentence(),
            author_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id
        )
        db.session.add(comment)
        comments.append(comment)

    db.session.commit()

    favorites = []
    for i in range(10):
        favorite = Favorite(
            user_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id
        )
        db.session.add(favorite)
        favorites.append(favorite)

    db.session.commit()

    votes = []
    for i in range(10):
        vote = Vote(
            user_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id,
            is_upvote=random.choice([True, False])
        )
        db.session.add(vote)
        votes.append(vote)

    db.session.commit()

    denuncias = []
    for i in range(10):
        denunciante = random.choice(users)
        denunciado = random.choice([u for u in users if u.id != denunciante.id])
        denuncia = Denuncia(
            denunciante_id=denunciante.id,
            denunciado_id=denunciado.id,
            reporte_id=random.choice(reportes).id if random.choice([True, False]) else None,
            comment_id=random.choice(comments).id if random.choice([True, False]) else None,
            motivo=faker.text(),
            status=random.choice(["pendiente", "revisado", "descartado"])
        )
        db.session.add(denuncia)
        denuncias.append(denuncia)

    db.session.commit()

    sanciones = []
    for i in range(10):
        user = random.choice(users)
        sancion = Sancion(
            user_id=user.id,
            motivo=faker.text(),
            tipo=random.choice(["bloqueo", "advertencia"]),
            fecha_fin=faker.future_datetime(end_date="+30d")
        )
        db.session.add(sancion)
        sanciones.append(sancion)

    db.session.commit()
    print("Base de datos sembrada correctamente con datos de prueba.")
