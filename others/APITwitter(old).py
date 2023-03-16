import tweepy as tw

# Replace with your own API credentials
consumer_key = 'ghMquretmt48Zxvhh7LDtmjuE'
consumer_secret = 'nSwTBYzOAKFQFCUjIqsF5ahgnlzU1HyGwCe4Z7pyOUEZ0uf0mv'
access_token = '797893716023373824-xiURxyBYevxxJEA6G2ZwUpwrk3O3LK0'
access_token_secret = 'pN39KYOdTfCIqNZiwWPEFQOZDZalPh0SB2IzRxIJiWEpT'

auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tw.API(auth)

user_id = 'USER_ID'

followers = []
for follower in tw.Cursor(api.followers_ids, id=user_id).items():
    followers.append(follower)

for follower in followers:
    print(follower)

# Access
# 797893716023373824-xiURxyBYevxxJEA6G2ZwUpwrk3O3LK0 access token
# access token secret : pN39KYOdTfCIqNZiwWPEFQOZDZalPh0SB2IzRxIJiWEpT
# Bearer Token : AAAAAAAAAAAAAAAAAAAAAGZ3lwEAAAAAYjNLY1jc3RHgBddPqlQd%2Buj0fVY%3DtTO0XId13Yd6sPNzJQa7tGuUlhrXPYEbYlCo3CS6iH6jnaLWrj
