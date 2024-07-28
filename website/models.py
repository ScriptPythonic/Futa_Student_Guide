"""
Models for the website.

Author: ScriptPythonic
Date: 2024-07-26

This module contains the definition of the `User` model, which represents users in the application.
It uses Flask-Login for user session management and SQLAlchemy for database interactions.
"""

from flask_login import UserMixin
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeMeta
from . import db

# Type hint for db.Model and UserMixin
UserMixinType = UserMixin  # Type for Flask-Login UserMixin
DBModelType = DeclarativeMeta  # Type for SQLAlchemy db.Model

class User(UserMixin, db.Model):
    """
    Represents a user in the system.

    Author: ScriptPythonic
    Date: 2024-07-26

    Attributes:
        id (int): Primary key for the user.
        email (str): User's email address, must be unique.
        first_name (str): User's first name.
        last_name (str): User's last name.
        matriculation_number (str): Unique matriculation number for the user.
        cgpa (str): Current CGPA of the user.
        password (str): Hashed password for user authentication.
        google_id (str): Google ID for users who log in via Google, can be null.

    Methods:
        __repr__(): Returns a string representation of the user.
        authenticate(email, password): Class method to authenticate users by email and password.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    matriculation_number = db.Column(db.String(150))
    cgpa = db.Column(db.String(150))
    password = db.Column(db.String(150))
    google_id = db.Column(db.String(150), unique=True, nullable=True)
    
    def __repr__(self) -> str:
        """
        Returns a string representation of the user object, which includes the user's email.
        """
        return f'<User {self.email}>'

    @classmethod
    def authenticate(cls, email: str, password: str) -> 'User':
        """
        Authenticates a user based on their email and password.

        Args:
            email (str): The user's email address.
            password (str): The user's password.

        Returns:
            User: The user object if authentication is successful, otherwise None.
        """
        return cls.query.filter(func.lower(cls.email) == func.lower(email), cls.password == password).first()
