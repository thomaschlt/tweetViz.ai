import tweepy as tw

# Replace with your own API credentials
key = 'ghMquretmt48Zxvhh7LDtmjuE'
secret_consumer = 'nSwTBYzOAKFQFCUjIqsF5ahgnlzU1HyGwCe4Z7pyOUEZ0uf0mv'
token = '797893716023373824-xiURxyBYevxxJEA6G2ZwUpwrk3O3LK0'
access_token_secret = 'pN39KYOdTfCIqNZiwWPEFQOZDZalPh0SB2IzRxIJiWEpT'

auth = tw.OAuthHandler(key, secret_consumer)
auth.set_access_token(token, access_token_secret)

api = tw.API(auth)
user_id = 'USER_ID'
followers = []
for follower in tw.Cursor(api.followers_ids, id=user_id).items():
    followers.append(follower)

for follower in followers:
    print(follower)
