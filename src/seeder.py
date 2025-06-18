from app import app, db
from api.models import User, Reporte, Media, Comment, Favorite, Vote, Denuncia, Sancion, Eliminado
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
    for _ in range(10):
        reporte = Reporte(
            titulo=faker.sentence(nb_words=5),
            text=faker.text(max_nb_chars=150),
            author_id=random.choice(users).id
        )
        db.session.add(reporte)
        reportes.append(reporte)

    db.session.commit()

    medias = []
    for reporte in reportes:
        media = Media(
            type="image",
            image=f"https://loremflickr.com/{random.randint(400,800)}/{random.randint(300,600)}/city",
            reporte_id=reporte.id
        )
        db.session.add(media)
        medias.append(media)

    for _ in range(5):
        media = Media(
            type="image",
            image=f"https://loremflickr.com/{random.randint(400,800)}/{random.randint(300,600)}/nature",
            reporte_id=random.choice(reportes).id
        )
        db.session.add(media)
        medias.append(media)

    db.session.commit()

    comments = []
    for _ in range(10):
        comment = Comment(
            comment_text=faker.sentence(),
            author_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id
        )
        db.session.add(comment)
        comments.append(comment)

    db.session.commit()

    favorites = []
    for _ in range(10):
        favorite = Favorite(
            user_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id
        )
        db.session.add(favorite)
        favorites.append(favorite)

    db.session.commit()

    votes = []
    for _ in range(10):
        vote = Vote(
            user_id=random.choice(users).id,
            reporte_id=random.choice(reportes).id,
            is_upvote=random.choice([True, False])
        )
        db.session.add(vote)
        votes.append(vote)

    db.session.commit()

    denuncias = []
    for _ in range(10):
        denunciante = random.choice(users)
        denunciado = random.choice([u for u in users if u.id != denunciante.id])
        denuncia = Denuncia(
            denunciante_id=denunciante.id,
            denunciado_id=denunciado.id,
            reporte_id=random.choice(reportes).id,
            comment_id=random.choice(comments).id if random.choice([True, False]) else None,
            motivo=faker.text()
        )
        db.session.add(denuncia)
        denuncias.append(denuncia)

    db.session.commit()

    sanciones = []
    for _ in range(5):
        user = random.choice(users)
        sancion = Sancion(
            user_id=user.id,
            fullname=user.fullname,
            motivo=faker.text()
        )
        db.session.add(sancion)
        sanciones.append(sancion)

    db.session.commit()

    eliminados = []
    for _ in range(3):
        eliminado = Eliminado(
            fullname=faker.name(),
            email=faker.unique.email(),
            motivo=faker.text()
        )
        db.session.add(eliminado)
        eliminados.append(eliminado)

    db.session.commit()

    print("✅ Base de datos sembrada correctamente con datos de prueba.")
