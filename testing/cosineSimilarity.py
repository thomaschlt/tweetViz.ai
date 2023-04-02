from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

string1 = "What Biden is so dumb ?"
string2 = "Omg ! Biden is so stupid !"

vectorizer = CountVectorizer().fit_transform([string1, string2])

cosine_similarities = cosine_similarity(vectorizer[0], vectorizer[1])
print(cosine_similarities[0][0])
