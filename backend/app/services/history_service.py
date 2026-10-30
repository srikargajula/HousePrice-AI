"""
History Service for managing prediction persistence.
"""

from typing import Dict, Any, List
from backend.app.core.database import insert_prediction, get_recent_predictions


class HistoryService:
    @staticmethod
    def record_prediction(
        predicted_price: float,
        raw_predicted_value: float,
        currency: str,
        model_name: str,
        input_features: Dict[str, Any]
    ) -> int:
        return insert_prediction(
            predicted_price=predicted_price,
            raw_predicted_value=raw_predicted_value,
            currency=currency,
            model_name=model_name,
            input_features=input_features
        )

    @staticmethod
    def fetch_history(limit: int = 20) -> List[Dict[str, Any]]:
        return get_recent_predictions(limit=limit)


history_service = HistoryService()
