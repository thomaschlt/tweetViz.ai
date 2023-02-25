# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# 2023-01-24

# Path : code-scripts/dataCollection.py

### TO DO ###
# - add a function to check the size


import pandas as pd
import itertools
import snscrape.modules.twitter as sntwitter
import plotly.graph_objects as go
from datetime import datetime

query = "Biden since:2023-02-23"
# start_time = datetime.now()

data = pd.DataFrame(itertools.islice(
    sntwitter.TwitterSearchScraper(query).get_items(), 500))


def is_english(tweet):
    return tweet.lang == 'en'


data = data[data.apply(is_english, axis=1)]

df = data[['id', 'date', 'rawContent', 'user', 'replyCount',
           'retweetCount', 'likeCount', 'quoteCount']]
df.to_csv("testLang.csv")
# end_time = datetime.now()

# Printing the time duration for scraping these tweets
# print('Duration: {}'.format(end_time - start_time))
# data.to_csv("dataset.csv")
