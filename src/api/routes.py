"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList
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

@api.route("/register", methods=["POST"])
def register_user():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")

    if not token:
        return jsonify({"error": "Token no enviado"}), 401

    try:
        # Verifica el token
        decoded_token = auth.verify_id_token(token)
        firebase_uid = decoded_token["uid"]
        email = decoded_token["email"]
        nombre = decoded_token.get("name", "")
        picture = decoded_token.get("picture", "")

        # Verifica si el usuario ya existe
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if not user:
            # Crea el usuario en tu base de datos
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                nombre=nombre,
                foto_url=picture,
            )
            db.session.add(user)
            db.session.commit()

        return jsonify(user.serialize()), 200

    except Exception as e:
        print("❌ Error verificando el token:", e)
        return jsonify({"error": "Token inválido o verificación fallida"}), 401

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

# @api.route("/userinfo", methods=["GET"])
# @jwt_required()
# def user_info():
#     user_id=get_jwt_identity()
#     user=User.query.get(user_id)
#     payload=get_jwt()
#     return jsonify({
#         "user":user.serialize(),
#         "payload":payload
#     })

# @api.route("/firebase-login", methods=["POST"])
# def firebase_login():
#     id_token = request.headers.get("Authorization", "").replace("Bearer ", "")
#     if not id_token or len(id_token) < 20:  # tokens Firebase suelen ser largos
#         return jsonify({"msg": "Token inválido"}), 401
    
#     try:
#         decoded_token = firebase_auth.verify_id_token(id_token) # Parece que está bien
#         uid = decoded_token["uid"]
#         email = decoded_token.get("email", "")

#         # Crear o buscar al usuario en tu base de datos
#         user = User.query.filter_by(firebase_uid=uid).first()
#         if not user:
#             user = User(email=email, firebase_uid=uid, username="1", is_active=True )
#             db.session.add(user)
#             db.session.commit()

#         # access_token = create_access_token(identity=user.id)
#         # Para roles, cuando ya funcione bien todo:
#         # access_token = create_access_token(identity=user.id, additional_claims={"is_admin": user.is_admin})

#         # return jsonify({
#         #     "token": access_token,
#         #     "user": user.serialize()
#         # }), 200
#         return jsonify({"msg": "Login OK", "uid":uid, "email":email, "token":id_token}), 200  # Esto envía una respuesta JSON al cliente
#     except Exception as e:
#         print(e)
#         return jsonify({"msg": "Token inválido"}), 401

# @api.route("/firebase-login", methods=["GET", "PUT", "DELETE", "PATCH"])
# def firebase_login_invalid_method():
#     return jsonify({"msg": "Método no permitido"}), 405

# @api.route("/admin", methods=["GET"])
# @jwt_required()
# def admin_route():
#     claims = get_jwt()
#     if not claims.get("is_admin", False):
#         return jsonify({"msg": "Acceso denegado"}), 403
#     return jsonify({"msg": "Bienvenido Admin"})


# @api.route("/firebase-userinfo", methods=["GET"])
# # @jwt_required()
# def firebase_user_info():
#     id_token = request.headers.get("Authorization", "").replace("Bearer ", "")
#     print("ID Token recibido:", id_token[:20], "...")  # Solo un fragmento por seguridad
#     return jsonify({"firebase_uid": request.firebase_uid}), 200

# @api.route("/register", methods=["POST"])
# def register_user():
#     # Tomar el cuerpo de la peticion
#     body = request.get_json()
#     # Creamos el usuario sin clave
#     # Aunque creo que me faltaría comprobar si ya existe ese usuario o ese email
#     new_user = User(email=body["email"], username=body["username"])
#     # Primero se encripta la clave
#     hashed_password = bcrypt.generate_password_hash(
#         body["password"]).decode("utf-8")
#     # Se agrega la clave encriptada al usuario que se va a crear
#     new_user.password = hashed_password
#     # Se guarda el nuevo usuario en la base de datos
#     db.session.add(new_user)
#     db.session.commit()
#     # Se responde con los datos del usuario creado
#     return jsonify(new_user.serialize()), 201

# @api.route("/login", methods=["POST"])
# def login_user():
#     body = request.get_json()
#     if not body or not "email" in body or not "password" in body:
#         return jsonify({"msg": "Email y contraseña requeridos"}), 400
#     user = User.query.filter_by(email=body["email"]).first()
#     if not user:
#         return jsonify({"msg": "Correo no encontrado"}), 404
#     if not bcrypt.check_password_hash(user.password, body["password"]):
#         return jsonify({"msg": "Contraseña incorrecta"}), 401
#     #Generar el token
#     payload = {
#         "admin": False,
#         "permissions": 123123
#     }
#     access_token = create_access_token(identity=str(user.id), additional_claims=payload)
#     return jsonify({
#         "token": access_token,
#         "user": user.serialize()
#     }), 200

# @api.route("/logout", methods=["POST"])
# # @jwt_required()
# def user_logout():
#     payload=get_jwt()
#     token_blocked=TokenBlockedList(jti=payload["jti"])
#     db.session.add(token_blocked)
#     db.session.commit()
#     return jsonify({"msg": "User logged out"})


