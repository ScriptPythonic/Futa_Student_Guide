from flask import Flask,Blueprint,render_template
from flask_login import current_user

views = Blueprint('views', __name__)

@views.route('/', methods={'GET'})
def home():
    return render_template('main/main.html',current_user=current_user)

@views.route('/profile', methods={'GET'})
def profile():
    return '<h2> Hello world </h2>'

@views.route('/course_registration',methods=['get'])
def courses():
    return render_template('course_reg/index.html')

@views.route('/grade_tracking',methods=['get'])
def grade():
    return render_template('course_reg/grade.html')

@views.route('/doctor_medicals',methods=['get'])
def medicals():
    return render_template('Medical/index.html')

    