# But: Appelle la fonction scrape_tweets() sur les tendances enregistrées dans le fichier 'trends.csv'
# Auteur:  Thomas Chimbault
# Creation: 2023-01-24
# Dernière mise à jour : 2023 - 04 - 23

# Path : flaskapp/utils/scraping_tweets_from_trends.py

from scraping_tweets import scrape_tweets
from csv import reader
import time


def scrape_trends_from_file(file_path="utils/trends.csv"):
    with open(file_path, 'r') as f:
        r = reader(f)
        header = next(r)
        if header != None:
            for row in r:
                scrape_tweets(row[0])
