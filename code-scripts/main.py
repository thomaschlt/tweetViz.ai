from trendScraper import scrape_trend
from csv import reader

with open('trends.csv', 'r') as f:
    r = reader(f)
    header = next(r)
    if header != None:
        for row in r:
            scrape_trend(row[0])
