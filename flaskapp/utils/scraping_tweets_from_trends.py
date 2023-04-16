from scraping_tweets import scrape_tweet
from csv import reader


def scrape_trends_from_file(file_path="trends.csv"):
    with open(file_path, 'r') as f:
        r = reader(f)
        header = next(r)
        if header != None:
            for row in r:
                scrape_tweet(row[0])
