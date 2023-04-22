import csv
from sentiment_analysis import predict_tweet

# Read the tweets from the CSV file
tweets = []
with open('../static/data/2021-October_dataset.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tweets.append(row)

# Group the English tweets by their trend
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

# Write each group of tweets to a separate CSV file
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
