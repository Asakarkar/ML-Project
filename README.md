<div align="center">

# 💓 CardioPulse™ Diagnostic Workstation | ECG Intelligence Platform

**An enterprise-grade, clinical AI diagnostic workstation and automated machine learning pipeline for 12-lead electrocardiogram arrhythmia classification and risk stratification.**

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Dataset](https://img.shields.io/badge/Dataset-UCI%20ML%20Repository-blue?style=for-the-badge)](https://archive.ics.uci.edu/ml/datasets/Arrhythmia)
[![Top Accuracy](https://img.shields.io/badge/Top%20Accuracy-80.22%25-brightgreen?style=for-the-badge)](#-model-performance-benchmarks)

[Quick Start](#-quick-start) · [ML Pipeline Architecture](#-structured-machine-learning-pipeline) · [Performance Benchmarks](#-model-performance-benchmarks) · [API Reference](#-api-reference)

</div>

---

## ⚠️ Medical Disclaimer

> **Notice:** This software platform is developed for **academic research, analytical validation, and educational purposes only**. It is not an FDA-, CE-, or CDSCO-cleared medical device and is not intended to replace professional clinical judgment, hospital bedside telemetry systems, or definitive diagnostic evaluation by a licensed cardiologist.

---

## 🌟 Clinical Product Features

| Module | Capability & Technical Specification |
| :--- | :--- |
| **🩺 Clinical Workstation UI/UX** | Designed with a calm cream/paper-white palette (`#FAF7F2` / `#FFFFFF`), Courier New typography for signal telemetry, subtle ambient drifting light fields, and real-time CRT laser scanline oscilloscope monitoring. |
| **⚡ High-Precision Kernel & Linear SVC** | Support Vector Classifiers trained on a 122-dimensional PCA subspace (98.07% variance preserved) achieving joint **80.22% test accuracy** (`0.802198`) on unseen test splits (matching literature benchmark). |
| **📊 Real-Time Patient Triage Feed** | Live clinical queue showing screened patient records, multi-lead telemetry, arrhythmia findings, severity status (*Normal*, *Moderate*, *High Risk*), and single-click diagnostic inspection. |
| **🧬 Automated Preprocessing Engine** | Drops column 13 (278 features retained), repairs anatomical height outliers (`608 -> 108`, `780 -> 180`), and fits mean imputation and standard scaling solely on training splits. |
| **📁 CSV Batch Upload & Presets** | Instant diagnostic evaluation via validated patient case presets (Normal ECG, Sinus Bradycardia, RBBB, Supraventricular) or raw 279-column CSV uploads. |
| **🔒 Zero-Mock Safeguards** | Strictly connects to trained scikit-learn pipeline artifacts (`artifacts/model.joblib`). Prevents inference attempts if the model is unavailable. |

---

## 🔬 Structured Machine Learning Pipeline

The project strictly follows an end-to-end, leakage-free clinical machine learning pipeline:

```
Raw UCI Data (452 × 279)
        │
        ▼
  Data Preprocessing
  ├── Drop column 13 (278 features remaining)
  ├── Correct Height outliers (608->108 cm, 780->180 cm)
  ├── Fit SimpleImputer(strategy='mean') on train fold (361 samples)
  └── Fit StandardScaler on train fold
        │
        ▼
  Exploratory Data Analysis
  ├── Class distribution analysis (54.2% Normal / 45.8% Arrhythmia across 16 classes)
  ├── Multicollinearity & lead cross-talk analysis
  └── Feature distribution variance screening
        │
        ▼
  Dimensionality Reduction
  └── PCA (retaining 98% cumulative variance -> 122 orthogonal components, 98.07% explained)
        │
        ▼
  Model Training & Evaluation (12 Model Configurations)
  ├── Baseline Classifiers (Without PCA):
  │   ├── KNN Classifier (64.84% Test / 64.82% Train)
  │   ├── Logistic Regression (78.02% Test / 93.91% Train)
  │   ├── Decision Tree (68.13% Test / 78.95% Train)
  │   ├── Linear SVC (78.02% Test / 88.09% Train)
  │   ├── Kernelized SVC (79.12% Test / 85.04% Train)
  │   └── Random Forest (75.82% Test / 88.09% Train)
  └── PCA Dimensionality Reduction Classifiers (122 Components):
      ├── Linear SVC with PCA (80.22% Test / 80.89% Train)  ← Joint Top Test Accuracy
      ├── Kernelized SVC with PCA (80.22% Test / 83.93% Train)  ← Joint Top & Selected Model
      ├── Logistic Regression with PCA (79.12% Test / 78.39% Train)
      ├── KNN with PCA (64.84% Test / 64.54% Train)
      ├── Random Forest with PCA (61.54% Test / 73.13% Train)
      └── Decision Tree with PCA (60.44% Test / 75.35% Train)
        │
        ▼
  Evaluation: Accuracy, Precision, Recall, F1-Score & Overfitting Analysis
```

---

## 📈 Model Performance Benchmarks

All models were evaluated on the held-out test split (91 samples) using stratified sampling after fitting transformers strictly on the 361 training instances:

### 1. Comparative Performance Matrix

| # | Model Architecture | Train Accuracy | Test Accuracy | Train (%) | Test (%) | Delta ($\Delta$) vs Baseline | Overfitting Margin | Status / Observation |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | **KNN Classifier** | `0.648199` | `0.648352` | **64.82%** | **64.84%** | Baseline | 0.02% | Distance-based metric baseline |
| **1** | **Logistic Regression** | `0.939058` | `0.780220` | **93.91%** | **78.02%** | Baseline | 15.89% | Multi-class convergence; high train memorization |
| **2** | **Decision Tree Classifier** | `0.789474` | `0.681319` | **78.95%** | **68.13%** | Baseline | 10.82% | Axis-aligned partitions on raw features |
| **3** | **Linear SVC** | `0.880886` | `0.780220` | **88.09%** | **78.02%** | Baseline | 10.07% | Linear hyperplane on 278 raw features |
| **4** | **Kernelized SVC** | `0.850416` | `0.791209` | **85.04%** | **79.12%** | Baseline | 5.92% | Non-linear boundary on raw features |
| **5** | **Random Forest Classifier** | `0.880886` | `0.758242` | **88.09%** | **75.82%** | Baseline | 12.27% | Ensemble baseline on raw clinical leads |
| **6** | **KNN Classifier with PCA** | `0.645429` | `0.648352` | **64.54%** | **64.84%** | **0.00%** | 0.30% | Zero accuracy loss with 56% fewer dimensions |
| **7** | **Logistic Regression with PCA** | `0.783934` | `0.791209` | **78.39%** | **79.12%** | **+1.10%** | -0.73% | Overfitting eliminated; test boost from 78.02% to 79.12% |
| **8** | **Linear SVC with PCA** | `0.808864` | `0.802198` | **80.89%** | **80.22%** | **+2.20%** | **0.67%** | **Joint Top Test Accuracy (80.22%)**; minimal overfit |
| **9** | **Kernelized SVC with PCA** | `0.839335` | `0.802198` | **83.93%** | **80.22%** | **+1.10%** | **3.71%** | **Joint Top Test Accuracy (80.22%) & Selected Model** |
| **10** | **Decision Tree with PCA** | `0.753463` | `0.604396` | **75.35%** | **60.44%** | **-7.69%** | 14.91% | Degrades on rotated continuous PCA coordinates |
| **11** | **Random Forest with PCA** | `0.731302` | `0.615385` | **73.13%** | **61.54%** | **-14.28%** | 11.59% | Feature subsampling penalty on dense eigenvector axes |

### 2. Empirical Findings

1. **Hyperplane Classifiers Benefit from PCA:** Both **Linear SVC** and **Kernelized SVC** reached **80.22% test accuracy** (`0.802198`), matching the established literature baseline (Guvenir et al., 1997). The orthogonalization of correlated 12-lead channels allows maximum-margin hyperplanes to isolate decision boundaries effectively.
2. **Overfitting Elimination:** In Logistic Regression, training accuracy fell from an overfitted **93.91%** down to **78.39%**, while test accuracy improved from **78.02%** to **79.12%**, completely eliminating the 15.89% overfit margin.
3. **Tree-Based Models Suffer on PCA:** Decision Trees and Random Forests show performance decreases on PCA features (-7.69% and -14.28% test accuracy respectively). This aligns with core machine learning theory: orthogonal axis-parallel decision boundaries (`x_j < threshold`) are less effective on rotated linear combinations of continuous features.

---

## 📋 16-Class Diagnostic Taxonomy

The UCI Arrhythmia dataset contains 452 patient instances spanning 16 diagnostic cardiac groups:

| Code | Diagnostic Class Label | Instances | % Share | Electrophysiology Category | Risk Severity |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **01** | **Normal ECG** | **245** | **54.20%** | Normal Sinus Rhythm | Normal |
| **02** | Ischemic Changes (CAD) | 44 | 9.73% | Ischemia & Infarction | High |
| **03** | Old Anterior Myocardial Infarction | 15 | 3.32% | Ischemia & Infarction | High |
| **04** | Old Inferior Myocardial Infarction | 15 | 3.32% | Ischemia & Infarction | High |
| **05** | Sinus Tachycardia | 13 | 2.88% | Rate Disturbances | Moderate |
| **06** | Sinus Bradycardia | 25 | 5.53% | Rate Disturbances | Moderate |
| **07** | Ventricular Premature Contraction (PVC) | 3 | 0.66% | Ectopic Beats | High |
| **08** | Supraventricular Premature Contraction | 2 | 0.44% | Ectopic Beats | Moderate |
| **09** | Left Bundle Branch Block (LBBB) | 9 | 1.99% | Conduction Blocks | High |
| **10** | Right Bundle Branch Block (RBBB) | 50 | 11.06% | Conduction Blocks | Moderate |
| **11** | 1° Atrioventricular Block | 0 | 0.00% | Conduction Blocks | Low |
| **12** | 2° Atrioventricular Block | 0 | 0.00% | Conduction Blocks | High |
| **13** | 3° Atrioventricular Block (Complete) | 0 | 0.00% | Conduction Blocks | Critical |
| **14** | Left Ventricular Hypertrophy (LVH) | 4 | 0.88% | Complex / Structural | Moderate |
| **15** | Atrial Fibrillation or Flutter | 5 | 1.11% | Complex / Rhythms | High |
| **16** | Others (Unclassified) | 22 | 4.87% | Unclassified Pathologies | Moderate |

---

## 🔌 API Reference

The FastAPI backend server runs at `http://localhost:8000` (interactive documentation at `http://localhost:8000/docs`).

### 1. Health & Model Status
```http
GET /health
```
```json
{
  "status": "ok",
  "model_available": true,
  "model_path": "D:\\...\\artifacts\\model.joblib"
}
```

### 2. Multi-Model Benchmark Metrics
```http
GET /api/v1/models/benchmark
```
Returns dynamic evaluation metrics for all 12 models from `artifacts/all_models_metrics.json`.

### 3. Direct Feature Vector Inference
```http
POST /api/v1/predict
Content-Type: application/json

{
  "features": [55.0, 0.0, 175.0, 94.0, 100.0, 202.0, ...]
}
```
**Response:**
```json
{
  "analysis_id": "97e0eb23-3b60-4965-b778-98e6c4ea6b25",
  "model": "Kernelized SVC with PCA (98% Variance)",
  "class_code": "01",
  "predicted_class": 1,
  "class_name": "Normal ECG",
  "clinical_severity": "Normal",
  "confidence": 99.33,
  "top_probabilities": {
    "Normal ECG": 99.3
  },
  "preprocessing": "Drop Col 13 (278 feat) -> SimpleImputer(mean) -> StandardScaler -> PCA (122 components, 98.07% var)",
  "processing_time_s": 0.014
}
```

### 4. Multipart CSV Vector Upload
```http
POST /api/v1/ecg/analyze
Content-Type: multipart/form-data
```
Accepts raw CSV vector files (`.csv`) matching the UCI dataset schema (with or without headers) and evaluates vectors through the trained pipeline.

---

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/shsarv/Machine-Learning-Projects.git
cd "Machine-Learning-Projects/Classification of Arrhythmia [ECG DATA]"

# Set up Python virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install backend dependencies
pip install -r requirements.txt
```

### 2. Train the Pipeline Artifacts

```bash
python train_model.py
```
This script preprocesses the dataset, drops column 13, corrects height outliers, fits mean imputation and standard scaling on the train fold, fits PCA (122 components, 98.07% variance), trains all 12 model configurations, and exports:
* `artifacts/model.joblib` (Production pipeline bundle)
* `artifacts/all_models_metrics.json` (Benchmark results)
* `artifacts/metrics.json` (Selected model metrics)

### 3. Launch Backend & Frontend Servers

**Terminal 1 — FastAPI Backend:**
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — React Frontend:**
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open **`http://localhost:5173`** in your browser.

---

## 📂 Project Structure

```
Classification of Arrhythmia [ECG DATA]/
├── artifacts/
│   ├── model.joblib                     # Serialized production pipeline bundle
│   ├── metrics.json                     # Primary production metrics
│   └── all_models_metrics.json          # Exported 12-model benchmark metrics
├── backend/
│   └── main.py                          # FastAPI REST API & telemetry endpoints
├── Data/
│   ├── arrhythmia.csv                   # UCI Arrhythmia dataset
│   └── arrhythmia.data                  # UCI Arrhythmia raw data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EcgMonitor.jsx           # Animated CRT laser scanline oscilloscope
│   │   │   ├── Header.jsx               # Workstation navigation bar
│   │   │   ├── Sidebar.jsx              # Navigation menu (Dashboard, Predict, Results, About)
│   │   │   └── StatusBanner.jsx         # Connection & model readiness alert
│   │   ├── data/
│   │   │   └── schema.js                # UCI dataset schema, presets & taxonomy
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Clinical command center & patient triage feed
│   │   │   ├── Predict.jsx              # 279-element patient form & CSV upload
│   │   │   ├── Results.jsx              # Diagnostic report & confidence breakdown
│   │   │   └── About.jsx                # Unified Model Benchmarks, PCA & Project specs
│   │   ├── services/
│   │   │   └── api.js                   # API client for FastAPI backend
│   │   ├── App.jsx                      # App shell with ambient background animations
│   │   └── index.css                    # Tailwind CSS v4, millimeter grid & animations
│   ├── package.json
│   └── vite.config.js
├── Model/
│   ├── general and pca.ipynb            # Baseline vs PCA comparative analysis
│   └── oversampled and pca.ipynb        # Pipeline exploration notebook
├── Preprocessing and EDA/
│   ├── Data preprocessing.ipynb         # Imputation, outlier handling & feature scrubbing
│   ├── EDA.ipynb                        # Class distributions & correlation matrices
│   └── preprocessed_arrhythmia.csv      # Clean preprocessed output
├── final with pca.ipynb                 # Master end-to-end pipeline notebook
├── train_model.py                       # Standalone pipeline training & serialization script
├── requirements.txt                     # Python dependencies
└── README.md                            # Comprehensive project documentation
```

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Tailwind CSS v4, Vite, Lucide Icons
* **Backend:** FastAPI, Uvicorn, Pydantic, NumPy, Pandas, Joblib
* **Machine Learning:** scikit-learn (Support Vector Machines, PCA, SimpleImputer, StandardScaler)
* **Data Origin:** UCI Machine Learning Repository (Guvenir et al., 1997)

---

## 📚 References

1. **UCI Machine Learning Repository:** [Arrhythmia Dataset Archive](https://archive.ics.uci.edu/ml/datasets/Arrhythmia)
2. **Guvenir, H. A., et al. (1997):** *A Supervised Machine Learning Algorithm for Arrhythmia Analysis.* Computers in Cardiology Conference, Lund, Sweden.
3. **scikit-learn Documentation:** [Principal Component Analysis (PCA)](https://scikit-learn.org/stable/modules/decomposition.html#pca)
