"""
ECG Arrhythmia Classification — 12-model training and comparison script.

This script follows the modeling structure in the supplied ECG notebook:
- UCI Arrhythmia CSV with no header row.
- 279 original feature columns and one target column.
- Remove original feature column 13.
- Correct the two documented Height outliers (608 -> 108 and 780 -> 180).
- Mean-impute missing values, standardize features, then train six models
  on the scaled features and six matching model variants on PCA features.
- PCA retains 98% of variance and is fitted only on training data.
- Report train/test accuracy plus weighted precision, recall, and F1.
- Save the selected PCA-based Kernelized SVC and its preprocessing objects.

Expected project layout:
    project/
      train_model_commented.py
      Data/
        arrhythmia.csv
      artifacts/                 # created automatically
"""

import json
import os
import warnings

import joblib
import numpy as np
import pandas as pd

from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC, LinearSVC
from sklearn.tree import DecisionTreeClassifier


# ---------------------------------------------------------------------------
# 1. SETTINGS AND OUTPUT PATHS
# ---------------------------------------------------------------------------

# The notebook uses random_state=1 for its train/test split.
RANDOM_STATE = 1
TEST_SIZE = 0.20

# Resolve paths relative to this Python file, not the terminal's current folder.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "Data", "arrhythmia.csv")
if not os.path.isfile(DATA_PATH):
    DATA_PATH = os.path.join(BASE_DIR, "Data", "arrhythmia.data")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
MODEL_OUT_PATH = os.path.join(ARTIFACTS_DIR, "model.joblib")
METRICS_OUT_PATH = os.path.join(ARTIFACTS_DIR, "all_models_metrics.json")


# Target labels from the notebook's class-name list. Confirm this mapping with
# the dataset documentation before using labels in any user-facing interface.
CLASS_NAMES = {
    1: "Normal",
    2: "Ischemic changes (CAD)",
    3: "Old Anterior Myocardial Infarction",
    4: "Old Inferior Myocardial Infarction",
    5: "Sinus tachycardia",
    6: "Sinus bradycardia",
    7: "Ventricular Premature Contraction (PVC)",
    8: "Supraventricular Premature Contraction",
    9: "Left bundle branch block",
    10: "Right bundle branch block",
    11: "1st Degree Atrioventricular block",
    12: "2nd Degree Atrioventricular block",
    13: "3rd Degree Atrioventricular block",
    14: "Left ventricular hypertrophy",
    15: "Atrial Fibrillation or Flutter",
    16: "Others",
}


def correct_height_outliers(features):
    """Apply the notebook's two documented Height corrections to a copy."""
    features = features.copy()

    # Original feature column 2 is Height. Dropping original column 13 does not
    # change Height's position because the removed column comes after it.
    if features.shape[1] > 2:
        features.iloc[:, 2] = features.iloc[:, 2].replace({608: 108, 780: 180})

    return features


def get_model_definitions():
    """
    Return six baseline models and six PCA variants.

    Hyperparameters follow the corresponding model definitions in the supplied
    notebook. Baseline models use standardized features; PCA variants use the
    PCA-transformed standardized features.
    """
    return {
        # Baseline models: trained on scaled features without PCA.
        "KNN Classifier": KNeighborsClassifier(),
        "Logistic Regression": LogisticRegression(
            solver="saga", random_state=0, max_iter=5000
        ),
        "Decision Tree Classifier": DecisionTreeClassifier(
            criterion="entropy", random_state=0, max_depth=5
        ),
        "Linear SVC": LinearSVC(
            C=0.01, random_state=RANDOM_STATE, max_iter=10000
        ),
        "Kernelized SVC": SVC(
            kernel="sigmoid", C=10, gamma=0.001, probability=True,
            random_state=RANDOM_STATE
        ),
        "Random Forest Classifier": RandomForestClassifier(
            n_estimators=300,
            criterion="gini",
            max_features=100,
            max_depth=10,
            max_leaf_nodes=30,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),

        # PCA variants: trained on the reduced PCA representation.
        "KNN Classifier with PCA": KNeighborsClassifier(n_neighbors=5),
        "Logistic Regression with PCA": LogisticRegression(
            solver="saga", C=0.01, random_state=0, max_iter=5000
        ),
        "Linear SVC with PCA": LinearSVC(
            C=0.001, random_state=RANDOM_STATE, max_iter=10000
        ),
        "Kernelized SVC with PCA": SVC(
            kernel="sigmoid", C=10, gamma=0.001, probability=True,
            random_state=RANDOM_STATE
        ),
        "Decision Tree Classifier with PCA": DecisionTreeClassifier(
            criterion="entropy", random_state=2, max_depth=5
        ),
        "Random Forest Classifier with PCA": RandomForestClassifier(
            n_estimators=100,
            max_depth=6,
            min_samples_leaf=4,
            random_state=1,
            n_jobs=-1,
        ),
    }


def calculate_metrics(y_true, y_pred):
    """Calculate percentages for the main classification metrics."""
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)) * 100, 2),
        "precision": round(float(precision_score(
            y_true, y_pred, average="weighted", zero_division=0
        )) * 100, 2),
        "recall": round(float(recall_score(
            y_true, y_pred, average="weighted", zero_division=0
        )) * 100, 2),
        "f1_score": round(float(f1_score(
            y_true, y_pred, average="weighted", zero_division=0
        )) * 100, 2),
    }


def train_pipeline(data_path=DATA_PATH):
    """Load data, train 12 models, compare them, and export the chosen model."""
    print("=" * 72)
    print("ECG ARRHYTHMIA CLASSIFICATION — 12-MODEL PIPELINE")
    print("=" * 72)

    # -----------------------------------------------------------------------
    # 2. LOAD AND VALIDATE THE CSV
    # -----------------------------------------------------------------------

    if not os.path.isfile(data_path):
        raise FileNotFoundError(
            f"Dataset not found: {data_path}\n"
            "Put arrhythmia.csv in the Data folder beside this script, or call "
            "train_pipeline('/absolute/path/to/arrhythmia.csv')."
        )

    # The source CSV has no header. Convert '?' placeholders to NaN so the
    # imputer can handle them later.
    df = pd.read_csv(data_path, header=None).replace("?", np.nan)
    print(f"Dataset shape: {df.shape}")

    # Expected schema: 279 original features plus one class-label column.
    if df.shape[1] != 280:
        raise ValueError(
            f"Expected 280 columns (279 features + target), found {df.shape[1]}."
        )

    # Split input features from the target before doing feature preprocessing.
    # Invalid or missing target values cannot be used for supervised training.
    X = df.iloc[:, :-1].apply(pd.to_numeric, errors="coerce")
    y_raw = pd.to_numeric(df.iloc[:, -1], errors="coerce")
    valid_target = y_raw.notna() & (y_raw % 1 == 0)
    X = X.loc[valid_target].reset_index(drop=True)
    y = y_raw.loc[valid_target].astype(int).reset_index(drop=True)

    if X.empty or y.nunique() < 2:
        raise ValueError("At least two valid target classes are required.")

    # Feature 13 has more than 350 missing entries in the notebook and is
    # removed before imputation. Use the original column index, not a shifted one.
    X = X.drop(columns=[13])
    X = correct_height_outliers(X)

    raw_feature_count = df.shape[1] - 1
    final_feature_count = X.shape[1]
    print(f"Valid labeled records: {len(X)}")
    print(f"Features after dropping original column 13: {final_feature_count}")
    print("Target class counts:\n", y.value_counts().sort_index().to_string())

    # -----------------------------------------------------------------------
    # 3. SPLIT INTO TRAINING AND TEST SETS
    # -----------------------------------------------------------------------

    # The supplied notebook uses random_state=1 and does not stratify its split.
    # Keep that split style here to make results more comparable to the notebook.
    # For a new evaluation, stratification is often preferable when class counts
    # permit it, especially because this dataset has rare classes.
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=None,
    )
    print(f"Training records: {len(X_train_raw)}")
    print(f"Testing records:  {len(X_test_raw)}")

    # -----------------------------------------------------------------------
    # 4. IMPUTE MISSING VALUES
    # -----------------------------------------------------------------------

    # SimpleImputer() defaults to mean imputation for numeric features.
    # Fit it only on the training set; reuse the learned means for test records.
    imputer = SimpleImputer(strategy="mean")
    X_train_imputed = imputer.fit_transform(X_train_raw)
    X_test_imputed = imputer.transform(X_test_raw)

    # -----------------------------------------------------------------------
    # 5. STANDARDIZE FEATURES
    # -----------------------------------------------------------------------

    # StandardScaler learns each feature's mean and standard deviation from
    # training data. Scaling helps SVMs, logistic regression, KNN, and PCA.
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_imputed)
    X_test_scaled = scaler.transform(X_test_imputed)

    # -----------------------------------------------------------------------
    # 6. CREATE PCA REPRESENTATIONS
    # -----------------------------------------------------------------------

    # PCA combines correlated input features into fewer components. Keeping
    # 98% variance is the setting used in the notebook. Fit PCA on training
    # records only to avoid leaking information from the held-out test set.
    pca = PCA(n_components=0.98, random_state=RANDOM_STATE)
    X_train_pca = pca.fit_transform(X_train_scaled)
    X_test_pca = pca.transform(X_test_scaled)

    print(f"PCA components retained: {pca.n_components_}")
    print(
        f"PCA explained variance: "
        f"{pca.explained_variance_ratio_.sum() * 100:.2f}%"
    )

    # Models without PCA use scaled arrays; PCA variants use PCA arrays.
    train_inputs = {
        "KNN Classifier": X_train_scaled,
        "Logistic Regression": X_train_scaled,
        "Decision Tree Classifier": X_train_scaled,
        "Linear SVC": X_train_scaled,
        "Kernelized SVC": X_train_scaled,
        "Random Forest Classifier": X_train_scaled,
        "KNN Classifier with PCA": X_train_pca,
        "Logistic Regression with PCA": X_train_pca,
        "Linear SVC with PCA": X_train_pca,
        "Kernelized SVC with PCA": X_train_pca,
        "Decision Tree Classifier with PCA": X_train_pca,
        "Random Forest Classifier with PCA": X_train_pca,
    }
    test_inputs = {
        "KNN Classifier": X_test_scaled,
        "Logistic Regression": X_test_scaled,
        "Decision Tree Classifier": X_test_scaled,
        "Linear SVC": X_test_scaled,
        "Kernelized SVC": X_test_scaled,
        "Random Forest Classifier": X_test_scaled,
        "KNN Classifier with PCA": X_test_pca,
        "Logistic Regression with PCA": X_test_pca,
        "Linear SVC with PCA": X_test_pca,
        "Kernelized SVC with PCA": X_test_pca,
        "Decision Tree Classifier with PCA": X_test_pca,
        "Random Forest Classifier with PCA": X_test_pca,
    }

    # -----------------------------------------------------------------------
    # 7. TRAIN AND EVALUATE ALL 12 MODELS
    # -----------------------------------------------------------------------

    models = get_model_definitions()
    results = {}
    trained_models = {}

    for name, model in models.items():
        print(f"\nTraining {name}...")

        # Fit the model on the appropriate training representation.
        model.fit(train_inputs[name], y_train)

        # Evaluate on both sets. Train accuracy helps reveal memorization;
        # test accuracy measures performance on records held out from fitting.
        train_pred = model.predict(train_inputs[name])
        test_pred = model.predict(test_inputs[name])

        train_metrics = calculate_metrics(y_train, train_pred)
        test_metrics = calculate_metrics(y_test, test_pred)

        # Keep the full-precision accuracy fractions for the final comparison
        # table (e.g. 0.802198), while retaining percentage metrics for reports.
        train_accuracy_fraction = float(accuracy_score(y_train, train_pred))
        test_accuracy_fraction = float(accuracy_score(y_test, test_pred))

        results[name] = {
            "train_accuracy": train_metrics["accuracy"],
            "test_accuracy": test_metrics["accuracy"],
            "train_accuracy_fraction": train_accuracy_fraction,
            "test_accuracy_fraction": test_accuracy_fraction,
            "accuracy": test_metrics["accuracy"],
            "precision": test_metrics["precision"],
            "recall": test_metrics["recall"],
            "f1_score": test_metrics["f1_score"],
        }
        trained_models[name] = model

        print(
            f"  Train accuracy: {train_metrics['accuracy']:.2f}% | "
            f"Test accuracy: {test_metrics['accuracy']:.2f}% | "
            f"Test weighted F1: {test_metrics['f1_score']:.2f}%"
        )

    # -----------------------------------------------------------------------
    # 8. SELECT THE DEPLOYMENT MODEL
    # -----------------------------------------------------------------------

    # The supplied notebook's conclusion identifies Kernelized SVC with PCA
    # as its best model by recall, with roughly 80.21% accuracy. Keep that model
    # as the default selected model to match the notebook's stated conclusion.
    # Do not choose a model using the held-out test scores alone in a production
    # evaluation; use cross-validation/validation data for model selection.
    selected_name = "Kernelized SVC with PCA"
    selected_model = trained_models[selected_name]
    selected_test_predictions = selected_model.predict(X_test_pca)

    # -----------------------------------------------------------------------
    # 9. SAVE THE FULL INFERENCE BUNDLE
    # -----------------------------------------------------------------------

    # The API must apply the same raw-feature cleanup, imputation, scaling, and
    # PCA steps before calling classifier.predict(). Save all fitted objects
    # so inference does not accidentally fit new preprocessing on user input.
    bundle = {
        "name": (
            "Kernelized SVC with PCA "
            "(sigmoid kernel, C=10, gamma=0.001; PCA retains 98% variance)"
        ),
        "classifier": selected_model,
        "imputer": imputer,
        "scaler": scaler,
        "pca": pca,
        "class_names": CLASS_NAMES,
        "selected_model_name": selected_name,
        "pca_components": int(pca.n_components_),
        "metrics": results[selected_name],
        "all_metrics": results,
        "raw_feature_count": int(raw_feature_count),
        "feature_count_after_drop": int(final_feature_count),
        "dropped_original_feature_indices": [13],
        "height_corrections": {"608": 108, "780": 180},
        "training_samples": int(len(X_train_raw)),
        "testing_samples": int(len(X_test_raw)),
        "preprocessing": [
            "replace '?' with NaN",
            "drop original feature column index 13",
            "correct Height values 608->108 and 780->180",
            "mean imputation fitted on training set",
            "StandardScaler fitted on training set",
            "PCA retaining 98% variance fitted on training set",
        ],
        "evaluation": (
            "80/20 held-out split, random_state=1, no stratification, "
            "no oversampling"
        ),
    }

    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    joblib.dump(bundle, MODEL_OUT_PATH)

    # JSON is easy for the frontend to load and display in a model-comparison table.
    with open(METRICS_OUT_PATH, "w", encoding="utf-8") as file:
        json.dump(results, file, indent=2)

    print("\n" + "=" * 72)
    print("FINAL MODEL COMPARISON (accuracy as fractions, 6 decimal places)")
    print("=" * 72)
    comparison_rows = []
    for index, (name, metrics) in enumerate(results.items()):
        comparison_rows.append({
            "#": index,
            "Model": name,
            "Train Accuracy": metrics["train_accuracy_fraction"],
            "Test Accuracy": metrics["test_accuracy_fraction"],
        })
    comparison_df = pd.DataFrame(comparison_rows)
    print(comparison_df.to_string(
        index=False,
        formatters={
            "Train Accuracy": lambda value: f"{value:.6f}",
            "Test Accuracy": lambda value: f"{value:.6f}",
        },
    ))

    print("\n" + "=" * 72)
    print(f"Selected deployment model: {selected_name}")
    print("Selected model metrics (percentages):")
    print(json.dumps(results[selected_name], indent=2))
    print("\nClassification report for selected model:")
    print(classification_report(
        y_test, selected_test_predictions, zero_division=0
    ))
    print(f"\nModel bundle saved to: {MODEL_OUT_PATH}")
    print(f"All model metrics saved to: {METRICS_OUT_PATH}")
    print("Finished. This project is for research/prototyping, not clinical diagnosis.")

    return bundle


# Training starts only when this file is run directly, not when imported by an API.
if __name__ == "__main__":
    train_pipeline()
