import tweepy as tw
consumer_key = 'ghMquretmt48Zxvhh7LDtmjuE'
consumer_secret = 'nSwTBYzOAKFQFCUjIqsF5ahgnlzU1HyGwCe4Z7pyOUEZ0uf0mv'
access_token = '797893716023373824-xiURxyBYevxxJEA6G2ZwUpwrk3O3LK0'
access_token_secret = 'pN39KYOdTfCIqNZiwWPEFQOZDZalPh0SB2IzRxIJiWEpT'

# Authenticate to Twitter
auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

# Create API object
api = tw.API(auth)

# Specify the screen name of the user for which you want to get the user ID
# screen_name = "TomAaAaAaATeau"

# Get the user object for the specified screen name
user = api.get_user(id="797893716023373824")

# Print the user ID
