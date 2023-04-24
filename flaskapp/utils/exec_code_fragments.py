# But: Centralise toutes les méthodes de tous les modules de scraping
# Auteur:  Thomas Chimbault
# Creation: 2023-01-24
# Dernière mise à jour : 2023 - 04 - 23

# Path : flaskapp/utils/exec_code_fragments.py

from scraping_trends import scrape_trends
from scraping_tweets_from_trends import scrape_trends_from_file
import os

dir = "static/data/Your-Live-Data/"
for f in os.listdir(dir):
    os.remove(os.path.join(dir, f))
scrape_trends()
scrape_trends_from_file()
