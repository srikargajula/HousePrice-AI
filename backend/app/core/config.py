"""
Application Configuration settings for HousePrice AI backend.
"""

import os
from typing import List


class Settings:
    PROJECT_NAME: str = "HousePrice AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Base directory paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    MODELS_DIR: str = os.path.join(BASE_DIR, "models")

    DATASET_PATH: str = os.environ.get("DATA_PATH", os.path.join(DATA_DIR, "housing.csv"))
    BEST_MODEL_PATH: str = os.path.join(MODELS_DIR, "best_model.joblib")
    METADATA_PATH: str = os.path.join(MODELS_DIR, "metadata.json")
    SCHEMA_PATH: str = os.path.join(MODELS_DIR, "feature_schema.json")
    DATABASE_PATH: str = os.environ.get("DATABASE_PATH", os.path.join(DATA_DIR, "predictions.db"))

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Allows local development seamlessly
    ]

    ALLOW_RETRAIN: bool = os.environ.get("ALLOW_RETRAIN_ENDPOINT", "True").lower() in ("true", "1")


settings = Settings()
