from flask import Flask, Blueprint, jsonify, request
from twilio.rest import Client
import os

app = Flask(__name__)
teleg = Blueprint('teleg', __name__)

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@teleg.route('/medical', methods=['POST'])
def send_whatsapp_message():
    data = request.json
    user_message = data.get('userMessage')
    doctor_whatsapp_number = 'whatsapp:+2347036626371'  

    if not user_message:
        return jsonify({'error': 'Missing userMessage'}), 400

    message = client.messages.create(
        body=user_message,
        from_=TWILIO_WHATSAPP_NUMBER,
        to=doctor_whatsapp_number
    )

    if message.sid:
        return jsonify({'status': 'Message sent'}), 200
    else:
        return jsonify({'error': 'Failed to send message'}), 500
