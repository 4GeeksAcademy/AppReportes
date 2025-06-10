"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, jwt_required,
    get_jwt_identity, get_jwt, current_user, get_current_user
)
from api.firebase_auth import firebase_required
from api.firebase_admin_init import firebase_admin, auth as firebase_auth


api = Blueprint('api', __name__)

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)
CORS(app)

# @api.route("/register", methods=["POST"])
# def register_user():
#     auth_header = request.headers.get("Authorization", "")
#     token = auth_header.replace("Bearer ", "")

#     if not token:
#         return jsonify({"error": "Token no enviado"}), 401

#     try:
#         # Verifica el token
#         decoded_token = auth.verify_id_token(token)
#         firebase_uid = decoded_token["uid"]
#         email = decoded_token["email"]
#         nombre = decoded_token.get("name", "")
#         picture = decoded_token.get("picture", "")

#         # Verifica si el usuario ya existe
#         user = User.query.filter_by(firebase_uid=firebase_uid).first()
#         if not user:
#             # Crea el usuario en tu base de datos
#             user = User(
#                 firebase_uid=firebase_uid,
#                 email=email,
#                 nombre=nombre,
#                 foto_url=picture,
#             )
#             db.session.add(user)
#             db.session.commit()

#         return jsonify(user.serialize()), 200

#     except Exception as e:
#         print("❌ Error verificando el token:", e)
#         return jsonify({"error": "Token inválido o verificación fallida"}), 401

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