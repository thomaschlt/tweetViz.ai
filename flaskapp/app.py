from flask import Flask, render_template
import os

app = Flask(__name__, static_url_path='/static')


@app.route('/csv_files')
def get_csv_files():
    csv_files = []
    for filename in os.listdir('static/data'):
        if filename.endswith('.csv'):
            csv_files.append(os.path.join('static/data', filename))
    return {'files': csv_files}


@app.route("/")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run()