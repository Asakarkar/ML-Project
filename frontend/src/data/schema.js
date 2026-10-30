/**
 * Exact schema and metadata for the UCI Arrhythmia Dataset & ML Pipeline
 * Source: UCI Machine Learning Repository (Guvenir et al., 1997)
 * Records: 452 | Features: 279 | Classes: 16
 */

export const DATASET_STATS = {
  totalRecords: 452,
  totalFeatures: 279,
  retainedFeaturesAfterVariance: 278,
  zeroVarianceDropped: 1, // Column 13 dropped
  totalClasses: 16,
  activeClassesInSample: 13,
  pcaComponents: 122,
  pcaVarianceRetained: "98.07%",
  trainedPipelineAccuracy: "80.22%",
  reportedLiteratureAccuracy: "80.22%",
  reportedBestModel: "Kernelized SVC with PCA",
  bestMetric: "Test Accuracy: 80.22% (Kernelized SVC & Linear SVC PCA)",
  missingCells: 408,
  missingPercentage: "0.32%",
};

export const ARRHYTHMIA_CLASSES = {
  1: {
    code: "01",
    name: "Normal ECG",
    instances: 245,
    percentage: 54.2,
    clinicalSeverity: "Normal",
    description: "Sinus rhythm with normal conduction velocity and cardiac axis.",
  },
  2: {
    code: "02",
    name: "Ischemic Changes (Coronary Artery Disease)",
    instances: 44,
    percentage: 9.73,
    clinicalSeverity: "High",
    description: "ST-segment depression or T-wave inversion indicating myocardial ischemia.",
  },
  3: {
    code: "03",
    name: "Old Anterior Myocardial Infarction",
    instances: 15,
    percentage: 3.32,
    clinicalSeverity: "High",
    description: "Pathological Q-waves or poor R-wave progression in precordial leads V1–V4.",
  },
  4: {
    code: "04",
    name: "Old Inferior Myocardial Infarction",
    instances: 15,
    percentage: 3.32,
    clinicalSeverity: "High",
    description: "Significant Q-waves in limb leads II, III, and aVF representing inferior wall scarring.",
  },
  5: {
    code: "05",
    name: "Sinus Tachycardia",
    instances: 13,
    percentage: 2.88,
    clinicalSeverity: "Moderate",
    description: "Heart rate exceeding 100 bpm originating from normal sinoatrial node pacemaking.",
  },
  6: {
    code: "06",
    name: "Sinus Bradycardia",
    instances: 25,
    percentage: 5.53,
    clinicalSeverity: "Moderate",
    description: "Resting heart rate below 60 bpm with preserved P-wave morphology.",
  },
  7: {
    code: "07",
    name: "Ventricular Premature Contraction (PVC)",
    instances: 3,
    percentage: 0.66,
    clinicalSeverity: "High",
    description: "Premature wide, abnormal QRS complex without preceding P-wave.",
  },
  8: {
    code: "08",
    name: "Supraventricular Premature Contraction",
    instances: 2,
    percentage: 0.44,
    clinicalSeverity: "Moderate",
    description: "Early beat originating above ventricles (atria or AV node) with narrow QRS.",
  },
  9: {
    code: "09",
    name: "Left Bundle Branch Block (LBBB)",
    instances: 9,
    percentage: 1.99,
    clinicalSeverity: "High",
    description: "Delayed left ventricular depolarization causing broad, notched R-waves in I, aVL, V5–V6.",
  },
  10: {
    code: "10",
    name: "Right Bundle Branch Block (RBBB)",
    instances: 50,
    percentage: 11.06,
    clinicalSeverity: "Moderate",
    description: "Delayed right ventricular activation resulting in rsR' pattern in lead V1.",
  },
  11: {
    code: "11",
    name: "1° Atrioventricular Block",
    instances: 0,
    percentage: 0.0,
    clinicalSeverity: "Low",
    description: "Prolonged PR interval (>200 ms) with preserved 1:1 AV conduction.",
  },
  12: {
    code: "12",
    name: "2° Atrioventricular Block",
    instances: 0,
    percentage: 0.0,
    clinicalSeverity: "High",
    description: "Intermittent failure of AV conduction (Mobitz Type I or Type II).",
  },
  13: {
    code: "13",
    name: "3° Atrioventricular Block (Complete)",
    instances: 0,
    percentage: 0.0,
    clinicalSeverity: "Critical",
    description: "Total dissociation between atrial P-waves and ventricular QRS complexes.",
  },
  14: {
    code: "14",
    name: "Left Ventricular Hypertrophy (LVH)",
    instances: 4,
    percentage: 0.88,
    clinicalSeverity: "Moderate",
    description: "Increased left ventricular wall thickness causing tall R-waves in V5-V6 and deep S-waves in V1.",
  },
  15: {
    code: "15",
    name: "Atrial Fibrillation or Flutter",
    instances: 5,
    percentage: 1.11,
    clinicalSeverity: "High",
    description: "Irregularly irregular ventricular response with absent discrete P-waves or sawtooth flutter waves.",
  },
  16: {
    code: "16",
    name: "Others (Unclassified Arrhythmias)",
    instances: 22,
    percentage: 4.87,
    clinicalSeverity: "Moderate",
    description: "Atypical or non-standard cardiac rhythm disturbances grouped under residual class 16.",
  },
};

export const MODEL_PERFORMANCE = {
  withoutPca: [
    { name: "KNN Classifier", accuracy: 64.84, recall: 64.84, precision: 58.62, f1: 54.41, trainAccuracy: 64.82, status: "Baseline (Scaled)" },
    { name: "Logistic Regression", accuracy: 78.02, recall: 78.02, precision: 74.20, f1: 75.12, trainAccuracy: 93.91, status: "Saga solver C=0.01" },
    { name: "Decision Tree", accuracy: 68.13, recall: 68.13, precision: 65.40, f1: 64.80, trainAccuracy: 78.95, status: "Entropy max_depth=5" },
    { name: "Linear SVC", accuracy: 78.02, recall: 78.02, precision: 74.15, f1: 74.88, trainAccuracy: 88.09, status: "Linear hyperplane" },
    { name: "Kernelized SVC (RBF)", accuracy: 79.12, recall: 79.12, precision: 71.30, f1: 72.45, trainAccuracy: 85.04, status: "Sigmoid kernel C=10" },
    { name: "Random Forest", accuracy: 75.82, recall: 75.82, precision: 70.10, f1: 71.90, trainAccuracy: 88.09, status: "300 trees max_depth=10" },
  ],
  withPcaAndSmote: [
    { name: "KNN Classifier", accuracy: 64.84, recall: 64.84, precision: 58.62, f1: 54.41, trainAccuracy: 64.54, status: "k-NN on 122 PCA components" },
    { name: "Logistic Regression", accuracy: 79.12, recall: 79.12, precision: 73.10, f1: 74.50, trainAccuracy: 78.39, status: "Saga solver on PCA" },
    { name: "Decision Tree", accuracy: 60.44, recall: 60.44, precision: 57.57, f1: 54.99, trainAccuracy: 75.35, status: "Entropy max_depth=5 on PCA" },
    { name: "Linear SVC", accuracy: 80.22, recall: 80.22, precision: 75.20, f1: 76.10, trainAccuracy: 80.89, status: "Joint Top Test Accuracy (80.22%)" },
    { name: "Kernelized SVC (RBF)", accuracy: 80.22, recall: 80.22, precision: 74.80, f1: 75.95, trainAccuracy: 83.93, status: "Selected Model (80.22%)" },
    { name: "Random Forest", accuracy: 61.54, recall: 61.54, precision: 48.20, f1: 49.80, trainAccuracy: 73.13, status: "100 trees max_depth=6 on PCA" },
  ],
};

export const CLINICAL_FEATURE_SECTIONS = [
  {
    id: "demographics",
    title: "1. Demographics & Clinical Attributes",
    description: "General baseline measurements of the patient (Features 1–4)",
    fields: [
      { index: 0, id: "f0", name: "Age", label: "Age", unit: "years", type: "number", min: 0, max: 120, default: 55, step: 1 },
      { index: 1, id: "f1", name: "Sex", label: "Sex", unit: "0=Male, 1=Female", type: "select", options: [{ label: "Male (0)", value: 0 }, { label: "Female (1)", value: 1 }], default: 0 },
      { index: 2, id: "f2", name: "Height", label: "Height", unit: "cm", type: "number", min: 50, max: 250, default: 175, step: 1 },
      { index: 3, id: "f3", name: "Weight", label: "Weight", unit: "kg", type: "number", min: 10, max: 200, default: 94, step: 1 },
    ],
  },
  {
    id: "conduction",
    title: "2. Conduction Times & Intervals",
    description: "Averaged cardiac wave durations and rhythm rate (Features 5–9, 15)",
    fields: [
      { index: 4, id: "f4", name: "QRS duration", label: "QRS Duration", unit: "msec", type: "number", min: 30, max: 300, default: 100 },
      { index: 5, id: "f5", name: "P-R interval", label: "P-R Interval", unit: "msec", type: "number", min: 50, max: 500, default: 202 },
      { index: 6, id: "f6", name: "Q-T interval", label: "Q-T Interval", unit: "msec", type: "number", min: 100, max: 700, default: 380 },
      { index: 7, id: "f7", name: "T interval", label: "T Interval", unit: "msec", type: "number", min: 20, max: 500, default: 179 },
      { index: 8, id: "f8", name: "P interval", label: "P Interval", unit: "msec", type: "number", min: 20, max: 400, default: 143 },
      { index: 14, id: "f14", name: "Heart rate", label: "Heart Rate", unit: "bpm", type: "number", min: 30, max: 220, default: 71 },
    ],
  },
  {
    id: "angles",
    title: "3. Frontal Plane Vector Angles",
    description: "Vector angles in degrees on the frontal plane (Features 10–14)",
    fields: [
      { index: 9, id: "f9", name: "QRS angle", label: "QRS Angle", unit: "degrees", type: "number", min: -180, max: 180, default: 28 },
      { index: 10, id: "f10", name: "T angle", label: "T Angle", unit: "degrees", type: "number", min: -180, max: 180, default: 11 },
      { index: 11, id: "f11", name: "P angle", label: "P Angle", unit: "degrees", type: "number", min: -180, max: 180, default: -5 },
      { index: 12, id: "f12", name: "QRST angle", label: "QRST Angle", unit: "degrees", type: "number", min: -180, max: 180, default: 20 },
      { index: 13, id: "f13", name: "J angle", label: "J Angle", unit: "degrees", type: "number", min: -180, max: 180, default: 0, note: "Median imputed" },
    ],
  },
  {
    id: "leads_primary",
    title: "4. Primary Lead Wave Morphology (Channel DI & V1)",
    description: "Key representative amplitudes and morphology from standard 12-lead channels",
    fields: [
      { index: 15, id: "f15", name: "DI Q wave width", label: "DI Q Wave Width", unit: "msec", type: "number", default: 0 },
      { index: 16, id: "f16", name: "DI R wave width", label: "DI R Wave Width", unit: "msec", type: "number", default: 72 },
      { index: 17, id: "f17", name: "DI S wave width", label: "DI S Wave Width", unit: "msec", type: "number", default: 20 },
      { index: 159, id: "f159", name: "DI JJ amplitude", label: "DI JJ Wave Amp", unit: "0.1 mV", type: "number", default: 0.9, step: 0.1 },
      { index: 161, id: "f161", name: "DI R amplitude", label: "DI R Wave Amp", unit: "0.1 mV", type: "number", default: 7.8, step: 0.1 },
      { index: 162, id: "f162", name: "DI S amplitude", label: "DI S Wave Amp", unit: "0.1 mV", type: "number", default: -0.7, step: 0.1 },
      { index: 166, id: "f166", name: "DI T amplitude", label: "DI T Wave Amp", unit: "0.1 mV", type: "number", default: 1.9, step: 0.1 },
      { index: 167, id: "f167", name: "DI QRSA", label: "DI QRSA Segment Area", unit: "area/10", type: "number", default: 27.3, step: 0.1 },
      { index: 168, id: "f168", name: "DI QRSTA", label: "DI QRSTA Total Area", unit: "area/10", type: "number", default: 45.1, step: 0.1 },
    ],
  },
];

// Actual sample row 3 from arrhythmia.csv (Class 1: Normal ECG)
export const SAMPLE_PATIENT_NORMAL = [
  55, 0, 175, 94, 100, 202, 380, 179, 143, 28, 11, -5, 20, 0, 71, 0, 72, 20, 0, 0,
  48, 0, 0, 0, 0, 0, 0, 0, 64, 36, 0, 0, 36, 0, 0, 0, 0, 0, 0, 20, 52, 48, 0, 0, 56,
  0, 0, 0, 0, 0, 0, 64, 32, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 60, 12, 0, 0, 44, 0,
  0, 0, 0, 0, 0, 0, 60, 44, 0, 0, 32, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 40, 44, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 52, 40, 0, 0, 32, 0, 0, 0, 0,
  0, 0, 0, 56, 48, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 60, 48, 0, 0, 36, 0, 0, 0, 0, 0,
  0, 0, 64, 40, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0.9, 0.0, 7.8, -0.7, 0.0, 0.0, 1.1, 1.9,
  27.3, 45.1, 0.1, 0.0, 9.1, -2.6, 0.0, 0.0, 0.4, 1.5, 24.5, 36.8, -0.4, -0.4, 1.6,
  -2.2, 0.0, 0.0, -1.0, -0.9, -1.5, -9.2, -0.4, -8.2, 1.8, 0.0, 0.0, 0.0, -0.7, -1.7,
  -23.4, -35.6, 0.9, 0.0, 3.2, -0.4, 0.0, 0.0, 0.7, 1.2, 9.4, 18.0, -0.1, 0.0, 5.1,
  -2.5, 0.0, 0.0, 0.3, 0.6, 9.8, 12.6, 1.6, -6.5, 0.0, 0.0, 0.0, 0.0, -0.4, -0.4,
  -18.2, -22.4, 2.1, 0.0, 1.2, -6.9, 0.0, 0.0, -0.5, 2.9, -12.7, 18.0, 0.7, 0.0, 9.0,
  -7.9, 0.0, 0.0, 0.1, 4.1, 7.6, 51.0, 0.4, 0.0, 15.0, -5.5, 0.0, 0.0, 0.1, 3.3, 28.8,
  63.1, 0.1, 0.0, 15.2, -3.7, 0.0, 0.0, 0.6, 3.0, 36.8, 68.0, 0.1, 0.0, 12.2, -2.2,
  0.0, 0.0, 0.4, 2.6, 34.6, 61.6
];

// Actual sample row 1 from arrhythmia.csv (Class 6: Sinus Bradycardia)
export const SAMPLE_PATIENT_BRADYCARDIA = [
  56, 1, 165, 64, 81, 174, 401, 149, 39, 25, 37, -17, 31, 0, 53, 0, 48, 0, 0, 0,
  24, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 32, 24, 0, 0, 0, 40,
  0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 20, 0, 0, 24, 0,
  0, 0, 0, 0, 0, 0, 60, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 24, 52, 0, 0, 16, 0, 0,
  0, 0, 0, 0, 0, 32, 52, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 44, 48, 0, 0, 32, 0, 0, 0,
  0, 0, 0, 0, 48, 44, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 48, 40, 0, 0, 28, 0, 0, 0, 0,
  0, 0, 0, 48, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, -0.6, 0.0, 7.2, 0.0, 0.0, 0.0, 0.4,
  1.5, 17.2, 26.5, 0.0, 0.0, 5.5, 0.0, 0.0, 0.0, 0.1, 1.7, 17.6, 29.5, 0.3, -1.6,
  0.9, 0.0, 0.0, 0.0, -0.3, 0.4, -1.5, 1.3, 0.1, -6.4, 0.0, 0.0, 0.0, 0.0, -0.3, -1.6,
  -15.3, -25.5, -0.3, 0.0, 4.2, -0.9, 0.0, 0.0, 0.4, 0.7, 8.3, 12.3, 0.2, 0.0, 2.2,
  0.0, 0.0, 0.0, -0.2, 0.8, 6.6, 11.7, 0.4, 0.0, 1.0, -8.8, 0.0, 0.0, 0.5, -0.6,
  -21.6, -26.8, 0.4, 0.0, 2.6, -7.9, 0.0, 0.0, 0.8, 2.0, -16.4, 1.2, 0.0, 0.0, 5.8,
  -7.7, 0.0, 0.0, 0.9, 3.8, -5.7, 27.7, -0.2, 0.0, 9.5, -5.0, 0.0, 0.0, 0.5, 2.6,
  11.8, 34.6, -0.4, 0.0, 11.0, -2.4, 0.0, 0.0, 0.4, 2.6, 21.6, 43.4, -0.5, 0.0, 8.5,
  0.0, 0.0, 0.0, 0.2, 2.1, 20.4, 38.8
];

// Actual sample row 2 from arrhythmia.csv (Class 10: Right Bundle Branch Block)
export const SAMPLE_PATIENT_RBBB = [
  54, 0, 172, 95, 138, 163, 386, 185, 102, 96, 34, 70, 66, 23, 75, 0, 40, 80, 0, 0,
  24, 0, 0, 0, 0, 0, 0, 20, 56, 52, 0, 0, 40, 0, 0, 0, 0, 0, 0, 28, 116, 0, 0, 0, 52,
  0, 0, 0, 0, 0, 0, 52, 64, 0, 0, 0, 88, 0, 0, 0, 0, 0, 0, 0, 36, 92, 0, 0, 24, 0, 0,
  0, 0, 0, 0, 0, 128, 0, 0, 0, 24, 0, 1, 0, 0, 0, 0, 0, 24, 36, 76, 0, 100, 0, 0, 0,
  0, 0, 0, 0, 40, 28, 60, 0, 96, 0, 0, 0, 0, 0, 0, 0, 48, 20, 56, 24, 32, 0, 0, 0,
  0, 0, 0, 0, 44, 88, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 44, 76, 0, 0, 28, 0, 0, 0, 0,
  0, 0, 0, 44, 72, 0, 0, 24, 0, 0, 0, 0, 0, 0, 1.0, 0.0, 4.5, -2.8, 0.0, 0.0, 0.3,
  2.5, -2.2, 19.8, 0.8, -0.4, 6.4, -1.3, 0.0, 0.0, 0.7, 2.7, 14.2, 37.9, -0.2, -0.6,
  4.4, 0.0, 0.0, 0.0, 0.5, 0.2, 24.7, 26.2, -1.0, -5.3, 1.8, 0.0, 0.0, 0.0, -0.5,
  -2.5, -8.0, -28.5, 0.5, 0.0, 1.7, -2.7, 0.0, 0.0, -0.2, 1.0, -9.4, -1.2, 0.4, 0.0,
  4.9, 0.0, 0.0, 0.0, 0.6, 1.4, 31.3, 42.7, -0.8, 0.0, 0.7, -3.8, 6.5, 0.0, 0.3,
  -3.3, 18.7, -13.6, -0.9, 0.0, 2.2, -4.1, 7.4, 0.0, 0.5, -2.4, 20.9, -2.6, 0.0,
  0.0, 5.8, -4.1, 4.0, -0.5, 0.4, 0.3, 20.4, 23.3, 0.7, 0.0, 10.0, -5.7, 0.0, 0.0,
  0.5, 2.2, -3.0, 20.7, 1.3, 0.0, 11.1, -3.4, 0.0, 0.0, 0.4, 3.4, 11.5, 48.2, 0.9,
  0.0, 9.5, -2.4, 0.0, 0.0, 0.3, 3.4, 12.3, 49.0
];

// Actual sample row 0 from arrhythmia.csv (Class 8: Supraventricular Premature Contraction)
export const SAMPLE_PATIENT_SUPRAVENTRICULAR = [
  75, 0, 190, 80, 91, 193, 371, 174, 121, -16, 13, 64, -2, 0, 63, 0, 52, 44, 0, 0,
  32, 0, 0, 0, 0, 0, 0, 0, 44, 20, 36, 0, 28, 0, 0, 0, 0, 0, 0, 52, 40, 0, 0, 0,
  60, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 36, 0, 0, 32,
  0, 0, 0, 0, 0, 0, 48, 32, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 40, 52, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 48, 48, 0, 0, 32, 0, 0,
  0, 0, 0, 0, 0, 52, 52, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 52, 48, 0, 0, 32, 0, 0, 0,
  0, 0, 0, 0, 56, 44, 0, 0, 32, 0, 0, 0, 0, 0, 0, -0.2, 0.0, 6.1, -1.0, 0.0, 0.0,
  0.6, 2.1, 13.6, 30.8, 0.0, 0.0, 1.7, -1.0, 0.6, 0.0, 1.3, 1.5, 3.7, 14.5, 0.1,
  -5.2, 1.4, 0.0, 0.0, 0.0, 0.8, -0.6, -10.7, -15.6, 0.4, -3.9, 0.0, 0.0, 0.0, 0.0,
  -0.8, -1.7, -10.1, -22.0, 0.0, 0.0, 5.7, -1.0, 0.0, 0.0, -0.1, 1.2, 14.1, 22.5,
  0.0, -2.5, 0.8, 0.0, 0.0, 0.0, 1.0, 0.4, -4.8, -2.7, 0.1, -6.0, 0.0, 0.0, 0.0,
  0.0, -0.8, -0.6, -24.0, -29.7, 0.0, 0.0, 2.0, -6.4, 0.0, 0.0, 0.2, 2.9, -12.6,
  15.2, -0.1, 0.0, 8.4, -10.0, 0.0, 0.0, 0.6, 5.9, -3.9, 52.7, -0.3, 0.0, 15.2,
  -8.4, 0.0, 0.0, 0.9, 5.1, 17.7, 70.7, -0.4, 0.0, 13.5, -4.0, 0.0, 0.0, 0.9, 3.9,
  25.5, 62.9, -0.3, 0.0, 9.0, -0.9, 0.0, 0.0, 0.9, 2.9, 23.3, 49.4
];
