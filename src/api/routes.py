"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Reporte, Media, Comment, Favorite, Vote
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
    current_user = get_current_user()  # Esto te da el objeto retornado por user_lookup_loader
    payload = get_jwt()  # Esto te da todos los claims originales del JWT

    return jsonify({
        "user": current_user["database"],  # objeto serializado del usuario
        "claims": current_user["tokenClaims"],  # info extendida del token
        "raw_payload": payload  # por si querés ver todo el JWT crudo también
    })

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

#obtener todos los usuarios
@api.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    # claims = get_jwt()
    # role = claims.get("role")

    # if role not in ["admin", "moderador"]:
    #     return jsonify({"error": "No autorizado"}), 403

    users = User.query.all()
    user_list = [user.serialize() for user in users]
    
    return jsonify(user_list), 200

#obtener usuario
@api.route("/user/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    claims = get_jwt()
    # requester_role = claims.get("role")
    requester_id = claims.get("id")

    # # Verifica si el usuario puede acceder a este recurso
    # if requester_role not in ["admin", "moderador"] and requester_id != id:
    #     return jsonify({"error": "No autorizado"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

#borrar usuario
@api.route("/user/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    # 1. Buscar el usuario en la base de datos
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    claims = get_jwt()
    user_id=claims.get("user_id")
    try:
        # ⚠️ Asegúrate de que user.user_id es el UID de Firebase
        
        auth.delete_user(user_id)
    except Exception as e:
        return jsonify({"error": f"Error al eliminar en Firebase: {str(e)}"}), 500

    # 3. Eliminar de la base de datos
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado correctamente"}), 200

#editar datos de usuario
@api.route("/user/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]
    requester_id = claims.get("id")
    # requester_role = db_user.get("role")

    # # Solo puede editar su propio perfil o debe ser admin/moderador
    # if requester_id != id and requester_role not in ["admin", "moderador"]:
    #     return jsonify({"error": "No autorizado"}), 403

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

#un usuario crea un reporte (tiene que estar logueado, pero no hay que poner id por esta misma razon)
@api.route('/reportes', methods=['POST'])
@jwt_required()
def create_reporte():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Falta el campo 'text'"}), 400
    current = get_current_user()
    claims = current["tokenClaims"]
    author_id = claims.get("id")

    # Crear el reporte
    new_reporte = Reporte(
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

#obtener todos los reportes
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

#obtener un reporte concreto de un solo usuario
@api.route('/reportes/<int:id>', methods=['GET'])
def get_report_by_id(id):
    reporte = Reporte.query.get(id)

    if not reporte:
        return jsonify({"msg": "Reporte no encontrado"}), 404

    return jsonify(reporte.serialize()), 200

#para que un usuario pueda editar su reporte
@api.route('/users/<int:user_id>/reportes/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(user_id, report_id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]
    requester_id = claims.get("id")

    # Solo puede editar su propio reporte
    if requester_id != user_id:
        return jsonify({"error": "No autorizado para editar este reporte"}), 403

    report = Reporte.query.filter_by(id=report_id, author_id=user_id).first()
    if not report:
        return jsonify({"error": "Reporte no encontrado o no pertenece al usuario"}), 404

    data = request.get_json()

    # Solo permitimos actualizar ciertos campos
    allowed_fields = ["text"]
    for field in allowed_fields:
        if field in data:
            setattr(report, field, data[field])

    # Si se actualizan imágenes
    if "images" in data:
        # Borrar imágenes antiguas
        for img in report.images:
            db.session.delete(img)
        db.session.commit()

        # Agregar nuevas imágenes
        for image_url in data["images"]:
            new_media = Media(type="image", image=image_url, reporte_id=report.id)
            db.session.add(new_media)

    db.session.commit()

    return jsonify({
        "msg": "Reporte actualizado correctamente",
        "reporte": report.serialize()
    }), 200

# para que un usuario elimine su reporte
@api.route('/reportes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_reporte(id):
    current_user = get_current_user()
    db_user = current_user["database"]

    reporte = Reporte.query.get(id)

    if not reporte:
        return jsonify({"msg": "Reporte no encontrado"}), 404

    if reporte.author_id != db_user["id"]:
        return jsonify({"msg": "No tienes permiso para eliminar este reporte"}), 403

    # Primero eliminamos relaciones si es necesario (por cascade o manualmente)
    # db.session.delete() los eliminará si tienes cascade configurado

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

# Eliminar comentario (segun seas el propietario del reporte, el que lo puso, o el moderador)
@api.route('/comentarios/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current = get_current_user()
    claims = current["tokenClaims"]
    db_user = current["database"]
    requester_id = db_user["id"]
    requester_role = db_user.get("role", "")

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    # Puede eliminarlo: el autor del comentario, el autor del reporte o un moderador
    reporte = Reporte.query.get(comment.reporte_id)

    if requester_id not in [comment.author_id, reporte.author_id] and requester_role != "moderador":
        return jsonify({"error": "No autorizado para eliminar este comentario"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Comentario eliminado correctamente"}), 200

# poner o quitar post de favoritos (o dar like)
@api.route('/reportes/<int:reporte_id>/like', methods=['POST'])
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

# ver likes
@api.route('/reportes/<int:reporte_id>/likes', methods=['GET'])
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

# FIN ENDPOINTS MARTIN




# @api.route('/users', methods=['GET'])
# def get_users():
#     users = User.query.all()
#     return jsonify([
#         {
#             "id": user.id,
#             "email": user.email
#         } for user in users
#     ]), 200

# @api.route('/user/<int:user_id>/content', methods=['GET'])
# def get_user_content(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "Usuario no encontrado"}), 404

#     result = []
#     for photo in user.photos:
#         result.append({
#             "photo_id": photo.id,
#             "url": photo.url,
#             "comments": [
#                 {
#                     "id": comment.id,
#                     "content": comment.content
#                 } for comment in photo.comments
#             ]
#         })

#     return jsonify(result), 200

# @api.route('/photo/<int:photo_id>', methods=['DELETE'])
# def delete_photo(photo_id):
#     from api.models import Photo
#     photo = Photo.query.get(photo_id)
#     if not photo:
#         return jsonify({"error": "Foto no encontrada"}), 404
#     db.session.delete(photo)
#     db.session.commit()
#     return jsonify({"message": "Foto y comentarios eliminados"}), 200


# @api.route('/comment/<int:comment_id>', methods=['DELETE'])
# def delete_comment(comment_id):
#     from api.models import Comment
#     comment = Comment.query.get(comment_id)
#     if not comment:
#         return jsonify({"error": "Comentario no encontrado"}), 404
#     db.session.delete(comment)
#     db.session.commit()
#     return jsonify({"message": "Comentario eliminado"}), 200

# @api.route('/comment/<int:comment_id>', methods=['PUT'])
# def edit_comment(comment_id):
#     from api.models import Comment
#     data = request.get_json()
#     comment = Comment.query.get(comment_id)
#     if not comment:
#         return jsonify({"error": "Comentario no encontrado"}), 404
#     comment.content = data.get("content", comment.content)
#     db.session.commit()
#     return jsonify({"message": "Comentario actualizado"}), 200