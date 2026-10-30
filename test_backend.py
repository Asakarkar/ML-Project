import sys
import numpy as np
import pandas as pd
from backend.main import get_model, preprocess_vector

def run_test():
    m = get_model()
    df = pd.read_csv("Data/arrhythmia.csv", header=None).replace('?', np.nan)
    X = df.iloc[:, :-1].apply(pd.to_numeric, errors='coerce').values
    y = df.iloc[:, -1].astype(int).values

    # Row 3 is Normal (Class 1)
    vec = X[3:4]
    vec_pca = preprocess_vector(vec, m)
    pred = int(m['classifier'].predict(vec_pca)[0])
    probs = m['classifier'].predict_proba(vec_pca)[0]
    classes = list(m['classifier'].classes_)
    pred_idx = classes.index(pred)
    conf = float(probs[pred_idx]) * 100

    print(f"Row 3 -> True: {y[3]}, Predicted: {pred}, Confidence: {conf:.2f}%")

    # Row 1 is Sinus Bradycardia (Class 6)
    vec1 = X[1:2]
    vec_pca1 = preprocess_vector(vec1, m)
    pred1 = int(m['classifier'].predict(vec_pca1)[0])
    probs1 = m['classifier'].predict_proba(vec_pca1)[0]
    pred_idx1 = classes.index(pred1)
    conf1 = float(probs1[pred_idx1]) * 100
    print(f"Row 1 -> True: {y[1]}, Predicted: {pred1}, Confidence: {conf1:.2f}%")

if __name__ == "__main__":
    run_test()
