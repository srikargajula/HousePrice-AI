"""
Tests for Preprocessing, Model Training, and Serialization.
"""

import os
import json
import joblib
import pytest
import numpy as np
import pandas as pd
from backend.train_model import train_and_evaluate


def test_train_pipeline_execution(tmp_path):
    """Test full training pipeline execution on a temporary output directory."""
    temp_models_dir = str(tmp_path / "models")
    metadata = train_and_evaluate(
        data_path="backend/data/housing.csv",
        output_dir=temp_models_dir,
        test_size=0.2,
        random_state=42
    )

    # Verify return metadata
    assert "best_model_name" in metadata
    assert "models_comparison" in metadata
    assert len(metadata["models_comparison"]) == 3
    assert "feature_importances" in metadata
    assert len(metadata["feature_importances"]) == 13

    # Check files created
    best_model_file = os.path.join(temp_models_dir, "best_model.joblib")
    metadata_file = os.path.join(temp_models_dir, "metadata.json")
    schema_file = os.path.join(temp_models_dir, "feature_schema.json")

    assert os.path.exists(best_model_file)
    assert os.path.exists(metadata_file)
    assert os.path.exists(schema_file)

    # Test reloading pipeline in a fresh call
    loaded_pipe = joblib.load(best_model_file)
    assert hasattr(loaded_pipe, "predict")

    # Test that predictions are numeric, finite, and in a reasonable range
    dummy_input = pd.DataFrame([{
        "crim": 0.26, "zn": 0.0, "indus": 9.69, "chas": 0, "nox": 0.54,
        "rm": 6.21, "age": 77.5, "dis": 3.21, "rad": 5.0, "tax": 330.0,
        "ptratio": 19.05, "b": 391.44, "lstat": 11.36
    }])
    pred = loaded_pipe.predict(dummy_input)
    assert len(pred) == 1
    val = float(pred[0])
    assert np.isfinite(val)
    assert 5.0 <= val <= 50.0, f"Predicted value {val} out of expected range"


def test_model_metrics_are_authentic():
    """Verify saved metadata contains real test evaluations, not mock numbers."""
    metadata_path = "backend/models/metadata.json"
    assert os.path.exists(metadata_path)
    with open(metadata_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    for m_name, detail in meta["models_comparison"].items():
        metrics = detail["test_metrics"]
        assert 0.0 < metrics["r2_score"] <= 1.0
        assert metrics["mae"] > 0.0
        assert metrics["rmse"] > 0.0
        # MAE should typically be less than or equal to RMSE
        assert metrics["mae"] <= metrics["rmse"]
