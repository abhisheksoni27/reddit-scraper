import pandas as pd
df = pd.read_json("master/master.json")
df.to_csv("master/master.csv")
