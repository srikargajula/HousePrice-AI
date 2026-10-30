"""
API Routes for HousePrice AI backend.
"""

from datetime import datetime, timezone
import logging
from typing import Dict, Any, Optional

from fastapi import APIRouter, HTTPException, status, Query
from backend.app.schemas.prediction import (
    HouseFeaturesInput,
    PredictionResponse,
    PredictionHistoryResponse
)
from backend.app.schemas.model_info import (
    HealthResponse,
    ModelInfoResponse,
    AnalyticsResponse
)
from backend.app.services.ml_service import ml_service
from backend.app.services.history_service import history_service
from backend.app.core.config import settings
from backend.train_model import train_and_evaluate

logger = logging.getLogger("HousePriceAI.Routes")
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
def get_health():
    """Check backend operational health, model status, and dataset readiness."""
    health_data = ml_service.check_health()
    return health_data


@router.get("/model-info", response_model=ModelInfoResponse, tags=["Machine Learning"])
def get_model_info():
    """
    Retrieve current model architecture, feature schema with statistical bounds,
    and held-out test evaluation metrics.
    """
    try:
        return ml_service.get_model_info()
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in /model-info: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred retrieving model information: {str(e)}"
        )


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_price(payload: HouseFeaturesInput):
    """
    Validate input property characteristics and predict estimated selling price.
    Uses the trained machine learning pipeline. Records prediction to history.
    """
    try:
        input_dict = payload.model_dump()
        selected_model = input_dict.pop("selected_model", None)

        # Run inference
        result = ml_service.predict(input_dict, selected_model_name=selected_model)

        now_iso = datetime.now(timezone.utc).isoformat()
        disclaimer = (
            "This prediction is an educational machine learning estimate based on the historical "
            "Boston Housing benchmark. It is not an official appraisal or guaranteed market selling price."
        )

        response = PredictionResponse(
            predicted_price=result["predicted_price"],
            predicted_value_raw=result["predicted_value_raw"],
            currency=result["currency"],
            target_unit=result["target_unit"],
            model_name=result["model_name"],
            prediction_timestamp=now_iso,
            disclaimer=disclaimer,
            input_summary=result["input_summary"],
            top_feature_factors=result["top_feature_factors"],
            price_bracket=result["price_bracket"]
        )

        # Persist to SQLite history
        try:
            history_service.record_prediction(
                predicted_price=result["predicted_price"],
                raw_predicted_value=result["predicted_value_raw"],
                currency=result["currency"],
                model_name=result["model_name"],
                input_features=result["input_summary"]
            )
        except Exception as db_err:
            logger.warning(f"Failed to record prediction in history: {db_err}")

        return response

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid feature inputs: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )


@router.get("/analytics", response_model=AnalyticsResponse, tags=["Analytics"])
def get_analytics():
    """
    Retrieve model comparison data across all candidate regression algorithms,
    R², MAE, RMSE metrics, Actual vs Predicted points, and feature importance rankings.
    """
    try:
        return ml_service.get_analytics()
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in /analytics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred loading analytics: {str(e)}"
        )


@router.get("/predictions", response_model=PredictionHistoryResponse, tags=["History"])
def get_predictions(limit: int = Query(20, ge=1, le=100)):
    """Retrieve recent house price predictions from the SQLite store."""
    try:
        records = history_service.fetch_history(limit=limit)
        return PredictionHistoryResponse(
            total_count=len(records),
            predictions=records
        )
    except Exception as e:
        logger.error(f"Error fetching predictions history: {e}")
        return PredictionHistoryResponse(total_count=0, predictions=[])


@router.post("/retrain", tags=["Development"])
def trigger_retraining():
    """
    Development-only endpoint to retrain candidate regression models on the dataset,
    update test metrics, and reload the active model.
    """
    if not settings.ALLOW_RETRAIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Model retraining endpoint is disabled in production settings."
        )

    try:
        logger.info("Retraining requested via API...")
        metadata = train_and_evaluate(
            data_path=settings.DATASET_PATH,
            output_dir=settings.MODELS_DIR
        )
        # Reload memory cache
        ml_service.load_artifacts()
        return {
            "status": "success",
            "message": "Model retraining completed successfully.",
            "best_model": metadata.get("best_model_name"),
            "dataset_size": metadata.get("dataset_size")
        }
    except Exception as e:
        logger.error(f"Retraining failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model retraining failed: {str(e)}"
        )
