# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# Creation: 2023-01-24
# Last review : 2023 - 03 - 25

# Path : flaskapp/utils/scraping_tweets.py
import time
import csv
from bs4 import BeautifulSoup
import requests
from sentiment_analysis import predict_tweet
import langid


def scrape_tweets(trend):
    url = f"https://nitter.net/search?f=tweets&q={trend}&since=&until=&near="
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    tweet_container = soup.find('div', class_="timeline")

    neg = []
    neu = []
    pos = []
    tweets = []

    for k in range(5):
        for i, tweet in enumerate(tweet_container.find_all('div', class_="tweet-content media-body")):
            if i >= 30:
                break
            tweet = tweet.text.strip()
            if (is_english(tweet)):
                tweets.append(tweet)
                scores = predict_tweet(tweet)
                neg.append(scores[0])
                neu.append(scores[1])
                pos.append(scores[2])

        time.sleep(5)

    with open(f"static/data/Your-Live-Data/{trend}.csv", 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["tweet_id", "tweet_datetime", "tweet_text", "searched_by_hashtag", "user_name", "retweet_count", "Roberta_neg",
                        "Roberta_neu", "Roberta_pos"])
        for i, tweet in enumerate(tweets, start=1):
            writer.writerow(
                [i, 0, tweet, f"{trend}", "twitter user", 0, neg[i-1], neu[i-1], pos[i-1]])


def is_english(tweet: str):
    return langid.classify(tweet)[0] == "en"


# import snscrape.modules.twitter as sntwitter
# def scrape_tweet(trend: str):
#     neg = []
#     neu = []
#     pos = []
#     query = trend + " since:2023-04-16"
#     data = pd.DataFrame(itertools.islice(
#         sntwitter.TwitterSearchScraper(query).get_items(), 500))  # None ?
#     data = data[data.apply(is_english, axis=1)]
#     df = data[['id', 'date', 'rawContent', 'user', 'replyCount',
#                'retweetCount', 'likeCount', 'quoteCount']]
#     for k in range(0, len(df)):
#         tweet = df["rawContent"].iloc[k]
#         scores = predict_tweet(tweet)
#         neg.append(scores[0])
#         neu.append(scores[1])
#         pos.append(scores[2])
#     df["Roberta_neg"] = neg
#     df["Roberta_neu"] = neu
#     df["Roberta_pos"] = pos
#     df.to_csv("static/data/" + trend + ".csv", index=False)
