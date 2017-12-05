from flask import Flask, request, jsonify, render_template, url_for, send_file
from flask_jsglue import JSGlue
import sqlite3
import pdfkit
import html
from io import BytesIO

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
def export_pdf():
    if request.method == 'POST':
        pdf_string = request.form["output_data"]
        encoded = html.unescape(pdf_string)
        options = {"orientation": "landscape"}
        pdf = pdfkit.from_string(pdf_string, False, options=options)
        pdf_out = BytesIO(pdf)

        return send_file(pdf_out, "output.pdf")
