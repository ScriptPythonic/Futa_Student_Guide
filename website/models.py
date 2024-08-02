"""
Models for the messaging platform between students and doctors.

Author: ScriptPythonic
Date: 2024-07-26

This module contains the definition of the `User` and `Message` models.
It uses Flask-Login for user session management and SQLAlchemy for database interactions.
"""

from flask_login import UserMixin
from sqlalchemy import func
from . import db

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
        role (str): Role of the user, either 'student' or 'doctor'.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    matriculation_number = db.Column(db.String(150))
    cgpa = db.Column(db.String(150))
    password = db.Column(db.String(150))
    google_id = db.Column(db.String(150), unique=True, nullable=True)
    role = db.Column(db.String(50), nullable=False, default='student')
    
    def __repr__(self):
        """
        Returns a string representation of the user object.
        """
        return f'<User {self.email}>'

class Message(db.Model):
    """
    Represents a message between a student and a doctor.

    Author: ScriptPythonic
    Date: 2024-07-26

    Attributes:
        id (int): Primary key for the message.
        sender_id (int): ID of the user who sent the message.
        receiver_id (int): ID of the user who received the message.
        content (str): Content of the message.
        timestamp (datetime): Time the message was sent.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    
    # Define relationships and specify foreign keys
    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages', lazy=True)
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages', lazy=True)

    def __repr__(self):
        """
        Returns a string representation of the message object.
        """
        return f'<Message from {self.sender_id} to {self.receiver_id} at {self.timestamp}>'




class Complaint(db.Model):
    """
    Represents a complaint made by a student.

    Author: ScriptPythonic
    Date: 2024-07-26

    Attributes:
        id (int): Primary key for the complaint.
        user_id (int): ID of the user making the complaint.
        content (str): Content of the complaint.
        timestamp (datetime): Time the complaint was made.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self) -> str:
        """
        Returns a string representation of the complaint object.
        """
        return f'<Complaint by {self.user_id} at {self.timestamp}>'
    
class MedicalReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_of_visit = db.Column(db.Date, nullable=False)
    reason_for_visit = db.Column(db.String(255), nullable=False)
    height = db.Column(db.String(10), nullable=False)
    weight = db.Column(db.String(10), nullable=False)
    blood_pressure = db.Column(db.String(20), nullable=False)
    temperature = db.Column(db.String(10), nullable=False)
    pulse = db.Column(db.String(10), nullable=False)
    findings = db.Column(db.Text, nullable=False)
    diagnosis = db.Column(db.Text, nullable=False)
    treatment = db.Column(db.Text, nullable=False)
    doctor_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
