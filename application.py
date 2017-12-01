from flask import Flask, request, jsonify, render_template, url_for
from flask_jsglue import JSGlue
import sqlite3

app = Flask(__name__)
JSGlue(app)
conn = sqlite3.connect('data.db')
db = conn.cursor()

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/instrument")
def instrument():
    user_input = request.args.get("name")
    query = "SELECT * FROM {}".format(user_input)
    db.execute(query)
    rows = db.fetchall()
    return(jsonify(rows))

@app.route("/export", methods=['POST'])
def pdf_export():
    data = request.form('data')
    print(data)
    return "succes"
