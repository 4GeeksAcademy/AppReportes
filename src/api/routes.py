"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": user.id,
            "email": user.email
        } for user in users
    ]), 200

@api.route('/user/<int:user_id>/content', methods=['GET'])
def get_user_content(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    result = []
    for photo in user.photos:
        result.append({
            "photo_id": photo.id,
            "url": photo.url,
            "comments": [
                {
                    "id": comment.id,
                    "content": comment.content
                } for comment in photo.comments
            ]
        })

    return jsonify(result), 200

@api.route('/photo/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    from api.models import Photo
    photo = Photo.query.get(photo_id)
    if not photo:
        return jsonify({"error": "Foto no encontrada"}), 404
    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Foto y comentarios eliminados"}), 200


@api.route('/comment/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    from api.models import Comment
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comentario eliminado"}), 200

@api.route('/comment/<int:comment_id>', methods=['PUT'])
def edit_comment(comment_id):
    from api.models import Comment
    data = request.get_json()
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404
    comment.content = data.get("content", comment.content)
    db.session.commit()
    return jsonify({"message": "Comentario actualizado"}), 200