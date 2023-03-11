# Code Kaggle à mettre ici
import pandas as pd

data = pd.read_csv("mini.csv")
data.drop(['a'], inplace=True, axis=1)
