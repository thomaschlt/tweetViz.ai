# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# 2023-01-24

# Path : code-scripts/dataCollection.py

import snscrape.modules.twitter as sntwitter
import pandas as pd


query = "elonmusk"
tweets = []
limit = 100


for tweet in sntwitter.TwitterUserScraper(query).get_items():
    if len(tweets) == limit:
        break
    else:
        tweets.append([tweet.date, tweet.user.username,
                      tweet.content, tweet.likeCount, tweet.retweetCount])
        # print(tweet.content + "\n")
df = pd.DataFrame(tweets, columns=[
                  'Datetime', 'Username', 'Content', 'Like', 'RT'])
df.to_csv("../processed-data/musk.csv")


# consumer_key = "ZeBeo2BtQ9ZO5ITJPTcmDIuqX"
# consumer_secret = "Z34LvrXYlXVvxEGOewfSWjlZuoEtybOthtqcWZDs6RRfaEx1Wh"
# access_token = "797893716023373824-UXpwgrONfgN2bjtAGnqe1qKpZD3Xkbh"
# access_token_secret = "Zx8fBpbdWsMXpkVqEZORbvfjKqy4NVaViSX0ZMLeTc0sG"
