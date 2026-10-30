# CardioPulse™ Diagnostic Workstation — Frontend

A clean, minimal, medical-grade diagnostic workstation built with **React 19 + Tailwind CSS v4** for electrocardiogram arrhythmia multi-class classification based on the UCI Arrhythmia Database.

---

## 🎨 Aesthetic & Design System

- **Color Palette:** Warm cream (`#FAF7F2`), paper white (`#FFFFFF`), subtle muted borders (`#E6DFD1`, `#DED5C2`), dark charcoal text (`#1C1917`), and clinical terracotta accents (`#8C3B2D`).
- **Typography:** Courier New monospace for clinical headings, waveforms, and telemetry; clean system sans-serif for reading legibility.
- **Ambient Medical Animations:**
  - Soft, slow-drifting radial ambient gradients in warm terracotta and amber (`.product-bg-ambient`) that float smoothly in the background.
  - Continuous P-Q-R-S-T electrocardiogram waveform silhouette ribbon gliding along the background horizon (`.animate-drift-wave`).
  - Real-time CRT laser scanline oscilloscope waveform monitor on authentic medical millimeter grid paper (`EcgMonitor.jsx`).
  - Pulsing emerald radar beacon (`.beacon-pulse-emerald`) signaling active inference engine readiness.

---

## 🌟 Key Views & Modules

### 1. Diagnostic Command Center (`Dashboard`)
- Clinical product hero with live status indicator (`122-D PCA Matrix Ready`).
- Real-time **Bedside Oscilloscope Monitor** (`EcgMonitor`) with selectable leads, 72 BPM heartbeat pulse, and calibration markings.
- Clinical operations KPI cards:
  - **Diagnostic Sensitivity:** 80.22% test accuracy (`0.802198`) achieved jointly by Linear SVC and Kernelized SVC with PCA.
  - **Signal Compression:** 279 $\rightarrow$ 122 components (-56.3% dimensionality reduction via 98.07% variance PCA, dropping uninformative column 13).
  - **Screened Cohort:** 452 patient instances (245 normal + 207 arrhythmic).
  - **Stream Latency:** 14 ms SLA per complete vector inference.
- **Live Patient Triage Feed:** Real-time clinical queue with patient demographics, lead configuration, primary finding, risk severity badge (*Normal*, *Moderate*, *High Risk*), confidence progress meter, and direct **Inspect** shortcut.
- **Clinical Arrhythmia Surveillance:** 6 electrophysiology category filters (Normal Sinus Rhythm, Conduction Blocks, Ischemia & Infarctions, Rate Disturbances, Ectopic Beats, Complex Rhythms) with expandable 16-class hierarchy.
- **End-to-End Pipeline Health:** Interactive visual diagram vs raw ASCII architecture tree.

### 2. Clinical ECG Ingestion (`Predict`)
- **Status Safeguard:** Displays "Model Loaded" or disables predictions if the backend pipeline is unavailable.
- **Full 279-Element Vector Maintenance:** Form fields update exact indices while preserving all 279 features, automatically handling column 13 drop and outlier transformations in backend.
- **Validated Patient Presets:**
  - Preset 1: Normal ECG (Row 3, Class 01)
  - Preset 2: Sinus Bradycardia (Row 1, Class 06)
  - Preset 3: Right Bundle Branch Block (Row 2, Class 10)
  - Preset 4: Supraventricular Premature Contraction (Row 0, Class 08)
- **CSV Vector Upload:** Accepts raw CSV files matching the UCI schema and submits to `/api/v1/ecg/analyze`.

### 3. Diagnostic Pathology Report (`Results`)
- Clean outcome card showing predicted class code, label, and clinical description.
- Severity tag (Normal / Moderate / High / Critical) and prevalence.
- Real-time probability meter across top candidate rhythm groups.
- Pipeline execution telemetry and diagnostic disclaimers.

### 4. About the Project & Model Architecture (`About`)
- **Interactive View Switcher:** Toggle between **Comparative Matrix Table** and **Dual Group Side-by-Side Cards**.
- **12-Model Comparative Benchmarks:**
  - **Linear SVC with PCA:** 80.22% Test Acc (80.89% Train Acc) — Joint Top Generalization (+2.20% gain over raw)
  - **Kernelized SVC with PCA:** 80.22% Test Acc (83.93% Train Acc) — Joint Top & Selected Production Model
  - **Logistic Regression with PCA:** 79.12% Test Acc (78.39% Train Acc) — Overfitting eliminated (+1.10% test gain)
  - **KNN Classifier with PCA:** 64.84% Test Acc (64.54% Train Acc) — Exact baseline preserved
  - **Random Forest with PCA:** 61.54% Test Acc (73.13% Train Acc)
  - **Decision Tree with PCA:** 60.44% Test Acc (75.35% Train Acc)
- **Comparative Baseline (Without PCA):** Linear SVC (78.02%), Kernelized SVC (79.12%), Logistic Regression (78.02%), Random Forest (75.82%), Decision Tree (68.13%), KNN (64.84%).
- **UCI Machine Learning Repository Specification:** Complete dataset metrics (452 records, 279 features, 16 classes).
- **16-Class Diagnostic Taxonomy:** Full clinical electrophysiology classification definitions.
- **Academic Reference:** Citation for Guvenir et al. (1997) and medical practice disclaimer.

---

## 🚀 Running the Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Visit **`http://localhost:5173`** in your browser.
