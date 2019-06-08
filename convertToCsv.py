import pandas as pd
df = pd.read_json("master/master.json")

print(df.label.nunique())

df.to_csv("master/master.csv")
