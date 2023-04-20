import os
import pandas as pd

csv_dir = "../data/trends-now/"

df_list = []

for filename in os.listdir(csv_dir):
    if filename.endswith(".csv"):
        filepath = os.path.join(csv_dir, filename)
        df = pd.read_csv(filepath)
        df['source'] = filename

        df_list.append(df)


merged_pdf = pd.concat(df_list, ignore_index=True, sort=False)
merged_pdf.to_csv("../merged.csv", index=False)
