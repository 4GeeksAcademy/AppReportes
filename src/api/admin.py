import os
from flask_admin import Admin
from .models import db, User, Reporte, Media, Comment, Favorite, Vote, Denuncia, Sancion, Eliminado
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Reporte, db.session))
    admin.add_view(ModelView(Media, db.session))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Favorite, db.session))
    admin.add_view(ModelView(Vote, db.session))
    admin.add_view(ModelView(Denuncia, db.session))
    admin.add_view(ModelView(Sancion, db.session))
    admin.add_view(ModelView(Eliminado, db.session))
