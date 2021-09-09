import os

from flask import Flask, render_template, request
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

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
    {'Seas quien seas, hagas lo que hagas, cuando deseas con firmeza alguna cosa es porque este deseo nació en el alma del universo. Es tu misión en la tierra':'El Alquimista (Paulo Coelho)'},
    {'Hay que tener mucho valor para oponernos a nuestros enemigos, pero mucho más para desafiar a nuestros amigos':'Harry Potter y la Piedra Filosofal'},
    {'El mundo era tan reciente que muchas cosas carecían de nombre, y para nombrarlas había que señalarlas con el dedo':'Cien Años de Soledad (Gabriel García Márquez)'},
    {'Amor y deseo son dos cosas diferentes; que no todo lo que se ama se desea, ni todo lo que se desea se ama':'Don Quijote de la Mancha (Miguel de Cervantes)'},
    {'¡Qué maravilloso es que nadie necesite esperar ni un solo momento antes de comenzar a mejorar el mundo!':'El Diario de Ana Frank (Ana Frank)'},
    {'No todo lo que es de oro reluce, ni toda la gente errante anda perdida':'El Señor de los Anillos (J.R.R. Tolkien)'}
]

@app.route('/')
def index():
    return render_template("index.html", len = len(Dict_Phrases), Dict_Phrases = Dict_Phrases)

if __name__ == '__main__':
    app.run(debug=False)