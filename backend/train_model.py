"""
HousePrice AI - Model Training Pipeline
Trains Linear Regression, Random Forest Regressor, and Gradient Boosting Regressor
on the Boston Housing Price dataset, evaluates on a held-out test split,
and serializes the best performing pipeline and comprehensive metadata.
"""

import os
import json
import logging
import argparse
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("HousePriceAI.Trainer")

# Feature metadata and schema documentation
FEATURE_METADATA = {
    "crim": {
        "label": "Per Capita Crime Rate",
        "description": "Per capita crime rate by town",
        "unit": "rate",
        "step": 0.01,
        "category": "Neighborhood Safety"
    },
    "zn": {
        "label": "Zoned Land (>25k sq ft)",
        "description": "Proportion of residential land zoned for lots over 25,000 sq ft",
        "unit": "%",
        "step": 0.5,
        "category": "Zoning & Land"
    },
    "indus": {
        "label": "Non-Retail Business Acres",
        "description": "Proportion of non-retail business acres per town",
        "unit": "%",
        "step": 0.1,
        "category": "Industrial & Commercial"
    },
    "chas": {
        "label": "Charles River Tract",
        "description": "Tract bounds Charles River (1 = Yes, 0 = No)",
        "unit": "binary",
        "step": 1.0,
        "category": "Location & Amenities"
    },
    "nox": {
        "label": "Nitric Oxide Concentration",
        "description": "Nitric oxides concentration (parts per 10 million)",
        "unit": "pphm",
        "step": 0.01,
        "category": "Environmental Quality"
    },
    "rm": {
        "label": "Average Rooms Per Dwelling",
        "description": "Average number of rooms per dwelling",
        "unit": "rooms",
        "step": 0.1,
        "category": "Property Characteristics"
    },
    "age": {
        "label": "Built Prior to 1940",
        "description": "Proportion of owner-occupied units built prior to 1940",
        "unit": "%",
        "step": 1.0,
        "category": "Property Age"
    },
    "dis": {
        "label": "Distance to Employment Centers",
        "description": "Weighted distances to five Boston employment centers",
        "unit": "miles",
        "step": 0.1,
        "category": "Accessibility"
    },
    "rad": {
        "label": "Highway Accessibility Index",
        "description": "Index of accessibility to radial highways",
        "unit": "index",
        "step": 1.0,
        "category": "Accessibility"
    },
    "tax": {
        "label": "Property Tax Rate",
        "description": "Full-value property-tax rate per $10,000",
        "unit": "$ / $10k",
        "step": 5.0,
        "category": "Tax & Financial"
    },
    "ptratio": {
        "label": "Pupil-Teacher Ratio",
        "description": "Pupil-teacher ratio by town",
        "unit": "ratio",
        "step": 0.1,
        "category": "Education"
    },
    "b": {
        "label": "B Index (Historical Metric)",
        "description": "1000(Bk - 0.63)^2 where Bk is the proportion of Black residents by town (historical census variable)",
        "unit": "index",
        "step": 1.0,
        "category": "Demographics"
    },
    "lstat": {
        "label": "Lower Status Population",
        "description": "Percentage of lower socioeconomic status of the population",
        "unit": "%",
        "step": 0.1,
        "category": "Demographics"
    }
}

TARGET_COLUMN = "medv"
TARGET_METADATA = {
    "name": "medv",
    "label": "Median Home Value",
    "unit": "$1,000 USD",
    "description": "Median value of owner-occupied homes in $1000's (1970s census era benchmark)",
    "multiplier": 1000.0,
    "currency": "USD"
}


def load_dataset(data_path: str) -> pd.DataFrame:
    """Load and validate dataset from file path."""
    if not os.path.exists(data_path):
        # Check alternative common names in same directory
        dir_name = os.path.dirname(data_path) or "."
        for alt_name in ["housing.csv", "boston.csv", "BostonHousing.csv"]:
            alt_path = os.path.join(dir_name, alt_name)
            if os.path.exists(alt_path):
                data_path = alt_path
                break
        else:
            raise FileNotFoundError(
                f"Dataset not found at {data_path}. Please place 'housing.csv' or 'boston.csv' in the data directory."
            )

    logger.info(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    # Standardize column names to lower case
    df.columns = [c.strip().lower() for c in df.columns]

    if TARGET_COLUMN not in df.columns:
        raise ValueError(
            f"Target column '{TARGET_COLUMN}' not found in CSV. Available columns: {list(df.columns)}"
        )

    logger.info(f"Dataset successfully loaded. Shape: {df.shape}")
    return df


def build_feature_schema(X: pd.DataFrame) -> Dict[str, Any]:
    """Generate dynamic schema with bounds, statistics, and metadata for each feature."""
    schema = {}
    for col in X.columns:
        series = pd.to_numeric(X[col], errors='coerce')
        min_val = float(series.min())
        max_val = float(series.max())
        mean_val = float(series.mean())
        median_val = float(series.median())
        std_val = float(series.std())

        meta = FEATURE_METADATA.get(col, {
            "label": col.replace("_", " ").title(),
            "description": f"Feature {col}",
            "unit": "numeric",
            "step": 0.1,
            "category": "General"
        })

        schema[col] = {
            "name": col,
            "label": meta["label"],
            "description": meta["description"],
            "unit": meta["unit"],
            "step": meta["step"],
            "category": meta["category"],
            "type": "float" if col != "chas" else "int",
            "min": round(min_val, 4),
            "max": round(max_val, 4),
            "mean": round(mean_val, 4),
            "median": round(median_val, 4),
            "std": round(std_val, 4),
            "default": round(median_val, 2 if col != "chas" else 0),
            "required": True
        }
    return schema


def train_and_evaluate(
    data_path: str = "backend/data/housing.csv",
    output_dir: str = "backend/models",
    test_size: float = 0.2,
    random_state: int = 42
) -> Dict[str, Any]:
    """Train Linear Regression, Random Forest, and Gradient Boosting models, select best, and save artifacts."""
    os.makedirs(output_dir, exist_ok=True)
    df = load_dataset(data_path)

    # Separate features and target
    X = df.drop(columns=[TARGET_COLUMN])
    y = df[TARGET_COLUMN].astype(float)

    # Validate feature list
    feature_names = list(X.columns)
    logger.info(f"Target variable: '{TARGET_COLUMN}'")
    logger.info(f"Input features ({len(feature_names)}): {feature_names}")

    # Build dynamic feature schema
    feature_schema = build_feature_schema(X)

    # Train / test split with reproducible seed
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    logger.info(f"Train split size: {len(X_train)} samples; Test split size: {len(X_test)} samples")

    # Define common preprocessor pipeline (median imputation + standard scaling)
    numeric_features = feature_names
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline(steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric_features)
        ]
    )

    # Candidate models
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=150, max_depth=12, random_state=random_state, n_jobs=-1
        ),
        "Gradient Boosting Regressor": GradientBoostingRegressor(
            n_estimators=150, max_depth=4, learning_rate=0.08, random_state=random_state
        )
    }

    evaluations: Dict[str, Any] = {}
    fitted_pipelines: Dict[str, Pipeline] = {}

    best_model_name = None
    best_r2 = -float("inf")

    for name, regressor in models.items():
        logger.info(f"Training {name}...")
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", regressor)
        ])

        # Fit strictly on train data to prevent target leakage
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline

        # Predictions on train and held-out test
        y_train_pred = pipeline.predict(X_train)
        y_test_pred = pipeline.predict(X_test)

        r2_test = float(r2_score(y_test, y_test_pred))
        mae_test = float(mean_absolute_error(y_test, y_test_pred))
        rmse_test = float(np.sqrt(mean_squared_error(y_test, y_test_pred)))

        r2_train = float(r2_score(y_train, y_train_pred))
        mae_train = float(mean_absolute_error(y_train, y_train_pred))
        rmse_train = float(np.sqrt(mean_squared_error(y_train, y_train_pred)))

        logger.info(
            f"[{name}] Test R2: {r2_test:.4f} | Test MAE: {mae_test:.4f} ($k) | Test RMSE: {rmse_test:.4f} ($k)"
        )

        evaluations[name] = {
            "name": name,
            "test_metrics": {
                "r2_score": round(r2_test, 4),
                "mae": round(mae_test, 4),
                "rmse": round(rmse_test, 4),
                "mae_dollars": round(mae_test * TARGET_METADATA["multiplier"], 2),
                "rmse_dollars": round(rmse_test * TARGET_METADATA["multiplier"], 2)
            },
            "train_metrics": {
                "r2_score": round(r2_train, 4),
                "mae": round(mae_train, 4),
                "rmse": round(rmse_train, 4)
            }
        }

        # Model selection: Highest test R2 score
        if r2_test > best_r2:
            best_r2 = r2_test
            best_model_name = name

    logger.info(f"Selected Best Model: {best_model_name} (R2={best_r2:.4f})")

    # Extract feature importance from the best model or tree model
    best_pipeline = fitted_pipelines[best_model_name]
    best_regressor = best_pipeline.named_steps["regressor"]

    feature_importances = []
    if hasattr(best_regressor, "feature_importances_"):
        raw_importances = best_regressor.feature_importances_
        for feat, imp in zip(feature_names, raw_importances):
            feature_importances.append({
                "feature": feat,
                "label": feature_schema[feat]["label"],
                "importance": round(float(imp), 4),
                "importance_pct": round(float(imp) * 100, 2)
            })
        feature_importances.sort(key=lambda x: x["importance"], reverse=True)
    elif hasattr(best_regressor, "coef_"):
        raw_coefs = np.abs(best_regressor.coef_)
        total_coef = np.sum(raw_coefs) if np.sum(raw_coefs) > 0 else 1.0
        for feat, coef in zip(feature_names, raw_coefs):
            normalized = coef / total_coef
            feature_importances.append({
                "feature": feat,
                "label": feature_schema[feat]["label"],
                "importance": round(float(normalized), 4),
                "importance_pct": round(float(normalized) * 100, 2)
            })
        feature_importances.sort(key=lambda x: x["importance"], reverse=True)

    # Actual vs Predicted points for test set
    y_best_test_pred = best_pipeline.predict(X_test)
    test_samples = []
    for idx, (actual, pred) in enumerate(zip(y_test.values, y_best_test_pred)):
        residual = float(actual - pred)
        test_samples.append({
            "id": idx + 1,
            "actual": round(float(actual), 2),
            "predicted": round(float(pred), 2),
            "actual_dollars": round(float(actual) * TARGET_METADATA["multiplier"], 2),
            "predicted_dollars": round(float(pred) * TARGET_METADATA["multiplier"], 2),
            "residual": round(residual, 2),
            "abs_error": round(abs(residual), 2)
        })

    # Prepare comprehensive metadata object
    metadata = {
        "project_name": "HousePrice AI",
        "best_model_name": best_model_name,
        "dataset_name": "Boston Housing Dataset (Kaggle/Census)",
        "dataset_source": "https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data",
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "feature_count": len(feature_names),
        "features": feature_names,
        "target": TARGET_METADATA,
        "models_comparison": evaluations,
        "feature_importances": feature_importances,
        "test_actual_vs_predicted": test_samples,
        "training_config": {
            "test_split_ratio": test_size,
            "random_state": random_state,
            "evaluation_criterion": "Highest R² score on held-out test set"
        },
        "ethical_disclaimer": (
            "The Boston Housing dataset is an educational machine learning benchmark containing "
            "1970s historical census metrics. It includes socioeconomic variables and has documented fairness concerns. "
            "Predictions are educational estimates and should not be used as appraisals for modern real estate transactions."
        )
    }

    # Save artifacts
    model_save_path = os.path.join(output_dir, "best_model.joblib")
    joblib.dump(best_pipeline, model_save_path)
    logger.info(f"Saved trained pipeline to: {model_save_path}")

    # Also save each individual candidate model pipeline for direct comparison
    for m_name, m_pipe in fitted_pipelines.items():
        safe_name = m_name.lower().replace(" ", "_")
        joblib.dump(m_pipe, os.path.join(output_dir, f"{safe_name}.joblib"))

    metadata_save_path = os.path.join(output_dir, "metadata.json")
    with open(metadata_save_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Saved metadata to: {metadata_save_path}")

    schema_save_path = os.path.join(output_dir, "feature_schema.json")
    with open(schema_save_path, "w", encoding="utf-8") as f:
        json.dump(feature_schema, f, indent=2)
    logger.info(f"Saved feature schema to: {schema_save_path}")

    return metadata


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train HousePrice AI regression models.")
    parser.add_argument("--data", default="backend/data/housing.csv", help="Path to housing dataset CSV")
    parser.add_argument("--out", default="backend/models", help="Directory to save model artifacts")
    parser.add_argument("--test-size", type=float, default=0.2, help="Test split ratio (default: 0.2)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()

    train_and_evaluate(
        data_path=args.data,
        output_dir=args.out,
        test_size=args.test_size,
        random_state=args.seed
    )
