#!/usr/bin/env bash
echo "Starting HousePrice AI Backend on port 8001..."
export PYTHONPATH="."
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
