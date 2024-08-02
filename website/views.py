"""
Author: Scriptpythonic
Description: This module defines the routes for the Flask application. It handles rendering templates for various views and is used for displaying pages such as the home page, profile, course registration, grade tracking, and medical information.
"""

from flask import Flask, Blueprint, render_template,jsonify,request
from flask_login import current_user,login_required
from .models import User,Message,MedicalReport
from . import db 

# Create a Blueprint for handling views
views = Blueprint('views', __name__)

@views.route('/', methods=['GET'])
def home():
    """
    Render the home page.

    Returns:
        Rendered HTML template for the main page with the current user context.
    """
    return render_template('main/main.html', current_user=current_user)

@views.route('/profile', methods=['GET'])
def profile():
    """
    Render the profile page.

    Returns:
        A simple HTML string greeting the user.
    """
    return '<h2>Hello world</h2>'

@views.route('/course_registration', methods=['GET'])
def courses():
    """
    Render the course registration page.

    Returns:
        Rendered HTML template for the course registration page.
    """
    return render_template('course_reg/index.html')

@views.route('/grade_tracking', methods=['GET'])
def grade():
    """
    Render the grade tracking page.

    Returns:
        Rendered HTML template for the grade tracking page.
    """
    return render_template('course_reg/grade.html')

@views.route('/doctor_medicals', methods=['GET'])
def medicals():
    """
    Render the medical information page.

    Returns:
        Rendered HTML template for the medical information page.
    """
    return render_template('Medical/index.html')

@views.route('/send_message', methods=['POST'])
@login_required
def send_message():
    """
    Send a message from the current user to another user.

    This endpoint receives JSON data containing the receiver's user ID and the message content.
    It creates a new message entry in the database with the current user as the sender.

    Request:
        POST /send_message
        JSON body:
            {
                "receiver_id": int,
                "content": str
            }

    Returns:
        JSON response:
            200 OK:
                {
                    "message": "Message sent successfully"
                }
            400 Bad Request:
                {
                    "error": "Missing required fields"
                }
    """
    data = request.get_json()
    receiver_id = data.get('receiver_id')
    content = data.get('content')
    
    if not receiver_id or not content:
        return jsonify({'error': 'Missing required fields'}), 400
    
    message = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content
    )
    db.session.add(message)
    db.session.commit()
    
    return jsonify({'message': 'Message sent successfully'}), 200

@views.route('/messages', methods=['GET'])
@login_required
def get_messages():
    """
    Retrieve all messages involving the current user and the last message sent by the user.
    
    Returns:
        JSON response:
            200 OK:
                {
                    "messages": [
                        {
                            "id": int,
                            "sender_id": int,
                            "sender_name": str,
                            "receiver_id": int,
                            "content": str,
                            "timestamp": str
                        },
                        ...
                    ],
                    "last_message": str
                }
    """
    user_id = current_user.id
    
    try:
        # Fetch messages involving the current user
        messages = Message.query.filter(
            (Message.sender_id == user_id) | (Message.receiver_id == user_id)
        ).all()

        # Convert message objects to a list of dictionaries with sender names
        messages_list = [
            {
                'id': msg.id,
                'sender_id': msg.sender_id,
                'sender_name': f"{User.query.get(msg.sender_id).first_name} {User.query.get(msg.sender_id).last_name}",
                'receiver_id': msg.receiver_id,
                'content': msg.content,
                'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            for msg in messages
        ]
        
        # Fetch the last message sent by the user
        last_message = Message.query.filter_by(sender_id=user_id).order_by(Message.timestamp.desc()).first()
        last_message_content = last_message.content if last_message else None

        return jsonify({'messages': messages_list, 'last_message': last_message_content}), 200
    
    except Exception as e:
        # Handle any errors
        return jsonify({'error': str(e)}), 500


@views.route('/chat')
@login_required
def chat():
    """
    Render the chat interface for the logged-in user.
    
    This endpoint renders an HTML template for the chat interface.
    
    Request:
        GET /chat
    
    Returns:
        HTML page with the chat interface.
    """
    return render_template('Medical/message.html', user=current_user)

@views.route('/doctor/messages/list/<int:doctor_id>', methods=['GET'])
def get_doctor_message_list(doctor_id):
    # Query the database for messages where the receiver is the specified doctor
    received_messages = (
        db.session.query(Message)
        .filter_by(receiver_id=doctor_id)
        .order_by(Message.timestamp.desc())
        .all()
    )

    # Create a dictionary to group messages by sender_id
    grouped_messages = {}
    for msg in received_messages:
        if msg.sender_id not in grouped_messages:
            grouped_messages[msg.sender_id] = {
                'sender_id': msg.sender_id,
                'sender_name': f"{msg.sender.first_name} {msg.sender.last_name}",
                'content': msg.content,
                'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }

    # Convert the grouped messages to a list
    messages_list = list(grouped_messages.values())

    return jsonify({'messages': messages_list})

@views.route('/medical_homepage')
def doctors_homepage():
    return render_template('Doctor/index.html')


@views.route('/doctor/chat/<int:student_id>', methods=['GET'])
def chat_room(student_id):
    # Fetch messages between the doctor and the specified student
    doctor_id = 2  # Replace with the actual logged-in doctor's ID
    messages = Message.query.filter(
        ((Message.sender_id == doctor_id) & (Message.receiver_id == student_id)) |
        ((Message.sender_id == student_id) & (Message.receiver_id == doctor_id))
    ).order_by(Message.timestamp).all()

    # Render the chat room template
    return render_template('Doctor/chat_room.html', student_id=student_id, messages=messages)

@views.route('/doctor/send_message', methods=['POST'])
def send_messages():
    data = request.json
    new_message = Message(
        sender_id=data['sender_id'],  # This should be the doctor's ID
        receiver_id=data['receiver_id'],
        content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'success': True})


@views.route('/verify_registration/<reg_number>', methods=['GET'])
def verify_registration(reg_number):
    """
    Verify if a student with the given matriculation number exists.

    Request:
        GET /verify_registration/<reg_number>

    Returns:
        JSON response:
            {
                "exists": bool
            }
    """
    student = User.query.filter_by(matriculation_number=reg_number).first()
    return jsonify({'exists': student is not None})

@views.route('/submit_medical_report', methods=['POST'])
def submit_medical_report():
    """
    Submit a medical report for a student.

    Request:
        POST /submit_medical_report
        JSON body:
        {
            "regNumber": str,
            "visitDate": str,
            "reasonVisit": str,
            "height": str,
            "weight": str,
            "bloodPressure": str,
            "temperature": str,
            "pulse": str,
            "findings": str,
            "diagnosis": str,
            "treatment": str,
            "doctorName": str,
            "date": str
        }

    Returns:
        JSON response:
            {
                "success": bool,
                "message": str (optional)
            }
    """
    data = request.json
    student = User.query.filter_by(matriculation_number=data['regNumber']).first()

    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 400

    report = MedicalReport(
        student_id=student.id,
        date_of_visit=data['visitDate'],
        reason_for_visit=data['reasonVisit'],
        height=data['height'],
        weight=data['weight'],
        blood_pressure=data['bloodPressure'],
        temperature=data['temperature'],
        pulse=data['pulse'],
        findings=data['findings'],
        diagnosis=data['diagnosis'],
        treatment=data['treatment'],
        doctor_name=data['doctorName'],
        date=data['date']
    )

    db.session.add(report)
    db.session.commit()
    return jsonify({'success': True})

@views.route('/report')
def report():
    """
    Render the medical report form for doctors.

    Returns:
        Rendered HTML template for medical report input.
    """
    return render_template('Doctor/report.html')
