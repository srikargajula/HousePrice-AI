Write-Host "Starting HousePrice AI Backend on port 8001..." -ForegroundColor Cyan
$env:PYTHONPATH = "."
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
