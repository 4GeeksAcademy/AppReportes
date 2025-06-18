"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Reporte, Media, Comment, Favorite, Vote, Denuncia, Sancion, Eliminado
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, jwt_required,
    get_jwt_identity, get_jwt, current_user, get_current_user
)
from api.firebase_auth import firebase_required
from api.firebase_admin_init import firebase_auth
from firebase_admin import auth
from datetime import datetime

api = Blueprint('api', __name__)

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)
CORS(app)

# @api.route("/admin", methods=["GET"])
# @jwt_required()
# def admin_route():
#     claims = get_jwt()
#     if not claims.get("is_admin", False):
#         return jsonify({"msg": "Acceso denegado"}), 403
#     return jsonify({"msg": "Bienvenido Admin"})

@api.route("/firebase-auth", methods=["POST"])
@jwt_required()
def firebase_auth():
    print("🔥 Petición recibida en /firebase-auth")  # <--- AÑADE ESTO
    current = get_current_user()

    return jsonify({
        "user": current["database"],      # Usuario en tu base de datos
        "tokenClaims": current["tokenClaims"]  # Claims del ID token de Firebase
    })

@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    try:
        current_user = get_current_user()  # Esto te da el objeto retornado por user_lookup_loader
        payload = get_jwt()  # Esto te da todos los claims originales del JWT

        return jsonify({
            "user": current_user["database"],  # objeto serializado del usuario
            "claims": current_user["tokenClaims"],  # info extendida del token
            "raw_payload": payload  # por si querés ver todo el JWT crudo también
        })

    except Exception as e:
        # Loguea el error para debugging
        print(f"Error en /userinfo: {e}")
        # Devuelve un error 500 con un mensaje genérico (no dar detalles sensibles)
        return jsonify({"error": "Error interno del servidor"}), 500

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/hello_protected', methods=['POST', 'GET'])
@jwt_required()
def handle_hello_protected():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    response_body=get_current_user()
    # profile_picture = response_body["database"]["profile_picture"]
    # print(f"Profile picture del usuario autenticado: {profile_picture}")
    return jsonify(response_body), 200


## ENDPOINTS MARTIN

# para designar moderadores
@api.route("/make-moderator", methods=["POST"])
def make_moderator():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email requerido"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user.is_moderator = True
    db.session.commit()

    return jsonify({"msg": f"El usuario {email} ahora es moderador"}), 200

# para eliminar moderadores
@api.route("/remove-moderator", methods=["POST"])
def remove_moderator():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email requerido"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if not user.is_moderator:
        return jsonify({"msg": f"El usuario {email} ya no es moderador"}), 200

    user.is_moderator = False
    db.session.commit()

    return jsonify({"msg": f"El usuario {email} ya no es moderador"}), 200


# obtener todos los usuarios (solo moderadores)
@api.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    current = get_current_user()
    db_user = current["database"]

    is_moderator = db_user.get("is_moderator", False)

    if not is_moderator:
        return jsonify({"error": "No autorizado"}), 403

    users = User.query.all()
    user_list = [user.serialize() for user in users]
    
    return jsonify(user_list), 200

# obtener usuario en concreto (moderadores incluidos)
@api.route("/user/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]

    requester_id = claims.get("id")
    is_moderator = db_user.get("is_moderator", False)

    # Verifica si el usuario puede acceder a este recurso
    if requester_id != id and not is_moderator:
        return jsonify({"error": "No autorizado"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

# borrar usuario (moderadores incluidos)
@api.route("/user/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    current = get_current_user()
    db_user = current["database"]
    claims = current["tokenClaims"]

    requester_id = db_user["id"]
    is_moderator = db_user.get("is_moderator", False)

    # 1. Buscar el usuario objetivo en la base de datos
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # 2. Verificar autorización
    if requester_id != id and not is_moderator:
        return jsonify({"error": "No autorizado para eliminar este usuario"}), 403

    # 3. Eliminar de Firebase Authentication (ahora también si eres moderador)
    try:
        print(f"Eliminando usuario con UID: {user.user_id}")

        auth.delete_user(user.user_id)  # Eliminamos usando el Firebase UID del usuario objetivo
    except Exception as e:
        return jsonify({"error": f"Error al eliminar en Firebase: {str(e)}"}), 500

    # 4. Eliminar de la base de datos
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado correctamente"}), 200

# editar datos de usuario (moderadores incluidos, comprobado)
@api.route("/user/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    current = get_current_user()
    db_user = current["database"]

    requester_id = db_user["id"]
    is_moderator = db_user.get("is_moderator", False)

    # Solo puede editar su perfil o ser moderador
    if requester_id != id and not is_moderator:
        return jsonify({"error": "No autorizado"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    # Solo permitimos actualizar ciertos campos
    allowed_fields = ["fullname", "profile_picture"]
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()

    return jsonify({"msg": "Perfil actualizado correctamente", "user": user.serialize()}), 200



# un usuario crea un reporte (tiene que estar logueado, pero no hay que poner id por esta misma razon)
@api.route('/reportes', methods=['POST'])
@jwt_required()
def create_reporte():
    data = request.get_json()
    if not data or "text" not in data or "titulo" not in data:
        return jsonify({"error": "Faltan los campos 'titulo' y/o 'text'"}), 400

    current = get_current_user()
    claims = current["tokenClaims"]
    author_id = claims.get("id")

    # Crear el reporte
    new_reporte = Reporte(
        titulo=data["titulo"],
        text=data["text"],
        author_id=author_id
    )
    db.session.add(new_reporte)
    db.session.flush()  # Para obtener el ID del reporte antes de commit

    # Si se incluye imagen, se guarda como Media
    if "image" in data and data["image"]:
        new_media = Media(
            image=data["image"],
            reporte_id=new_reporte.id
        )
        db.session.add(new_media)

    db.session.commit()

    return jsonify({
        "msg": "Reporte creado correctamente",
        "reporte": new_reporte.serialize()
    }), 201

# obtener todos los reportes
@api.route('/reportes', methods=['GET'])
def get_reports():
    reportes = Reporte.query.all()
    return jsonify([reporte.serialize() for reporte in reportes]), 200

# obtener todos los reportes de un usuario
@api.route('/users/<int:user_id>/reportes', methods=['GET'])
def get_reports_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Obtenemos todos los reportes del usuario
    reports = Reporte.query.filter_by(author_id=user_id).all()

    return jsonify({
        "user": user.serialize(),
        "reports": [report.serialize() for report in reports]
    }), 200

# obtener un reporte concreto de un solo usuario
@api.route('/reportes/<int:id>', methods=['GET'])
def get_report_by_id(id):
    reporte = Reporte.query.get(id)

    if not reporte:
        return jsonify({"msg": "Reporte no encontrado"}), 404

    return jsonify(reporte.serialize()), 200

# para que un usuario pueda editar su reporte
@api.route('/users/<int:user_id>/reportes/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(user_id, report_id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]
    requester_id = claims.get("id")

    if requester_id != user_id:
        return jsonify({"error": "No autorizado para editar este reporte"}), 403

    report = Reporte.query.filter_by(id=report_id, author_id=user_id).first()
    if not report:
        return jsonify({"error": "Reporte no encontrado o no pertenece al usuario"}), 404

    data = request.get_json()

    # Solo permitimos actualizar ciertos campos
    allowed_fields = ["text", "titulo"]
    for field in allowed_fields:
        if field in data:
            setattr(report, field, data[field])

    # Si se actualizan imágenes
    if "images" in data:
        for img in report.images:
            db.session.delete(img)
        db.session.commit()

        for image_url in data["images"]:
            new_media = Media(type="image", image=image_url, reporte_id=report.id)
            db.session.add(new_media)

    db.session.commit()

    return jsonify({
        "msg": "Reporte actualizado correctamente",
        "reporte": report.serialize()
    }), 200

# para que un usuario elimine su reporte (moderadores incluidos, comprobar)
@api.route('/reportes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_reporte(id):
    current_user = get_current_user()
    db_user = current_user["database"]

    is_moderator = db_user.get("is_moderator", False)

    reporte = Reporte.query.get(id)

    if not reporte:
        return jsonify({"msg": "Reporte no encontrado"}), 404

    # Permitir si es autor o moderador
    if reporte.author_id != db_user["id"] and not is_moderator:
        return jsonify({"msg": "No tienes permiso para eliminar este reporte"}), 403

    db.session.delete(reporte)
    db.session.commit()

    return jsonify({"msg": "Reporte eliminado correctamente"}), 200

# crear un comentario en un reporte
@api.route('/reportes/<int:reporte_id>/comentarios', methods=['POST'])
@jwt_required()
def create_comment(reporte_id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]

    data = request.get_json()
    comment_text = data.get("comment_text", "").strip()

    if not comment_text:
        return jsonify({"error": "El comentario no puede estar vacío"}), 400

    # Verificamos que el reporte exista
    reporte = Reporte.query.get(reporte_id)
    if not reporte:
        return jsonify({"error": "Reporte no encontrado"}), 404

    new_comment = Comment(
        comment_text=comment_text,
        author_id=db_user["id"],
        reporte_id=reporte_id
    )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        "msg": "Comentario creado correctamente",
        "comment": new_comment.serialize()
    }), 201

# obtener todos los comentarios de un reporte
@api.route('/reportes/<int:reporte_id>/comentarios', methods=['GET'])
def get_comments(reporte_id):
    reporte = Reporte.query.get(reporte_id)
    if not reporte:
        return jsonify({"error": "Reporte no encontrado"}), 404

    comments = Comment.query.filter_by(reporte_id=reporte_id).all()
    return jsonify([comment.serialize() for comment in comments]), 200

# Eliminar comentario (segun seas el propietario del reporte, el que lo puso, o el moderador) (moderadores incluidos, comprobar)
@api.route('/comentarios/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current = get_current_user()
    db_user = current["database"]
    requester_id = db_user["id"]
    is_moderator = db_user.get("is_moderator", False)

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    # Puede eliminarlo: autor del comentario, autor del reporte o moderador
    reporte = Reporte.query.get(comment.reporte_id)

    if requester_id not in [comment.author_id, reporte.author_id] and not is_moderator:
        return jsonify({"error": "No autorizado para eliminar este comentario"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Comentario eliminado correctamente"}), 200

# poner o quitar post de favoritos (o dar like)
@api.route('/reportes/<int:reporte_id>/favorito', methods=['POST'])
@jwt_required()
def toggle_favorite(reporte_id):
    current = get_current_user()
    db_user = current["database"]
    
    existing_fav = Favorite.query.filter_by(user_id=db_user["id"], reporte_id=reporte_id).first()

    if existing_fav:
        db.session.delete(existing_fav)
        db.session.commit()
        return jsonify({"msg": "Eliminado de favoritos"}), 200

    new_fav = Favorite(user_id=db_user["id"], reporte_id=reporte_id)
    db.session.add(new_fav)
    db.session.commit()
    return jsonify({"msg": "Agregado a favoritos"}), 201


# ver mis favoritos
@api.route('/reportes/favoritos', methods=['GET'])
@jwt_required()
def get_user_favorites():
    current = get_current_user()
    db_user = current["database"]

    favoritos = Favorite.query.filter_by(user_id=db_user["id"]).all()
    reporte_ids = [fav.reporte_id for fav in favoritos]

    return jsonify(reporte_ids), 200

# ver los reportes de otro usuario que he marcado como favoritos (implementado)
@api.route("/users/<int:user_id>/favoritos", methods=["GET"])
@jwt_required()
def get_favoritos_en_reportes_de(user_id):
    current_user = get_current_user()
    current_user_id = current_user["database"]["id"]

    if not current_user_id:
        return jsonify({"error": "ID de usuario inválido"}), 400

    # Buscar favoritos hechos por el usuario logueado
    favorites = Favorite.query.filter_by(user_id=current_user_id).all()

    # Filtrar solo los favoritos que apuntan a reportes hechos por user_id
    reportes_favoritos_de_ese_usuario = [
        fav.reporte.serialize()
        for fav in favorites
        if fav.reporte and fav.reporte.author_id == user_id
    ]

    return jsonify({"likes": reportes_favoritos_de_ese_usuario}), 200




# ver likes de un reporte (creo que mejor no, solamente guardarlo como favorito y ya)
@api.route('/reportes/<int:reporte_id>/favoritos', methods=['GET'])
def get_favorites(reporte_id):
    count = Favorite.query.filter_by(reporte_id=reporte_id).count()
    return jsonify({"reporte_id": reporte_id, "favorites": count}), 200

# votar positivo a un reporte
@api.route('/reportes/<int:reporte_id>/upvote', methods=['POST'])
@jwt_required()
def toggle_upvote(reporte_id):
    current = get_current_user()
    db_user = current["database"]

    existing_vote = Vote.query.filter_by(user_id=db_user["id"], reporte_id=reporte_id).first()

    if existing_vote:
        if existing_vote.is_upvote:
            db.session.delete(existing_vote)
            db.session.commit()
            return jsonify({"msg": "Upvote eliminado"}), 200
        else:
            existing_vote.is_upvote = True
            db.session.commit()
            return jsonify({"msg": "Cambiado a upvote"}), 200

    new_vote = Vote(user_id=db_user["id"], reporte_id=reporte_id, is_upvote=True)
    db.session.add(new_vote)
    db.session.commit()
    return jsonify({"msg": "Upvote agregado"}), 201

# votar negativo a un reporte
@api.route('/reportes/<int:reporte_id>/downvote', methods=['POST'])
@jwt_required()
def toggle_downvote(reporte_id):
    current = get_current_user()
    db_user = current["database"]

    existing_vote = Vote.query.filter_by(user_id=db_user["id"], reporte_id=reporte_id).first()

    if existing_vote:
        if not existing_vote.is_upvote:
            db.session.delete(existing_vote)
            db.session.commit()
            return jsonify({"msg": "Downvote eliminado"}), 200
        else:
            existing_vote.is_upvote = False
            db.session.commit()
            return jsonify({"msg": "Cambiado a downvote"}), 200

    new_vote = Vote(user_id=db_user["id"], reporte_id=reporte_id, is_upvote=False)
    db.session.add(new_vote)
    db.session.commit()
    return jsonify({"msg": "Downvote agregado"}), 201

# ver votos positivos o negativos de un reporte
@api.route('/reportes/<int:reporte_id>/votes', methods=['GET'])
def get_votes(reporte_id):
    upvotes = Vote.query.filter_by(reporte_id=reporte_id, is_upvote=True).count()
    downvotes = Vote.query.filter_by(reporte_id=reporte_id, is_upvote=False).count()

    return jsonify({
        "reporte_id": reporte_id,
        "upvotes": upvotes,
        "downvotes": downvotes
    }), 200

# Obtener todos los votos del usuario autenticado
@api.route('/reportes/mis-votos', methods=['GET'])
@jwt_required()
def get_user_votes():
    current = get_current_user()
    db_user = current["database"]

    votos = Vote.query.filter_by(user_id=db_user["id"]).all()

    result = [
        {
            "reporte_id": voto.reporte_id,
            "is_upvote": voto.is_upvote
        }
        for voto in votos
    ]

    return jsonify(result), 200



# banear usuarios (solo moderadores, comprobar)

@api.route("/user/<int:id>/ban", methods=["PUT"])
@jwt_required()
def ban_user(id):
    current = get_current_user()
    db_user = current["database"]

    # Verificar si es moderador
    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado: solo moderadores pueden banear usuarios"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    is_active = data.get("is_active")

    if is_active is None:
        return jsonify({"error": "Debes proporcionar el campo 'is_active' en el cuerpo de la petición"}), 400

    # Evitar que un moderador se banee a sí mismo accidentalmente
    if db_user["id"] == id:
        return jsonify({"error": "No puedes modificar tu propio estado de actividad"}), 403

    user.is_active = is_active
    db.session.commit()

    estado = "activado" if is_active else "baneado"
    return jsonify({"msg": f"Usuario {estado} correctamente", "user": user.serialize()}), 200

# faltan por comprobar:

# postear una denuncia (usuario)
@api.route('/denuncias', methods=['POST'])
@jwt_required()
def create_denuncia():
    current = get_current_user()
    db_user = current["database"]
    denunciante_id = db_user["id"]  # Este es el integer ID para la FK

    data = request.get_json()
    motivo = data.get("motivo")
    reporte_id = data.get("reporte_id")
    comment_id = data.get("comment_id")

    if not motivo:
        return jsonify({"error": "Debes proporcionar un motivo"}), 400

    if not reporte_id and not comment_id:
        return jsonify({"error": "Debes especificar un reporte o un comentario"}), 400

    if reporte_id and comment_id:
        return jsonify({"error": "Debes especificar solo uno: reporte o comentario"}), 400

    denunciado_id = None

    if reporte_id:
        reporte = Reporte.query.get(reporte_id)
        if not reporte:
            return jsonify({"error": "Reporte no encontrado"}), 404
        denunciado_id = reporte.author_id

    elif comment_id:
        comentario = Comment.query.get(comment_id)
        if not comentario:
            return jsonify({"error": "Comentario no encontrado"}), 404
        denunciado_id = comentario.author_id

    if denunciante_id == denunciado_id:
        return jsonify({"error": "No puedes denunciarte a ti mismo"}), 400

    nueva_denuncia = Denuncia(
        denunciante_id=denunciante_id,
        denunciado_id=denunciado_id,
        reporte_id=reporte_id,
        comment_id=comment_id,
        motivo=motivo,
        status="pendiente"
    )

    db.session.add(nueva_denuncia)
    db.session.commit()

    return jsonify({
        "msg": "Denuncia creada correctamente",
        "denuncia": nueva_denuncia.serialize()
    }), 201





# obtener todas las denuncias (moderadores solo)
@api.route('/denuncias', methods=['GET'])
@jwt_required()
def list_denuncias():
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    denuncias = Denuncia.query.all()
    return jsonify([d.serialize() for d in denuncias]), 200

# obtener una denuncia en concreto (moderadores solo)
@api.route('/denuncias/<int:id>', methods=['GET'])
@jwt_required()
def get_denuncia(id):
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    denuncia = Denuncia.query.get(id)
    if not denuncia:
        return jsonify({"error": "Denuncia no encontrada"}), 404

    return jsonify(denuncia.serialize()), 200

# delete denuncua (moderadores solo)
@api.route('/denuncias/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_denuncia(id):
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    denuncia = Denuncia.query.get(id)
    if not denuncia:
        return jsonify({"error": "Denuncia no encontrada"}), 404

    db.session.delete(denuncia)
    db.session.commit()

    return jsonify({"msg": "Denuncia eliminada"}), 200

@api.route('/sancion', methods=['POST'])
@jwt_required()
def create_sancion():
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()

    user_id = data.get("user_id")
    fullname = data.get("fullname")
    motivo = data.get("motivo")
    estado = data.get("estado")  # ejemplo: "baneado"

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Crear sanción
    sancion = Sancion(
        user_id=user_id,
        motivo=motivo,
        estado=estado,
        fullname=fullname
    )

    # Actualizar estado del usuario (banned)
    user.is_active = False  # o user.is_baneado = True si ese campo usas
    user.is_moderator = False  # o user.is_baneado = True si ese campo usas
    db.session.add(sancion)
    db.session.commit()

    return jsonify({"sancion": sancion.serialize()}), 201


# listar sanciones (solo moderadores)
@api.route('/sancion', methods=['GET'])
@jwt_required()
def list_sanciones():
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    sanciones = Sancion.query.all()
    return jsonify([s.serialize() for s in sanciones]), 200

# ver sancion concreta (solo moderadores)
@api.route('/sanciones/<int:id>', methods=['GET'])
@jwt_required()
def get_sancion(id):
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    sancion = Sancion.query.get(id)
    if not sancion:
        return jsonify({"error": "Sanción no encontrada"}), 404

    return jsonify(sancion.serialize()), 200

# actualizar sancion manualmente (solo moderadores)
@api.route('/sanciones/<int:id>', methods=['PUT'])
@jwt_required()
def update_sancion(id):
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    sancion = Sancion.query.get(id)
    if not sancion:
        return jsonify({"error": "Sanción no encontrada"}), 404

    data = request.get_json()

    # Permitimos actualizar motivo, tipo y fecha_fin
    if "motivo" in data:
        sancion.motivo = data["motivo"]
    if "tipo" in data:
        sancion.tipo = data["tipo"]
    if "fecha_fin" in data:
        try:
            sancion.fecha_fin = datetime.fromisoformat(data["fecha_fin"])
        except ValueError:
            return jsonify({"error": "fecha_fin debe ser ISO 8601"}), 400

    db.session.commit()

    return jsonify({"msg": "Sanción actualizada", "sancion": sancion.serialize()}), 200

# eliminar sancion (solo moderadores)
@api.route('/sancion/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_sancion(id):
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    sancion = Sancion.query.get(id)
    if not sancion:
        return jsonify({"error": "Sanción no encontrada"}), 404

    # try:
    #     auth.delete_user(user.user_id)
    # except Exception as e:
    #     return jsonify({"error": f"Error al eliminar en Firebase: {str(e)}"}), 500    

    db.session.delete(sancion)
    db.session.commit()

    return jsonify({"msg": "Sanción eliminada"}), 200

#quitar ban
@api.route('/quitarban', methods=['POST'])
@jwt_required()
def quitar_ban():
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Falta user_id"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Quitar ban: activar usuario
    user.is_active = True  # o el campo que uses para activar
    db.session.add(user)

    # Eliminar sanción (si tienes varias, filtra la correcta)
    sancion = Sancion.query.filter_by(user_id=user_id).first()
    if sancion:
        db.session.delete(sancion)

    db.session.commit()

    return jsonify({"msg": "Ban quitado correctamente"}), 200




# crear una linea en eliminados
@api.route("/eliminados", methods=["POST"])
@jwt_required()
def crear_eliminado():
    data = request.get_json()
    fullname = data.get("fullname")
    email = data.get("email")
    motivo = data.get("motivo")

    if not fullname or not email or not motivo:
        return jsonify({"error": "Faltan campos fullname, email o motivo"}), 400

    eliminado = Eliminado(
        fullname=fullname,
        email=email,
        motivo=motivo
    )
    db.session.add(eliminado)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado registrado correctamente"}), 201

# listar sanciones (solo moderadores)
@api.route('/eliminados', methods=['GET'])
@jwt_required()
def list_eliminados():
    current = get_current_user()
    db_user = current["database"]

    if not db_user.get("is_moderator", False):
        return jsonify({"error": "No autorizado"}), 403

    eliminados = Eliminado.query.all()
    return jsonify([s.serialize() for s in eliminados]), 200









# FIN ENDPOINTS MARTIN

