"""
Machine Learning Service for HousePrice AI.
Encapsulates model loading, feature validation, inference, and analytics caching.
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np
import joblib

from backend.app.core.config import settings

logger = logging.getLogger("HousePriceAI.MLService")


class MLService:
    def __init__(self):
        self.best_model = None
        self.models_cache: Dict[str, Any] = {}
        self.metadata: Optional[Dict[str, Any]] = None
        self.feature_schema: Optional[Dict[str, Any]] = None
        self.is_ready: bool = False
        self.load_artifacts()

    def load_artifacts(self) -> bool:
        """Attempt to load trained pipeline, metadata, and feature schema."""
        try:
            if not os.path.exists(settings.METADATA_PATH) or not os.path.exists(settings.SCHEMA_PATH):
                logger.warning(
                    f"Model artifacts not found in {settings.MODELS_DIR}. "
                    "Run 'python backend/train_model.py' to train and serialize models."
                )
                self.is_ready = False
                return False

            with open(settings.METADATA_PATH, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

            with open(settings.SCHEMA_PATH, "r", encoding="utf-8") as f:
                self.feature_schema = json.load(f)

            if os.path.exists(settings.BEST_MODEL_PATH):
                self.best_model = joblib.load(settings.BEST_MODEL_PATH)
                logger.info(f"Loaded primary model pipeline from: {settings.BEST_MODEL_PATH}")

            # Pre-load alternative models if present
            for alt in ["linear_regression", "random_forest_regressor", "gradient_boosting_regressor"]:
                alt_path = os.path.join(settings.MODELS_DIR, f"{alt}.joblib")
                if os.path.exists(alt_path):
                    clean_name = alt.replace("_", " ").title()
                    self.models_cache[clean_name] = joblib.load(alt_path)

            self.is_ready = self.best_model is not None and self.metadata is not None
            return self.is_ready
        except Exception as e:
            logger.error(f"Failed to load ML artifacts: {e}", exc_info=True)
            self.is_ready = False
            return False

    def check_health(self) -> Dict[str, Any]:
        """Check system health, model readiness, and dataset availability."""
        dataset_exists = os.path.exists(settings.DATASET_PATH) or os.path.exists(
            os.path.join(settings.DATA_DIR, "housing.csv")
        ) or os.path.exists(os.path.join(settings.DATA_DIR, "boston.csv"))

        if not self.is_ready:
            self.load_artifacts()

        if self.is_ready:
            status = "ok"
            message = "Model service is healthy, trained pipeline and schema are ready."
        elif dataset_exists:
            status = "warning"
            message = (
                "Dataset is available but model artifacts are not yet trained. "
                "Execute 'python backend/train_model.py' to generate model artifacts."
            )
        else:
            status = "error"
            message = (
                "Model artifacts and dataset are missing. "
                "Place 'housing.csv' in backend/data/ and run 'python backend/train_model.py'."
            )

        return {
            "status": status,
            "model_loaded": self.is_ready,
            "dataset_available": dataset_exists,
            "best_model_name": self.metadata.get("best_model_name") if self.metadata else None,
            "version": settings.VERSION,
            "message": message
        }

    def get_model_info(self) -> Dict[str, Any]:
        """Return comprehensive model info, feature schema, and evaluation metrics."""
        if not self.is_ready:
            if not self.load_artifacts():
                raise RuntimeError(
                    "Model artifacts are not loaded. Please run 'python backend/train_model.py' first."
                )

        best_model_name = self.metadata["best_model_name"]
        eval_detail = self.metadata["models_comparison"].get(best_model_name, {})
        test_metrics = eval_detail.get("test_metrics", {
            "r2_score": 0.0,
            "mae": 0.0,
            "rmse": 0.0,
            "mae_dollars": 0.0,
            "rmse_dollars": 0.0
        })

        return {
            "model_name": best_model_name,
            "dataset_name": self.metadata.get("dataset_name", "Boston Housing Dataset"),
            "dataset_source": self.metadata.get("dataset_source", ""),
            "dataset_size": self.metadata.get("dataset_size", 506),
            "train_size": self.metadata.get("train_size", 404),
            "test_size": self.metadata.get("test_size", 102),
            "feature_count": self.metadata.get("feature_count", 13),
            "features": self.metadata.get("features", []),
            "target_info": self.metadata.get("target", {}),
            "evaluation_metrics": test_metrics,
            "feature_schema": self.feature_schema,
            "ethical_disclaimer": self.metadata.get("ethical_disclaimer", "")
        }

    def get_analytics(self) -> Dict[str, Any]:
        """Return comparison data for all models, actual vs predicted chart points, and residuals."""
        if not self.is_ready:
            if not self.load_artifacts():
                raise RuntimeError(
                    "Model artifacts are not loaded. Please run 'python backend/train_model.py' first."
                )

        return {
            "best_model_name": self.metadata["best_model_name"],
            "models_comparison": self.metadata["models_comparison"],
            "feature_importances": self.metadata.get("feature_importances", []),
            "test_actual_vs_predicted": self.metadata.get("test_actual_vs_predicted", []),
            "training_config": self.metadata.get("training_config", {}),
            "dataset_stats": {
                "dataset_size": self.metadata.get("dataset_size", 506),
                "train_size": self.metadata.get("train_size", 404),
                "test_size": self.metadata.get("test_size", 102)
            }
        }

    def predict(self, input_data: Dict[str, Any], selected_model_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Validate input features against training schema and run inference.
        Supports model override if specified.
        """
        if not self.is_ready:
            if not self.load_artifacts():
                raise RuntimeError(
                    "Model is not ready for predictions. "
                    "Run 'python backend/train_model.py' to train and save the model artifacts."
                )

        feature_names = self.metadata["features"]

        # Choose pipeline: selected model override or default best model
        active_pipeline = self.best_model
        active_model_name = self.metadata["best_model_name"]

        if selected_model_name:
            # Match case-insensitively with cached models
            matched_name = None
            for key, pipe in self.models_cache.items():
                if key.lower() == selected_model_name.lower():
                    active_pipeline = pipe
                    matched_name = key
                    break
            if matched_name:
                active_model_name = matched_name

        # Construct dataframe strictly in training feature order
        ordered_inputs = {}
        for feat in feature_names:
            if feat not in input_data:
                # Fallback to schema default or mean
                schema_def = self.feature_schema.get(feat, {})
                ordered_inputs[feat] = schema_def.get("default", 0.0)
            else:
                ordered_inputs[feat] = float(input_data[feat])

        input_df = pd.DataFrame([ordered_inputs], columns=feature_names)

        # Run inference through fitted scikit-learn pipeline
        raw_pred = float(active_pipeline.predict(input_df)[0])
        # Guarantee non-negative house price
        raw_pred = max(0.0, raw_pred)

        multiplier = float(self.metadata.get("target", {}).get("multiplier", 1000.0))
        predicted_dollars = round(raw_pred * multiplier, 2)

        # Qualitative bracket
        if raw_pred < 17.0:
            bracket = "Affordable / Value Tier"
        elif raw_pred < 28.0:
            bracket = "Mid-Market / Suburb Standard"
        elif raw_pred < 40.0:
            bracket = "Upper-Tier Residential"
        else:
            bracket = "Luxury / High-End Estate"

        # Determine top feature contributors based on deviations from mean & feature importance
        top_factors = []
        for fi in self.metadata.get("feature_importances", [])[:5]:
            feat = fi["feature"]
            val = ordered_inputs.get(feat, 0.0)
            schema_info = self.feature_schema.get(feat, {})
            mean_val = schema_info.get("mean", val)

            # High rooms and low lower-status population drive higher values in Boston dataset
            if feat == "rm":
                direction = "increases_value" if val >= mean_val else "decreases_value"
            elif feat in ["lstat", "crim", "tax", "ptratio"]:
                direction = "decreases_value" if val > mean_val else "increases_value"
            else:
                direction = "neutral"

            top_factors.append({
                "feature": feat,
                "label": fi["label"],
                "input_value": val,
                "importance_pct": fi["importance_pct"],
                "impact_direction": direction
            })

        return {
            "predicted_price": predicted_dollars,
            "predicted_value_raw": round(raw_pred, 2),
            "currency": self.metadata.get("target", {}).get("currency", "USD"),
            "target_unit": self.metadata.get("target", {}).get("unit", "$1,000 USD"),
            "model_name": active_model_name,
            "input_summary": ordered_inputs,
            "top_feature_factors": top_factors,
            "price_bracket": bracket
        }


ml_service = MLService()
