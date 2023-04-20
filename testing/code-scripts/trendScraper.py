# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# 2023-01-24

# Path : code-scripts/dataCollection.py

### TO DO ###
# - add a function to check the size
import pandas as pd
import itertools
import snscrape.modules.twitter as sntwitter
from datetime import datetime

# start_time = datetime.now()


def scrape_trend(trend: str):
    # i got no space between the two strings clown clown
    query = trend + " since:2023-03-20"
    data = pd.DataFrame(itertools.islice(
        sntwitter.TwitterSearchScraper(query).get_items(), 500))  # None ?
    data = data[data.apply(is_english, axis=1)]
    df = data[['id', 'date', 'rawContent', 'user', 'replyCount',
               'retweetCount', 'likeCount', 'quoteCount']]
    df.to_csv(trend + ".csv", index=False)


def is_english(tweet):
    return tweet.lang == 'en'

# end_time = datetime.now()

# Printing the time duration for scraping these tweets
# print('Duration: {}'.format(end_time - start_time))
# data.to_csv("dataset.csv")
