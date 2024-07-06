from flask import Blueprint, request, jsonify, abort, redirect, url_for
from oauthlib.oauth2 import WebApplicationClient
from flask_login import login_user, logout_user, login_required, current_user
import requests
from . import db
from .models import User
import json
from werkzeug.security import generate_password_hash, check_password_hash
import os

auth = Blueprint('auth', __name__)

# Allow insecure transport (HTTP) for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@auth.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        # Extract data from JSON request
        first_name = request.json.get('first_name')
        last_name = request.json.get('last_name')
        matriculation_number = request.json.get('matriculation_number')
        cgpa = request.json.get('cgpa')
        email = request.json.get('email').strip().lower()
        password = request.json.get('password')

        # Check if the email or matriculation number already exists (case-sensitive check)
        if User.query.filter_by(email=email).first() or User.query.filter_by(matriculation_number=matriculation_number).first():
            return jsonify({'message': 'Email or Matriculation Number already exists'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password, method='scrypt')

        # Create a new user
        new_user = User(
            first_name=first_name, 
            last_name=last_name, 
            matriculation_number=matriculation_number, 
            cgpa=cgpa,
            email=email, 
            password=hashed_password 
        )
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return jsonify({'message': 'User created successfully!'}), 201

    # Handling GET requests (shouldn't be accessible)
    abort(403)

@auth.route('/login/google')
def google_login():
    google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('auth.google_callback', _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@auth.route('/login/google/callback')
def google_callback():
    code = request.args.get("code")
    google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.getenv('GOOGLE_CLIENT_ID'), os.getenv('GOOGLE_CLIENT_SECRET')),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    userinfo = userinfo_response.json()
    email = userinfo["email"]
    google_id = userinfo["sub"]
    first_name = userinfo["given_name"]
    last_name = userinfo["family_name"]

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            google_id=google_id
        )
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect(url_for('views.home'))

@auth.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.json.get('email').strip().lower()
        password = request.json.get('password')

        # Retrieve user from database based on email
        user = User.query.filter_by(email=email).first()

        # Check if user exists and verify password
        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({'message': 'Login successful', 'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }}), 200

        # Invalid credentials
        return jsonify({'message': 'Invalid email or password'}), 401

    # Method not allowed
    return jsonify({'message': 'Method not allowed'}), 405

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

