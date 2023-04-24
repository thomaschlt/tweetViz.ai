# But: Effectue une analyse de sentiment à l'aide d'un modèle Hugging Face pour un tweet en particulier
# Auteur:  Thomas Chimbault
# Creation: 2023-01-24
# Dernière mise à jour : 2023 - 04 - 23

# Path : flaskapp/utils/scraping_tweets.py

from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax

MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)


def predict_tweet(tweet):
    encoded_text = tokenizer(tweet, return_tensors='pt')
    output = model(**encoded_text)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    scores_dict = [
        scores[0],
        scores[1],
        scores[2]
    ]
    return scores_dict
