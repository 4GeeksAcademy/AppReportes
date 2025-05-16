"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)

@api.route("/register", methods=["POST"])
def register_user():
    # Tomar el cuerpo de la peticion
    body = request.get_json()
    # Creamos el usuario sin clave
    # Aunque creo que me faltaría comprobar si ya existe ese usuario o ese email
    new_user = User(email=body["email"], username=body["username"])
    # Primero se encripta la clave
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode("utf-8")
    # Se agrega la clave encriptada al usuario que se va a crear
    new_user.password = hashed_password
    # Se guarda el nuevo usuario en la base de datos
    db.session.add(new_user)
    db.session.commit()
    # Se responde con los datos del usuario creado
    return jsonify(new_user.serialize()), 201

@api.route("/login", methods=["POST"])
def login_user():
    body = request.get_json()
    if not body or not "email" in body or not "password" in body:
        return jsonify({"msg": "Email y contraseña requeridos"}), 400
    user = User.query.filter_by(email=body["email"]).first()
    if not user:
        return jsonify({"msg": "Correo no encontrado"}), 404
    if not bcrypt.check_password_hash(user.password, body["password"]):
        return jsonify({"msg": "Contraseña incorrecta"}), 401
    #Generar el token
    payload = {
        "admin": False,
        "permissions": 123123
    }
    access_token = create_access_token(identity=str(user.id), additional_claims=payload)
    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200

@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)
    payload=get_jwt()
    return jsonify({
        "user":user.serialize(),
        "payload":payload
    })

@api.route("/logout", methods=["POST"])
@jwt_required()
def user_logout():
    payload=get_jwt()
    token_blocked=TokenBlockedList(jti=payload["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg": "User logged out"})

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
