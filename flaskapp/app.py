from flask import Flask, render_template
import os


app = Flask(__name__, static_url_path='/static')


@app.route('/csv_files/<folder_name>')
def get_csv_files(folder_name):
    csv_files = []
    for filename in os.listdir(f'static/data/{folder_name}'):
        if filename.endswith('.csv'):
            csv_files.append(os.path.join(
                f'static/data/{folder_name}', filename))
    return {'files': csv_files}


@app.route('/folders')
def get_folders():
    data_dir = os.path.join('static', 'data')
    folders = [folder for folder in os.listdir(
        data_dir) if os.path.isdir(os.path.join(data_dir, folder))]
    return {'folders': folders}


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/graph", methods=['POST'])
def graph():
    return render_template("graph.html")


# Was used to execute the script that generates the CSV files from scraping the tweets
# @app.route("/execute_script", methods=['POST'])
# def execute_script():
#     script_path = os.path.abspath('utils/exec_code_fragments.py')
#     os.system('python3 ' + script_path)
#     return render_template("graph.html")


if __name__ == "__main__":
    app.run()
