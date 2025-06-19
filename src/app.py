"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
import requests
import jwt 
import firebase_admin
from firebase_admin import credentials
from cryptography import x509
from cryptography.hazmat.backends import default_backend


cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_KEY"))
fb=firebase_admin.initialize_app(cred)



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app, supports_credentials=True, origins=[
    "https://super-waddle-r4gq474w5w9wfj9j-3000.app.github.dev/",
    "http://localhost:3000",
    "https://appreportes-1.onrender.com"
])
##### JWT Configuration

app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")
app.config["JWT_ALGORITHM"] = "RS256" #seguro
# Se crea la instancia de jwt
jwt_manager = JWTManager(app)
CERTIFICATE_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

@jwt_manager.decode_key_loader
def decode_key_loader(jwt_headers, claims):
    response = requests.get(CERTIFICATE_URL, verify=True)
    kid = jwt_headers['kid']
    certificate = response.json()[kid]
    try:
        # This is transformed because google gives pem key form, it has to be loaded to x509 certificate.
        cert = x509.load_pem_x509_certificate(
            certificate.encode(), default_backend())
        rsa_public = cert.public_key()
        return rsa_public
    except:
        return None

@jwt_manager.user_lookup_loader
def user_lookup_loader(jwt_headers, claims: dict):
    print("🔥 JWT claims recibidos:", claims)  # 👈 Esto te muestra si 'name' está presente
    firebase_uid = claims.get("user_id")
    email = claims.get("email")
    fullname = claims.get("name") or claims.get("displayName") or claims.get("fullname")
    profile_picture = claims.get("picture") or "https://example.com/default-profile.png"

    # Buscar en la base de datos si ya existe el usuario por UID o por email
    db_user = User.query.filter(
        (User.user_id == firebase_uid) | (User.email == email)
    ).first()

    if not db_user:
        db_user = User(
            user_id=firebase_uid,
            email=email,
            fullname=fullname,
            profile_picture=profile_picture,
            is_moderator=False  # Por defecto no lo es
        )
        db.session.add(db_user)
        db.session.commit()

    claims["id"] = db_user.id
    claims["is_moderator"] = db_user.is_moderator  # 👈 lo añades al token si quieres

    return {
        "database": db_user.serialize(),  # Ya debería incluir is_moderator si está en el serialize
        "tokenClaims": claims
    }

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
