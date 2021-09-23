import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Books(db.Model):
    __tablename__   = "books"
    isbn            = db.Column(db.String, primary_key=True)
    title           = db.Column(db.String, nullable=False)
    author          = db.Column(db.String, nullable=False)
    year            = db.Column(db.String, nullable=False)

    def __init__(self, isbn, title, author,year):
        self.isbn   = isbn
        self.title  = title
        self.author = author
        self.year   = year

class Users(db.Model):
    __tablename__   = "users"
    id              = db.Column(db.Integer, primary_key=True)
    username        = db.Column(db.String(80), unique=True, nullable=False)
    password        = db.Column(db.String(120), unique=True, nullable=False)

    def __init__(self, username, email):
        self.username   = username
        self.password   = email

    def __repr__(self):
        return '<User %r>' % self.username

class UserInfo(db.Model):
    __tablename__   = "users_info"
    id              = db.Column(db.Integer, primary_key=True)
    nickname        = db.Column(db.String(80), unique=True, nullable=False)
    email           = db.Column(db.String(80), unique=True, nullable=False)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def __init__(self, nickname, email, user_id):
        self.nickname   = nickname
        self.email      = email
        self.user_id    = user_id

    def __repr__(self):
        return '<User %r>' % self.nickname

db.create_all()

def addUser(user, pwd, nickname):
    usr = Users(user, pwd)
    #db.session.add(usr)
    #db.session.add(UserInfo(nickname, usr.id))


addUser('admin', '1234', 'nick')
addUser('user', '4321', 'nick')

db.session.commit()
users = Users.query.all()
users_info = UserInfo.query.all()
print(users, users_info)

del db