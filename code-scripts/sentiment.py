# Code Kaggle à mettre ici quand c'est ok
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from spicy import softmax

MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)


def predict_tweet(tweet):
    encoded = tokenizer.encode_plus(tweet, return_tensors='pt')
    output = model(**encoded)
    scores = softmax((output[0].detach().numpy()))
    return scores


predict_tweet("Hello world!")
