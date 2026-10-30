"""
Pydantic Schemas for Model Information and Analytics endpoints.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., description="API operational status ('ok', 'warning', 'error')")
    model_loaded: bool = Field(..., description="Whether trained ML model is ready for inference")
    dataset_available: bool = Field(..., description="Whether dataset CSV is available locally")
    best_model_name: Optional[str] = None
    version: str
    message: str


class FeatureFieldSchema(BaseModel):
    name: str
    label: str
    description: str
    unit: str
    step: float
    category: str
    type: str
    min: float
    max: float
    mean: float
    median: float
    std: float
    default: float
    required: bool


class EvaluationMetrics(BaseModel):
    r2_score: float
    mae: float
    rmse: float
    mae_dollars: Optional[float] = None
    rmse_dollars: Optional[float] = None


class ModelEvaluationDetail(BaseModel):
    name: str
    test_metrics: EvaluationMetrics
    train_metrics: Optional[Dict[str, float]] = None


class FeatureImportanceItem(BaseModel):
    feature: str
    label: str
    importance: float
    importance_pct: float


class ModelInfoResponse(BaseModel):
    model_name: str
    dataset_name: str
    dataset_source: str
    dataset_size: int
    train_size: int
    test_size: int
    feature_count: int
    features: List[str]
    target_info: Dict[str, Any]
    evaluation_metrics: EvaluationMetrics
    feature_schema: Dict[str, FeatureFieldSchema]
    ethical_disclaimer: str


class ActualVsPredictedPoint(BaseModel):
    id: int
    actual: float
    predicted: float
    actual_dollars: float
    predicted_dollars: float
    residual: float
    abs_error: float


class AnalyticsResponse(BaseModel):
    best_model_name: str
    models_comparison: Dict[str, ModelEvaluationDetail]
    feature_importances: List[FeatureImportanceItem]
    test_actual_vs_predicted: List[ActualVsPredictedPoint]
    training_config: Dict[str, Any]
    dataset_stats: Dict[str, Any]
