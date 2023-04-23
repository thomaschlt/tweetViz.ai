from scraping_trends import scrape_trends
from scraping_tweets_from_trends import scrape_trends_from_file
import os

dir = "static/data/Your-Live-Data/"
for f in os.listdir(dir):
    os.remove(os.path.join(dir, f))
scrape_trends()
scrape_trends_from_file()
