"""
Author: Scriptpythonic
Description: This module handles sending WhatsApp messages using the Twilio API. 
It provides an endpoint to send medical-related messages from a user to a doctor's WhatsApp number.
"""

from flask import Flask, Blueprint, jsonify, request
from twilio.rest import Client
import os

# Initialize the Flask application
app = Flask(__name__)

# Create a Blueprint for the Twilio WhatsApp functionality
teleg = Blueprint('teleg', __name__)

# Twilio credentials and configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@teleg.route('/medical', methods=['POST'])
def send_whatsapp_message():
    """
    Send a WhatsApp message to a doctor's number.

    Expected JSON payload:
    {
        "userMessage": "Your message here"
    }

    Returns:
        JSON response indicating success or failure of message sending.
    """
    data = request.json

    # Extract the user message from the request data
    user_message = data.get('userMessage')
    doctor_whatsapp_number = 'whatsapp:+2347036626371'  # The doctor's WhatsApp number

    # Validate the presence of userMessage in the request
    if not user_message:
        return jsonify({'error': 'Missing userMessage'}), 400

    try:
        # Send the message using Twilio's API
        message = client.messages.create(
            body=user_message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=doctor_whatsapp_number
        )

        # Check if the message was sent successfully
        if message.sid:
            return jsonify({'status': 'Message sent'}), 200
        else:
            return jsonify({'error': 'Failed to send message'}), 500

    except Exception as e:
        # Handle exceptions and provide an error message
        return jsonify({'error': str(e)}), 500

# Register the Blueprint with the Flask application
app.register_blueprint(teleg)

# Main entry point for the Flask application
if __name__ == '__main__':
    app.run(debug=True)
