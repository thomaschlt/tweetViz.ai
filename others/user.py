# Purpose: Collecting tweets from Twitter using snscrape
# Author:  Thomas Chimbault
# 2023-01-24

# Path : code-scripts/dataCollection.py


import csv
import pandas as pd
import snscrape.modules.twitter as sntwitter
pd.DataFrame(itertools.islice(sntwitter.TwitterSearchScraper(
    '"#vaccine since:2021-05-01 until:2021-07-30"').get_items(), 50000))


query = "elonmusk"
tweets = []
limit = 2000
counter = 0

with open("../processed-data/data.csv", mode='a', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(["date", "username", "tweet_id",
                    "content", "likes", "retweets"])
    while counter < limit:
        for tweet in sntwitter.TwitterUserScraper(query).get_items():
            writer.writerow([tweet.date, tweet.user.username, tweet.id,
                             tweet.content, tweet.likeCount, tweet.retweetCount])
            counter += 1
            if counter >= limit:
                break

print("Done!")


# Access
# API Key : zrKDjKE1JkEWCAFSihlj2na0r
# API Key Secret : TOwsybAFL52eFlS3Emsat3RePdBLw3yb4bmU6KwcPJx4meCvGi
# Bearer Token : AAAAAAAAAAAAAAAAAAAAAGZ3lwEAAAAAs%2BEH%2Bkl515tcXJyz4hfRjT%2F%2FURk%3DWk9rPwPPOrIM7NFHNmzsSEeDVjD4aJ2Yf7FDrWTgAvv6WTYeSa
