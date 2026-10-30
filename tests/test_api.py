"""
Tests for FastAPI Endpoints and API Validation.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root endpoint returns status online and API links."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "api_endpoints" in data


def test_health_endpoint():
    """Verify /api/health endpoint reports status and model state."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "warning"]
    assert data["model_loaded"] is True
    assert data["best_model_name"] is not None


def test_model_info_endpoint():
    """Verify /api/model-info returns schema, target info, and metrics."""
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "feature_schema" in data
    assert len(data["feature_schema"]) == 13
    assert "evaluation_metrics" in data
    assert data["evaluation_metrics"]["r2_score"] > 0.8


def test_predict_endpoint_valid():
    """Verify /api/predict returns predicted price, currency, model name, and factors."""
    sample_payload = {
        "crim": 0.027,
        "zn": 18.0,
        "indus": 2.31,
        "chas": 0,
        "nox": 0.538,
        "rm": 6.575,
        "age": 65.2,
        "dis": 4.09,
        "rad": 1.0,
        "tax": 296.0,
        "ptratio": 15.3,
        "b": 396.9,
        "lstat": 4.98
    }
    response = client.post("/api/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert data["predicted_price"] > 10000.0
    assert data["currency"] == "USD"
    assert "disclaimer" in data
    assert "top_feature_factors" in data
    assert len(data["top_feature_factors"]) > 0


def test_predict_endpoint_invalid_bounds():
    """Verify validation error when input values violate numeric bounds."""
    bad_payload = {
        "crim": -5.0,  # Below ge=0.0
        "rm": 25.0    # Above le=10.0
    }
    response = client.post("/api/predict", json=bad_payload)
    assert response.status_code == 422


def test_analytics_endpoint():
    """Verify /api/analytics returns models comparison and feature importances."""
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "models_comparison" in data
    assert "feature_importances" in data
    assert len(data["feature_importances"]) == 13
    assert "test_actual_vs_predicted" in data
    assert len(data["test_actual_vs_predicted"]) == 102


def test_predictions_history_endpoint():
    """Verify /api/predictions retrieves recent recorded predictions."""
    response = client.get("/api/predictions?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "predictions" in data
    assert "total_count" in data
