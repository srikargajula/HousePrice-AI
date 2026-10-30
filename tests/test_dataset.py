"""
Tests for Dataset Validation and Integrity.
"""

import os
import pytest
import pandas as pd
from backend.train_model import load_dataset, build_feature_schema, TARGET_COLUMN


def test_dataset_exists_and_loads():
    """Verify that dataset CSV exists and can be loaded."""
    data_path = "backend/data/housing.csv"
    assert os.path.exists(data_path), f"Dataset file does not exist at {data_path}"
    df = load_dataset(data_path)
    assert not df.empty
    assert len(df) == 506, f"Expected 506 rows, got {len(df)}"


def test_dataset_has_expected_columns():
    """Verify that all 13 features and 1 target are present."""
    df = load_dataset("backend/data/housing.csv")
    expected_cols = [
        "crim", "zn", "indus", "chas", "nox", "rm", "age",
        "dis", "rad", "tax", "ptratio", "b", "lstat", "medv"
    ]
    for col in expected_cols:
        assert col in df.columns, f"Missing required column: {col}"


def test_target_column_validity():
    """Ensure target variable medv has positive finite numeric values."""
    df = load_dataset("backend/data/housing.csv")
    y = df[TARGET_COLUMN]
    assert y.notnull().all(), "Target variable contains null values"
    assert (y > 0).all(), "Target variable contains non-positive values"
    assert float(y.min()) >= 5.0
    assert float(y.max()) <= 50.0


def test_feature_schema_generation():
    """Verify that dynamic feature schema contains all features with statistical bounds."""
    df = load_dataset("backend/data/housing.csv")
    X = df.drop(columns=[TARGET_COLUMN])
    schema = build_feature_schema(X)
    assert len(schema) == 13
    assert "rm" in schema
    assert "lstat" in schema
    assert schema["rm"]["min"] < schema["rm"]["mean"] < schema["rm"]["max"]
    assert schema["rm"]["default"] > 0
