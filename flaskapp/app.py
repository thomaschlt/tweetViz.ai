from flask import Flask, render_template
import os

# Définition d'une application Flask
app = Flask(__name__, static_url_path='/static')

# Permet de faire le lien pour récupérer les fichiers CSV d'un dossier en particulier
@app.route('/csv_files/<folder_name>')
def get_csv_files(folder_name):
    csv_files = []
    for filename in os.listdir(f'static/data/{folder_name}'):
        if filename.endswith('.csv'):
            csv_files.append(os.path.join(
                f'static/data/{folder_name}', filename))
    return {'files': csv_files}

# Permet de récupérer l'intégralité des dossiers contenu dans le dossier static/data
@app.route('/folders')
def get_folders():
    data_dir = os.path.join('static', 'data')
    folders = [folder for folder in os.listdir(
        data_dir) if os.path.isdir(os.path.join(data_dir, folder))]
    return {'folders': folders}

# Gère la navigation vers la page d'accueil
@app.route("/")
def home():
    return render_template("home.html")

# Gère la navigation vers la page de visualisation des données
@app.route("/graph", methods=['POST'])
def graph():
    return render_template("graph.html")

# Permet d'exécuter le script python utils/exec_code_fragments.py et recharge la page graph.html avec les nouvelles données
@app.route("/execute_script", methods=['POST'])
def execute_script():
    script_path = os.path.abspath('utils/exec_code_fragments.py')
    os.system('python3 ' + script_path)
    return render_template("graph.html")


if __name__ == "__main__":
    app.run()
