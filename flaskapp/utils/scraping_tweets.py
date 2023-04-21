# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# Creation: 2023-01-24
# Last review : 2023 - 03 - 25

# Path : flaskapp/utils/scraping_tweets.py
import pandas as pd
import itertools
import snscrape.modules.twitter as sntwitter
from datetime import datetime
from sentiment_analysis import predict_tweet


def scrape_tweet(trend: str):
    neg = []
    neu = []
    pos = []
    query = trend + " since:2023-04-16"
    data = pd.DataFrame(itertools.islice(
        sntwitter.TwitterSearchScraper(query).get_items(), 500))  # None ?
    data = data[data.apply(is_english, axis=1)]
    df = data[['id', 'date', 'rawContent', 'user', 'replyCount',
               'retweetCount', 'likeCount', 'quoteCount']]
    for k in range(0, len(df)):
        tweet = df["rawContent"].iloc[k]
        scores = predict_tweet(tweet)
        neg.append(scores[0])
        neu.append(scores[1])
        pos.append(scores[2])
    df["Roberta_neg"] = neg
    df["Roberta_neu"] = neu
    df["Roberta_pos"] = pos
    df.to_csv("static/data/" + trend + ".csv", index=False)


def is_english(tweet: str):
    return tweet.lang == 'en'


scrape_tweet("Maguire")
