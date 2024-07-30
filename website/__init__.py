"""
Author: Scriptpythonic
Description: This module initializes the Flask application, sets up configuration, and registers extensions and blueprints. It also handles environment variable loading and user session management.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash
# Initialize the SQLAlchemy instance
db = SQLAlchemy()

def create_app():
    """
    Create and configure the Flask application.

    Returns:
        app: The configured Flask application instance.
    """
    # Load environment variables from .env file
    load_dotenv()

    # Initialize Flask application
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')

    # Initialize database and login manager
    db.init_app(app)
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Import and register blueprints
    from .views import views
    from .auth import auth
    from .telegram import teleg
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(teleg, url_prefix='/')

    # Configure user loader for login manager
    from .models import User
    @login_manager.user_loader
    def load_user(user_id):
        """
        Load a user by their user ID.

        Args:
            user_id (int): The ID of the user to load.

        Returns:
            User: The user object if found, otherwise None.
        """
        return User.query.get(int(user_id))

    # Create database tables if they do not exist
    with app.app_context():
        db.create_all()

        # Create an admin user if it doesn't exist
        if not User.query.filter_by(email='admin@example.com').first():
            hashed_password =generate_password_hash('ScriptPythonic', method='scrypt')
            admin = User(
                email='admin@example.com',
                first_name='Admin',
                last_name='User',
                password= hashed_password, 
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
    
    return app      
