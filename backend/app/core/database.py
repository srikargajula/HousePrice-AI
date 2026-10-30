"""
SQLite Database interface for recording prediction history.
"""

import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from backend.app.core.config import settings

logger = logging.getLogger("HousePriceAI.Database")


def get_db_connection() -> sqlite3.Connection:
    """Return a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize predictions table if not exists."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    predicted_price REAL NOT NULL,
                    raw_predicted_value REAL NOT NULL,
                    currency TEXT NOT NULL DEFAULT 'USD',
                    model_name TEXT NOT NULL,
                    input_features TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)
            conn.commit()
            logger.info("SQLite database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")


def insert_prediction(
    predicted_price: float,
    raw_predicted_value: float,
    currency: str,
    model_name: str,
    input_features: Dict[str, Any]
) -> int:
    """Record a prediction in the SQLite history table."""
    now_iso = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO predictions 
            (predicted_price, raw_predicted_value, currency, model_name, input_features, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                predicted_price,
                raw_predicted_value,
                currency,
                model_name,
                json.dumps(input_features),
                now_iso
            )
        )
        conn.commit()
        return cursor.lastrowid


def get_recent_predictions(limit: int = 20) -> List[Dict[str, Any]]:
    """Retrieve recent prediction history entries."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, predicted_price, raw_predicted_value, currency, model_name, input_features, created_at
            FROM predictions
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,)
        )
        rows = cursor.fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "predicted_price": r["predicted_price"],
                "raw_predicted_value": r["raw_predicted_value"],
                "currency": r["currency"],
                "model_name": r["model_name"],
                "input_features": json.loads(r["input_features"]),
                "created_at": r["created_at"]
            })
        return results
