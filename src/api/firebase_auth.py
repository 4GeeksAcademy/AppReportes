#Sí hace falta

import firebase_admin
from firebase_admin import credentials, auth
from flask import request, jsonify
from functools import wraps

def firebase_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"msg": "Token Firebase faltante o inválido"}), 401
        id_token = auth_header.split("Bearer ")[1]
        try:
            decoded_token = auth.verify_id_token(id_token)
            request.firebase_uid = decoded_token["uid"]
        except Exception as e:
            return jsonify({"msg": "Token inválido o expirado", "error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function
