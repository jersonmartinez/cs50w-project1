import os
import json
from flask import Flask, render_template, request, session, redirect, flash
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL not found!")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

Dict_Phrases = [
    {'Seas quien seas, hagas lo que hagas, cuando deseas con firmeza alguna cosa es porque este deseo nació en el alma del universo.':'El Alquimista (Paulo Coelho)'},
    {'Hay que tener mucho valor para oponernos a nuestros enemigos, pero mucho más para desafiar a nuestros amigos':'Harry Potter y la Piedra Filosofal'},
    {'El mundo era tan reciente que muchas cosas carecían de nombre, y para nombrarlas había que señalarlas con el dedo':'Cien Años de Soledad (Gabriel García Márquez)'},
    {'Amor y deseo son dos cosas diferentes; que no todo lo que se ama se desea, ni todo lo que se desea se ama':'Don Quijote de la Mancha (Miguel de Cervantes)'},
    {'¡Qué maravilloso es que nadie necesite esperar ni un solo momento antes de comenzar a mejorar el mundo!':'El Diario de Ana Frank (Ana Frank)'},
    {'No todo lo que es de oro reluce, ni toda la gente errante anda perdida':'El Señor de los Anillos (J.R.R. Tolkien)'}
]

@app.route('/')
def index():
    return render_template("index.html", recent_books = get_recent_books(), old_books = get_old_books(), len = len(Dict_Phrases), Dict_Phrases = Dict_Phrases)

@app.route("/login", methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    result = db.execute("SELECT * FROM users WHERE username=:username", {"username": username}).fetchone()

    if not result:
        return 'incorrect_username'
    else:
        if check_password_hash(result[2], password):
            result_info = db.execute("SELECT * FROM users_info WHERE username=:username", {"username": username}).fetchone()
            session["username"] = result[1]
            session["nickname"] = result_info[1]

            return 'Ok'
        else:
            return 'incorrect_password'

@app.route("/signin", methods=['POST'])
def signin():
    nickname = request.form.get('nickname')
    username = request.form.get('username')
    password = request.form.get('password')
    email    = request.form.get('email')

    validate_username = db.execute("SELECT * FROM users WHERE username=:username", {"username": username}).rowcount
    
    if validate_username != 0:
        return 'user_exists'
    else:
        validate_email = db.execute("SELECT * FROM users_info WHERE email=:email", {"email": email}).rowcount
        if validate_email != 0:
            return 'email_exists'
        else:
            hashed_password = generate_password_hash(password)
            db.execute("INSERT INTO users_info (username, nickname, email) VALUES (:username, :nickname, :email)", {"username": username, "nickname": nickname, "email": email})
            db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", {"username": username, "password": hashed_password})
            db.commit()
            session["username"] = username
            session["nickname"] = nickname
            return 'Ok'

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/get_my_books", methods=["POST", "GET"])
def get_my_books():
    books = db.execute("SELECT * FROM books;").fetchall()

    if not books:
        return 'there_is_not_records'
    else:
        row = []

        for item in books:
            row.append([item['isbn'], item['title'], item['author'] , item['year'], item['isbn']])

        return json.dumps( row )

def get_recent_books():
    books = db.execute("SELECT * FROM books ORDER BY year DESC LIMIT 9").fetchall()
    if not books:
        return 'there_is_not_records'
    else:
        return books

def get_old_books():
    books = db.execute("SELECT * FROM books ORDER BY year ASC LIMIT 9").fetchall()
    if not books:
        return 'there_is_not_records'
    else:
        return books

@app.route("/update_book", methods=['POST'])
def update_book():
    isbn    = request.form.get('isbn')
    title   = request.form.get('title')
    author  = request.form.get('author')
    year    = request.form.get('year')

    result = db.execute("UPDATE books SET title=:title, author=:author, year=:year WHERE isbn=:isbn", {"isbn": isbn, "title": title, "author": author, "year": year})
    db.commit()
    if not result:
        return 'not_updated'
    else:
        return 'Ok'

@app.route("/delete_book", methods=['POST'])
def delete_book():
    isbn = request.form.get('isbn')

    result = db.execute("DELETE FROM books WHERE isbn=:isbn", {"isbn": isbn})
    db.commit()
    
    if not result:
        return 'not_deleted'
    else:
        return 'Ok'

@app.route("/add_review", methods=['POST'])
def add_review():
    isbn    = request.form.get('isbn')
    review  = request.form.get('review')
    stars   = request.form.get('stars')

    result = db.execute("INSERT INTO reviews (username, isbn, review, rating) VALUES (:username, :isbn, :review, :rating)", {"username": session["username"], "isbn": isbn, "review": review, "rating": stars})
    db.commit()

    if not result:
        return 'not_added'
    else:
        return 'Ok'


@app.route("/get_all_reviews_by_book", methods=["POST"])
def get_all_reviews_by_book():
    isbn = request.form.get('isbn')

    print("Algo: " + isbn)

    reviews = db.execute("SELECT * FROM reviews WHERE isbn=:isbn ORDER BY id DESC;", {"isbn": isbn}).fetchall()
    db.commit()

    if not reviews:
        return 'there_is_not_records'
    else:
        row = []

        for item in reviews:
            row.append([item['isbn'], item['username'], item['rating'] , item['review']])

        return json.dumps( row )

if __name__ == '__main__':
    app.run(debug=True)