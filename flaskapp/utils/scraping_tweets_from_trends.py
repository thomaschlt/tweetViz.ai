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
