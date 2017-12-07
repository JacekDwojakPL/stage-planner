import HTMLParser
from flask import Flask, request, jsonify, render_template, url_for, send_file
from flask_jsglue import JSGlue
import sqlite3
import pdfkit

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
        encoded = HTMLParser.HTMLParser().unescape(pdf_string)
        options = {
                    '--orientation': 'landscape',
                    '--encoding': 'UTF-8',
                    '--print-media-type': '',
                    '--dpi': '300',
                    '--margin-top': '5mm',
                    '--margin-bottom': '5mm',
                    '--margin-left': '5mm',
                    '--margin-right': '5mm',
                    '--zoom': '1.10'
                    }
        pdf = pdfkit.from_string(pdf_string, False, options=options)
        pdf_out = BytesIO(pdf)

        return send_file(pdf_out, "output.pdf")
