import firebase_admin  # <-- AÑADE ESTA LÍNEA
from firebase_admin import credentials, auth as firebase_auth

# Evita inicializar varias veces
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-adminsdk.json")
    # firebase_admin.initialize_app(cred)

# Exporta el auth para que routes.py lo pueda importar
auth = firebase_auth
