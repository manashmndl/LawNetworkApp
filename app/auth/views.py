from . import auth
from flask import render_template
from config import config
from app import mongo


# @auth.route('/login')
# def login_page():
#     print(mongo.db.users.find_one({'id' : 1}))
#     return render_template('login.html', title='Login')

from wtforms import Form, TextField, validators
from wtforms.validators import DataRequired
from flask import render_template

from . import auth

class LoginForm(Form):
    username = TextField('lg_username', validators=[DataRequired()])


@auth.route('/login', methods=['GET', 'POST'])
def login_page():
    username = None
    form = LoginForm()
    return render_template('login.html', form=form)

@auth.route('/register')
def register_page():
    return render_template('register.html', title='Register')