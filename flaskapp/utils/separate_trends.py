# But: Permet de traiter des fichiers CSV bruts et de les transformer en fichiers CSV contenant les tweets et leur analyse de sentiment
# Auteur:  Thomas Chimbault
# Creation: 2023-01-24
# Dernière mise à jour : 2023 - 04 - 21

# Path : flaskapp/utils/separate_trends.py

import csv
from sentiment_analysis import predict_tweet

# Lis les tweets depuis le fichier CSV
tweets = []
with open('../static/data/2021-October_dataset.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tweets.append(row)

# Groupe les tweets anglais par tendance
tweets_by_trend = {}
for tweet in tweets:
    tweet_text = tweet['tweet_text']
    if not tweet_text or not tweet['searched_by_hashtag']:
        continue
    if (tweet["searched_hashtag_country"] not in ["United States", "United Kingdom", "Australia"]):
        continue
    trend = tweet['searched_by_hashtag']
    if trend not in tweets_by_trend:
        tweets_by_trend[trend] = []
    tweets_by_trend[trend].append(tweet)

# Écris tendance dans un fichier CSV séparé avec les tweets et leur analyse de sentiment
for trend, trend_tweets in tweets_by_trend.items():
    filename = trend.replace('#', '') + '.csv'
    with open(f'../static/data/2021-October-trends/{filename}', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(list(trend_tweets[0].keys()) +
                        ['Roberta_neg', 'Roberta_neu', 'Roberta_pos'])
        for tweet in trend_tweets:
            tweet_text = tweet["tweet_text"]
            scores = predict_tweet(tweet_text)
            writer.writerow(list(
                tweet.values()) + scores)
