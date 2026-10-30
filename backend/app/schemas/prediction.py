"""
Pydantic Schemas for Prediction Requests and Responses.
"""

from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, ConfigDict


class HouseFeaturesInput(BaseModel):
    """
    Input features for house price prediction matching Boston Housing dataset schema.
    Validation bounds are aligned with dataset min/max values with reasonable buffer.
    """
    crim: float = Field(0.26, ge=0.0, le=100.0, description="Per capita crime rate by town")
    zn: float = Field(0.0, ge=0.0, le=100.0, description="Proportion of residential land zoned for lots over 25k sq ft")
    indus: float = Field(9.69, ge=0.0, le=50.0, description="Proportion of non-retail business acres per town")
    chas: int = Field(0, ge=0, le=1, description="Charles River tract (1 if bounds river, 0 otherwise)")
    nox: float = Field(0.54, ge=0.3, le=1.0, description="Nitric oxides concentration (parts per 10 million)")
    rm: float = Field(6.21, ge=3.0, le=10.0, description="Average number of rooms per dwelling")
    age: float = Field(77.5, ge=0.0, le=100.0, description="Proportion of owner-occupied units built prior to 1940 (%)")
    dis: float = Field(3.21, ge=0.5, le=15.0, description="Weighted distances to five Boston employment centers (miles)")
    rad: float = Field(5.0, ge=1.0, le=30.0, description="Index of accessibility to radial highways")
    tax: float = Field(330.0, ge=150.0, le=800.0, description="Full-value property-tax rate per $10,000")
    ptratio: float = Field(19.05, ge=10.0, le=25.0, description="Pupil-teacher ratio by town")
    b: float = Field(391.44, ge=0.0, le=450.0, description="Historical census index metric (1000*(Bk - 0.63)^2)")
    lstat: float = Field(11.36, ge=1.0, le=45.0, description="Percentage of lower socioeconomic status of the population (%)")

    # Optional model selection (e.g. "Gradient Boosting Regressor", "Random Forest Regressor", "Linear Regression")
    selected_model: Optional[str] = Field(None, description="Optional algorithm override for prediction")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
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
                "lstat": 4.98,
                "selected_model": "Gradient Boosting Regressor"
            }
        }
    )


class FeatureContribution(BaseModel):
    feature: str
    label: str
    input_value: float
    importance_pct: float
    impact_direction: str  # "increases_value", "decreases_value", "neutral"


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Estimated house price in actual currency (e.g. $240,000)")
    predicted_value_raw: float = Field(..., description="Raw model target value (e.g. 24.0 in thousands)")
    currency: str = Field("USD", description="Currency symbol/code")
    target_unit: str = Field("$1,000 USD", description="Dataset target unit")
    model_name: str = Field(..., description="Algorithm used to generate prediction")
    prediction_timestamp: str = Field(..., description="ISO-8601 UTC timestamp")
    disclaimer: str = Field(..., description="Educational estimate disclaimer")
    input_summary: Dict[str, Any] = Field(..., description="Echo of provided input features")
    top_feature_factors: List[FeatureContribution] = Field(default_factory=list, description="Top influential features")
    price_bracket: str = Field("Mid Range", description="Qualitative price bracket classification")


class PredictionHistoryItem(BaseModel):
    id: int
    predicted_price: float
    raw_predicted_value: float
    currency: str
    model_name: str
    input_features: Dict[str, Any]
    created_at: str


class PredictionHistoryResponse(BaseModel):
    total_count: int
    predictions: List[PredictionHistoryItem]
