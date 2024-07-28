"""
Author: Scriptpythonic
Description: This module contains authentication routes for user sign-up, login, and Google OAuth integration.
"""

from flask import Blueprint, request, jsonify, abort, redirect, url_for
from oauthlib.oauth2 import WebApplicationClient
from flask_login import login_user, logout_user, login_required
import requests
from . import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

# Create a Blueprint for authentication routes
auth = Blueprint('auth', __name__)

# Allow insecure transport (HTTP) for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@auth.route('/signup', methods=['POST'])
def signup():
    """
    Handle user signup requests.
    Expected JSON payload:
    {
        "first_name": "FirstName",
        "last_name": "LastName",
        "matriculation_number": "123456",
        "cgpa": "4.0",
        "email": "user@example.com",
        "password": "password123"
    }
    
    Returns:
        JSON response indicating success or failure.
    """
    if request.method == 'POST':
        data = request.json

        # Extract user information from the request
        email = data.get('email').strip().lower()
        matriculation_number = data.get('matriculation_number')

        # Check if the email or matriculation number already exists in the database
        if User.query.filter_by(email=email).first() or User.query.filter_by(matriculation_number=matriculation_number).first():
            return jsonify({'message': 'Email or Matriculation Number already exists'}), 400

        # Hash the user's password
        hashed_password = generate_password_hash(data.get('password'), method='scrypt')

        # Create a new user instance
        new_user = User(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            matriculation_number=matriculation_number,
            cgpa=data.get('cgpa'),
            email=email,
            password=hashed_password
        )
        
        # Add the new user to the database and commit
        db.session.add(new_user)
        db.session.commit()

        # Log in the newly created user
        login_user(new_user)
        return jsonify({'message': 'User created successfully!'}), 201

    # If not a POST request, return a forbidden error
    abort(403)

@auth.route('/login/google')
def google_login():
    """
    Redirect users to Google's OAuth 2.0 server for authentication.

    Returns:
        Redirect response to Google's authorization endpoint.
    """
    # Fetch Google's OAuth 2.0 configuration
    google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Create an OAuth 2.0 client
    client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))

    # Prepare the authorization request URI
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('auth.google_callback', _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@auth.route('/login/google/callback')
def google_callback():
    """
    Handle the callback from Google OAuth 2.0 server and log in the user.

    Returns:
        Redirect response to the home page.
    """
    # Retrieve the authorization code from the callback request
    code = request.args.get("code")
    
    # Fetch Google's OAuth 2.0 configuration
    google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Create an OAuth 2.0 client
    client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))

    # Prepare the token request
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )

    # Exchange the authorization code for an access token
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.getenv('GOOGLE_CLIENT_ID'), os.getenv('GOOGLE_CLIENT_SECRET')),
    )

    # Parse the token response
    client.parse_request_body_response(token_response.text)

    # Fetch user info from Google's userinfo endpoint
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    userinfo = userinfo_response.json()
    email = userinfo["email"]
    google_id = userinfo["sub"]
    
    # Check if the user exists in the database
    user = User.query.filter_by(email=email).first()
    if not user:
        # Create a new user if not found
        user = User(
            email=email,
            first_name=userinfo["given_name"],
            last_name=userinfo["family_name"],
            google_id=google_id
        )
        db.session.add(user)
        db.session.commit()

    # Log in the user
    login_user(user)
    return redirect(url_for('views.home'))

@auth.route('/login', methods=['POST'])
def login():
    """
    Handle user login requests.
    Expected JSON payload:
    {
        "email": "user@example.com",
        "password": "password123"
    }
    
    Returns:
        JSON response indicating login success or failure.
    """
    if request.method == 'POST':
        data = request.json
        email = data.get('email').strip().lower()
        password = data.get('password')

        # Retrieve the user from the database
        user = User.query.filter_by(email=email).first()

        # Check if the user exists and if the password is correct
        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }), 200

        # Invalid credentials
        return jsonify({'message': 'Invalid email or password'}), 401

    # Method not allowed for non-POST requests
    return jsonify({'message': 'Method not allowed'}), 405

@auth.route('/logout')
@login_required
def logout():
    """
    Handle user logout requests.

    Returns:
        JSON response indicating logout success.
    """
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200
