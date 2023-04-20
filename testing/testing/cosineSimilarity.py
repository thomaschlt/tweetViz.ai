from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

string1 = "Can i have an ice cream ?"
string2 = "I really wanna an ice cream !"

vectorizer = CountVectorizer().fit_transform([string1, string2])

cosine_similarities = cosine_similarity(vectorizer[0], vectorizer[1])
print(cosine_similarities[0][0])
