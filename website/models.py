from flask_login import UserMixin
from sqlalchemy import func
from . import db 

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    matriculation_number = db.Column(db.String(150))
    cgpa = db.Column(db.String(150))
    password = db.Column(db.String(150))
    google_id = db.Column(db.String(150), unique=True, nullable=True)
    
    def __repr__(self):
        return f'<User {self.email}>'

    @classmethod
    def authenticate(cls, email, password):
        
        return cls.query.filter(func.lower(cls.email) == func.lower(email), cls.password == password).first()