Write-Host "Running HousePrice AI Automated Pytest Suite..." -ForegroundColor Cyan
$env:PYTHONPATH = "."
python -m pytest tests/ -v
