  
import os
from flask_admin import Admin

from .models import db, User, Reporte, Media, Comment, Favorite, Vote

from flask_admin.contrib.sqla import ModelView

class PhotoAdmin(ModelView):
    form_columns = ['url', 'user']
    column_list = ['id', 'thumbnail', 'user']  # Mostramos miniatura + usuario
    column_labels = {
        'thumbnail': 'Vista previa',
        'user': 'Usuario'
    }

    def _thumbnail(view, context, model, name):
        if model.url:
            return f'<img src="{model.url}" width="100">'
        return ''

    column_formatters = {
        'thumbnail': _thumbnail
    }

    column_display_pk = True  # Muestra el ID en la tabla
    can_view_details = True
    allow_html = True


class CommentAdmin(ModelView):
    form_columns = ['content', 'photo']  # Relación con la foto como objeto, no photo_id


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    # admin.add_view(PhotoAdmin(Photo, db.session))
    # admin.add_view(CommentAdmin(Comment, db.session))
    admin.add_view(ModelView(Reporte, db.session))
    admin.add_view(ModelView(Media, db.session))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Favorite, db.session))
    admin.add_view(ModelView(Vote, db.session))
    # admin.add_view(PhotoAdmin(Photo, db.session))
    # admin.add_view(CommentAdmin(Comment, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))