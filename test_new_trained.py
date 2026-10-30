import urllib.request
import json
import pandas as pd

url = "http://127.0.0.1:8000/api/v1/predict"
df = pd.read_csv("Data/arrhythmia.csv", header=None)

def clean_val(x):
    if pd.isna(x) or str(x).strip() == '?' or str(x).strip() == '':
        return None
    return float(x)

# Row 3 is Normal ECG
row3 = [clean_val(x) for x in df.iloc[3, :279].tolist()]
payload = json.dumps({"features": row3}).encode('utf-8')
req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print("Row 3 Prediction:")
    print("  Class Code:", res["class_code"])
    print("  Class Name:", res["class_name"])
    print("  Confidence:", res.get("confidence"))
    print("  Top Probabilities:", res.get("top_probabilities"))

# Row 1 is Sinus Bradycardia
row1 = [clean_val(x) for x in df.iloc[1, :279].tolist()]
payload = json.dumps({"features": row1}).encode('utf-8')
req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print("Row 1 Prediction:")
    print("  Class Code:", res["class_code"])
    print("  Class Name:", res["class_name"])
    print("  Confidence:", res.get("confidence"))
    print("  Top Probabilities:", res.get("top_probabilities"))

