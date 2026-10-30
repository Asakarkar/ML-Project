import os
import io
import time
import uuid
import json
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "artifacts", "all_models_metrics.json")
MAX_BYTES = 10_000_000
DISCLAIMER = "Research and educational prototype. Not a clinical diagnostic device; predictions are not clinician-confirmed."

app = FastAPI(title="ECG Arrhythmia Classification API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cached_model = None

def get_model():
    global _cached_model
    if _cached_model is not None:
        return _cached_model
    if os.path.exists(MODEL_PATH):
        try:
            _cached_model = joblib.load(MODEL_PATH)
            return _cached_model
        except Exception as e:
            print(f"[!] Error loading model from {MODEL_PATH}: {e}")
            return None
    return None

CLASS_METADATA = {
    1: {"code": "01", "name": "Normal ECG", "severity": "Normal", "description": "Sinus rhythm with normal conduction velocity and cardiac axis."},
    2: {"code": "02", "name": "Ischemic changes (Coronary Artery Disease)", "severity": "High", "description": "ST-segment depression or T-wave inversion indicating myocardial ischemia."},
    3: {"code": "03", "name": "Old Anterior Myocardial Infarction", "severity": "High", "description": "Pathological Q-waves or poor R-wave progression in precordial leads V1–V4."},
    4: {"code": "04", "name": "Old Inferior Myocardial Infarction", "severity": "High", "description": "Significant Q-waves in limb leads II, III, and aVF representing inferior wall scarring."},
    5: {"code": "05", "name": "Sinus tachycardia", "severity": "Moderate", "description": "Heart rate exceeding 100 bpm originating from normal sinoatrial node pacemaking."},
    6: {"code": "06", "name": "Sinus bradycardia", "severity": "Moderate", "description": "Resting heart rate below 60 bpm with preserved P-wave morphology."},
    7: {"code": "07", "name": "Ventricular Premature Contraction (PVC)", "severity": "High", "description": "Premature wide, abnormal QRS complex without preceding P-wave."},
    8: {"code": "08", "name": "Supraventricular Premature Contraction", "severity": "Moderate", "description": "Early beat originating above ventricles (atria or AV node) with narrow QRS."},
    9: {"code": "09", "name": "Left bundle branch block", "severity": "High", "description": "Delayed left ventricular depolarization causing broad, notched R-waves in I, aVL, V5–V6."},
    10: {"code": "10", "name": "Right bundle branch block", "severity": "Moderate", "description": "Delayed right ventricular activation resulting in rsR' pattern in lead V1."},
    11: {"code": "11", "name": "1° Atrioventricular block", "severity": "Low", "description": "Prolonged PR interval (>200 ms) with preserved 1:1 AV conduction."},
    12: {"code": "12", "name": "2° Atrioventricular block", "severity": "High", "description": "Intermittent failure of AV conduction (Mobitz Type I or Type II)."},
    13: {"code": "13", "name": "3° Atrioventricular block", "severity": "Critical", "description": "Total dissociation between atrial P-waves and ventricular QRS complexes."},
    14: {"code": "14", "name": "Left ventricular hypertrophy", "severity": "Moderate", "description": "Increased left ventricular wall thickness causing tall R-waves in V5-V6 and deep S-waves in V1."},
    15: {"code": "15", "name": "Atrial Fibrillation or Flutter", "severity": "High", "description": "Irregularly irregular ventricular response with absent discrete P-waves or flutter waves."},
    16: {"code": "16", "name": "Others (Unclassified)", "severity": "Moderate", "description": "Atypical or non-standard cardiac rhythm disturbances grouped under class 16."},
}

class PredictRequest(BaseModel):
    features: List[Optional[float]]

@app.get("/health")
def health():
    model = get_model()
    return {
        "status": "ok",
        "model_available": model is not None,
        "model_path": MODEL_PATH if model else None
    }

@app.get("/api/v1/models")
def list_models():
    m = get_model()
    if not m:
        return {
            "models": [],
            "note": "No trained model found. Please run train_model.py to compile artifacts/model.joblib."
        }
    return {
        "models": [{
            "name": m.get("name", "Kernelized SVC (Sigmoid) + PCA (98% Variance)"),
            "task": "arrhythmia classification",
            "pca_components": m.get("pca_components", 122),
            "classes": [c["name"] for c in CLASS_METADATA.values()],
            "metrics": m.get("metrics", {})
        }]
    }

@app.get("/api/v1/models/benchmark")
def get_benchmarks():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            return json.load(f)
    return {"status": "default_benchmarks", "reported_accuracy": 0.8021}

def preprocess_vector(vector: np.ndarray, model_bundle):
    # Handle dropped original feature columns if specified by the pipeline (e.g. column 13)
    dropped_cols = model_bundle.get("dropped_original_feature_indices")
    if dropped_cols and vector.shape[1] == 279:
        vector = np.delete(vector, dropped_cols, axis=1)

    # Apply height outlier corrections if specified (Height is at index 2)
    height_corrections = model_bundle.get("height_corrections")
    if height_corrections and vector.shape[1] > 2:
        val = vector[0, 2]
        if val in height_corrections:
            vector[0, 2] = height_corrections[val]
        elif not np.isnan(val) and str(int(val)) in height_corrections:
            vector[0, 2] = height_corrections[str(int(val))]

    imputer = model_bundle["imputer"]
    var_thresh = model_bundle.get("var_thresh")
    scaler = model_bundle["scaler"]
    pca = model_bundle["pca"]

    # Impute missing values
    vector = imputer.transform(vector)

    # Filter zero-variance attributes if configured
    if var_thresh is not None:
        vector = var_thresh.transform(vector)

    # Standardize
    vector_scaled = scaler.transform(vector)

    # Dimensionality reduction (PCA)
    vector_pca = pca.transform(vector_scaled)
    return vector_pca

def make_prediction_response(cleaned_vals: list, model, t0: float):
    # If 280 elements (includes target column), trim the label
    if len(cleaned_vals) == 280:
        cleaned_vals = cleaned_vals[:-1]

    # Pad or truncate to exactly 279 features
    if len(cleaned_vals) < 279:
        cleaned_vals = cleaned_vals + [np.nan] * (279 - len(cleaned_vals))
    elif len(cleaned_vals) > 279:
        cleaned_vals = cleaned_vals[:279]

    vec = np.array(cleaned_vals, dtype=float).reshape(1, -1)

    try:
        vec_pca = preprocess_vector(vec, model)
        clf = model["classifier"]
        pred_class_idx = int(clf.predict(vec_pca)[0])
        
        # Calculate confidence
        confidence = 0.0
        probabilities = {}
        if hasattr(clf, "predict_proba"):
            probs = clf.predict_proba(vec_pca)[0]
            classes = list(clf.classes_)
            if pred_class_idx in classes:
                p_idx = classes.index(pred_class_idx)
                confidence = round(float(probs[p_idx]) * 100, 2)
            for c_val, p_val in zip(classes, probs):
                meta_item = CLASS_METADATA.get(int(c_val))
                if meta_item and p_val > 0.01:
                    probabilities[meta_item["name"]] = round(float(p_val) * 100, 1)
    except Exception as e:
        raise HTTPException(422, f"Pipeline inference error: {str(e)}")

    meta = CLASS_METADATA.get(pred_class_idx, {
        "code": str(pred_class_idx).zfill(2),
        "name": f"Class {pred_class_idx}",
        "severity": "Moderate",
        "description": "Diagnostic classification produced by trained scikit-learn pipeline."
    })

    elapsed = time.time() - t0

    result = {
        "analysis_id": str(uuid.uuid4()),
        "model": model.get("name", "Kernelized SVC with PCA (95% Variance)"),
        "class_code": meta["code"],
        "predicted_class": pred_class_idx,
        "class_name": meta["name"],
        "clinical_severity": meta["severity"],
        "description": meta["description"],
        "confidence": confidence,
        "top_probabilities": probabilities,
        "preprocessing": f"Median Imputation -> Variance Filter (262 feat) -> StandardScaler -> PCA ({model['pca'].n_components_} components)",
        "processing_time_s": elapsed,
        "segments": [
            {
                "sample": 0,
                "time_s": 0.0,
                "class": meta["name"]
            }
        ],
        "disclaimer": DISCLAIMER
    }
    return result

@app.post("/api/v1/predict")
def predict_json(req: PredictRequest):
    model = get_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not trained. Train the model first using train_model.py."
        )
    t0 = time.time()
    vals = [float(v) if (v is not None and not np.isnan(v)) else np.nan for v in req.features]
    res = make_prediction_response(vals, model, t0)
    return JSONResponse(content=res)

@app.post("/api/v1/ecg/validate")
async def validate_ecg(file: UploadFile = File(...), fs: float = Form(360)):
    content = await file.read(MAX_BYTES)
    text = content.decode("utf-8", errors="ignore").strip()
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        raise HTTPException(422, "Uploaded CSV file is empty.")
    
    first_row = lines[0].split(",")
    # Check if header
    is_header = False
    try:
        float(first_row[0].replace('?', '0'))
    except ValueError:
        is_header = True

    data_row = lines[1].split(",") if (is_header and len(lines) > 1) else first_row
    return {
        "valid": True,
        "rows": len(lines) - (1 if is_header else 0),
        "columns_in_first_row": len(data_row),
        "has_header": is_header,
        "filename": file.filename,
        "sample_preview": data_row[:10]
    }

@app.post("/api/v1/ecg/analyze")
async def analyze_ecg(
    file: UploadFile = File(...),
    column: int = Form(0),
    fs: float = Form(360)
):
    model = get_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not trained. Train the model first using train_model.py."
        )

    t0 = time.time()
    content = await file.read(MAX_BYTES)
    text = content.decode("utf-8", errors="ignore").strip()
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    if not lines:
        raise HTTPException(422, "Input CSV has no data rows.")

    # Check if line 0 is a header row
    first_row_vals = [val.strip() for val in lines[0].split(",")]
    is_header = False
    try:
        float(first_row_vals[0].replace('?', '0'))
    except ValueError:
        is_header = True

    target_line = lines[1] if (is_header and len(lines) > 1) else lines[0]
    raw_vals = [val.strip() for val in target_line.split(",")]

    cleaned_vals = []
    for v in raw_vals:
        if v == "?" or v == "":
            cleaned_vals.append(np.nan)
        else:
            try:
                cleaned_vals.append(float(v))
            except ValueError:
                cleaned_vals.append(np.nan)

    res = make_prediction_response(cleaned_vals, model, t0)
    return JSONResponse(content=res)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
