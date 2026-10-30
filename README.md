# HousePrice AI — Machine Learning Valuation & Analytics Dashboard

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-13%20Passed-brightgreen.svg?style=flat)]()

**HousePrice AI** is a production-grade, full-stack machine learning web application that estimates residential property selling prices using supervised machine learning regression algorithms.

The application allows users to submit structural, geographic, and municipal characteristics through an interactive web interface and immediately receive an estimated house price, key feature attributions, model comparison benchmarks, and empirical regression diagnostics.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Directory Structure](#project-directory-structure)
5. [Prerequisites](#prerequisites)
6. [Dataset Setup](#dataset-setup)
7. [Installation & Setup](#installation--setup)
8. [Model Training Pipeline](#model-training-pipeline)
9. [Running the Application](#running-the-application)
10. [REST API Documentation](#rest-api-documentation)
11. [Model Performance & Evaluation](#model-performance--evaluation)
12. [Testing & Quality Assurance](#testing--quality-assurance)
13. [Ethical Considerations & Limitations](#ethical-considerations--limitations)
14. [Troubleshooting Guide](#troubleshooting-guide)
15. [License & Credits](#license--credits)

---

## 1. Project Overview

- **Project Name:** HousePrice AI
- **Objective:** Predict the median selling price of residential properties using supervised ML regression pipelines.
- **Dataset:** Boston Housing Price benchmark dataset (CMU StatLib / Kaggle / U.S. Census Bureau).
- **Target Audience:** Real estate buyers, sellers, data science students, academic evaluators, and engineers studying modern full-stack ML workflows.

Unlike basic prototypes that rely on hardcoded scores or static heuristics, HousePrice AI features an end-to-end machine learning lifecycle:
1. Data ingestion with automated schema derivation and outlier bounds.
2. Leakage-free preprocessing (median imputation and standard scaling fit strictly on training splits).
3. Triple-algorithm benchmarking (**Linear Regression**, **Random Forest Regressor**, and **Gradient Boosting Regressor**).
4. Automated model selection evaluated on held-out test data ($n=102$).
5. Persistence via Joblib and metadata JSON.
6. A responsive, typed React dashboard with Recharts visualizations and SQLite audit history.

---

## 2. Key Features

- **Dynamic Property Valuation:** Enter property details or select pre-configured presets (Suburban Family Home, Riverfront Luxury Residence, City Fringe Apartment) to compute instant estimates.
- **Explainable AI (Feature Attribution):** Identifies top contributing factors (e.g. rooms per dwelling, socioeconomic index, employment distance) and illustrates whether they appreciated or depreciated the property value.
- **Multi-Algorithm Benchmarking:** Directly compare performance across Linear Regression, Random Forest, and Gradient Boosting Regressors. Allows real-time algorithm switching to compare how different model families price the same home.
- **Interactive Evaluation Dashboard:**
  - **Model Comparison Chart:** Grouped bar chart comparing $R^2$, MAE, and RMSE.
  - **Actual vs. Predicted Scatter Plot:** Evaluates test split predictions against the ideal $y = x$ reference diagonal.
  - **Residual Plot:** Visualizes error distribution ($Actual - Predicted$) relative to fitted values with a zero-residual line.
  - **Feature Importance Chart:** Horizontal ranking of relative Gini importance attributions.
- **Persistent Prediction Audit:** Automatically logs predictions, raw model targets, currency, timestamps, and input vectors to a local SQLite database (`backend/data/predictions.db`).
- **Dynamic Schema Validation:** Synchronizes frontend range sliders and validation rules with the backend Pydantic schema to block malformed or out-of-range numerical requests.
- **Graceful Error Handling:** If model artifacts are missing or uninitialized, the application renders actionable instructions rather than crashing.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Navy/Teal design system)
- **Charts & Visualizations:** Recharts
- **Iconography:** Lucide React
- **Form Validation:** React Hook Form

### Backend
- **Framework:** FastAPI
- **Data Validation:** Pydantic v2
- **ASGI Server:** Uvicorn
- **Database:** SQLite (built-in Python driver)
- **CORS:** FastAPI CORSMiddleware

### Machine Learning
- **Core Libraries:** Scikit-Learn, Pandas, NumPy, SciPy
- **Algorithms:**
  - Ordinary Least Squares Linear Regression (`LinearRegression`)
  - Random Forest Regressor (`RandomForestRegressor`, $n=150$)
  - Gradient Boosting Regressor (`GradientBoostingRegressor`, $n=150$, Learning Rate = 0.08)
- **Preprocessing:** `ColumnTransformer`, `Pipeline`, `SimpleImputer`, `StandardScaler`
- **Serialization:** Joblib

### Testing
- **Test Framework:** Pytest
- **API Client:** FastAPI TestClient (HTTPX)

---

## 4. Project Directory Structure

```
House price prediction/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application entry point & CORS
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py               # REST API route handlers
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py               # Settings and path resolution
│   │   │   └── database.py             # SQLite prediction persistence
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── model_info.py           # Evaluation, analytics & schema models
│   │   │   └── prediction.py           # Prediction request/response models
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── history_service.py      # Prediction history service
│   │       └── ml_service.py           # Model loader & inference service
│   ├── data/
│   │   ├── housing.csv                 # Authentic 506-row Boston Housing dataset
│   │   ├── boston.csv                  # Alias copy for compatibility
│   │   └── predictions.db              # SQLite prediction history database
│   ├── models/
│   │   ├── best_model.joblib           # Trained production regression pipeline
│   │   ├── gradient_boosting_regressor.joblib
│   │   ├── random_forest_regressor.joblib
│   │   ├── linear_regression.joblib
│   │   ├── feature_schema.json         # Feature bounds & statistical summaries
│   │   └── metadata.json               # Test metrics, actual vs predicted, importances
│   ├── train_model.py                  # Standalone training & serialization pipeline
│   ├── requirements.txt                # Python backend dependencies
│   └── .env.example                    # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActualVsPredictedChart.tsx
│   │   │   ├── FeatureImportanceChart.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ModelComparisonChart.tsx
│   │   │   ├── ModelNotReadyBanner.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PredictionResultModal.tsx
│   │   │   └── ResidualPlot.tsx
│   │   ├── pages/
│   │   │   ├── AboutPage.tsx           # Educational documentation
│   │   │   ├── AnalyticsPage.tsx       # Model diagnostics & benchmarks
│   │   │   ├── Dashboard.tsx           # Primary SaaS KPI overview
│   │   │   └── PredictPage.tsx         # Interactive property valuation form
│   │   ├── services/
│   │   │   └── api.ts                  # Centralized typed API service
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces matching backend
│   │   ├── App.tsx                     # Main layout & tab routing
│   │   ├── index.css                   # Tailwind styles & directives
│   │   ├── main.tsx                    # React DOM root
│   │   └── vite-env.d.ts               # Vite TypeScript environment declarations
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── .env
├── tests/
│   ├── test_api.py                     # API endpoint verification
│   ├── test_dataset.py                 # Dataset integrity & schema bounds
│   └── test_training.py                # Pipeline execution & serialization tests
├── .gitignore
└── README.md
```

---

## 5. Prerequisites

Before running the application, ensure the following are installed:

- **Python:** 3.10, 3.11, 3.12, or 3.13
- **Node.js:** v18.0.0 or newer (LTS recommended)
- **npm:** v9.0.0 or newer
- **Operating System:** Windows, macOS, or Linux

---

## 6. Dataset Setup

The project uses the Boston Housing Price dataset (506 observations, 13 features, 1 target variable `medv`).

The dataset is already included in `backend/data/housing.csv` (and `boston.csv`).

If you ever need to re-download the dataset:
```bash
# Automated download via Python:
python -c "import urllib.request; urllib.request.urlretrieve('https://raw.githubusercontent.com/selva86/datasets/master/BostonHousing.csv', 'backend/data/housing.csv')"
```

Or manually download from Kaggle:
- **URL:** [https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data](https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data)
- Save the CSV as `backend/data/housing.csv`.

### Dataset Columns Description

| Column | Full Description | Unit / Range |
| :--- | :--- | :--- |
| `crim` | Per capita crime rate by town | Rate (0.01 – 88.98) |
| `zn` | Proportion of residential land zoned for lots over 25,000 sq ft | % (0 – 100%) |
| `indus` | Proportion of non-retail business acres per town | % (0.46 – 27.74%) |
| `chas` | Charles River tract indicator | Binary (1 = riverfront, 0 = inland) |
| `nox` | Nitric oxides concentration | Parts per 10 million (0.38 – 0.87) |
| `rm` | Average number of rooms per dwelling | Rooms (3.56 – 8.78) |
| `age` | Proportion of owner-occupied units built prior to 1940 | % (2.9 – 100%) |
| `dis` | Weighted distances to five Boston employment centers | Miles (1.13 – 12.13) |
| `rad` | Index of accessibility to radial highways | Index (1 – 24) |
| `tax` | Full-value property tax rate per $10,000 | $ (187 – 711) |
| `ptratio` | Pupil-teacher ratio by town | Ratio (12.6 – 22.0) |
| `b` | 1000(Bk - 0.63)^2 where Bk is proportion of Black residents | Index (0.32 – 396.9) |
| `lstat` | Percentage of lower status of the population | % (1.73 – 37.97%) |
| **`medv`** | **Median value of owner-occupied homes (Target)** | **$1,000 USD (5.0 – 50.0)** |

---

## 7. Installation & Setup

### A. Backend Installation

1. Navigate to the project root:
   ```bash
   cd "d:/Projects/House price prediction"
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

### B. Frontend Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

---

## 8. Model Training Pipeline

To train the machine learning models, evaluate them on a held-out test split, and generate the model artifacts:

```bash
# From project root:
python backend/train_model.py
```

### What `train_model.py` does:
1. Validates the existence and columns of `backend/data/housing.csv`.
2. Separates input features from target `medv`.
3. Performs an 80/20 train/test split with reproducible seed `42` ($n_{\text{train}}=404, n_{\text{test}}=102$).
4. Fits a `ColumnTransformer` (median imputation + standard scaling) **strictly on training data** to eliminate data leakage.
5. Trains three candidate algorithms:
   - Linear Regression
   - Random Forest Regressor ($n=150$, depth=12)
   - Gradient Boosting Regressor ($n=150$, depth=4, lr=0.08)
6. Evaluates test $R^2$, MAE, and RMSE on the held-out test set.
7. Selects the champion model based on highest test $R^2$.
8. Extracts feature importances and test actual-vs-predicted points.
9. Serializes models into `backend/models/best_model.joblib` and candidate files.
10. Writes `metadata.json` and `feature_schema.json`.

---

## 9. Running the Application

### Step 1: Start the FastAPI Backend

Run the backend on port **8001** (or configure port in `.env`):

```bash
# From project root:
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
```

- API Base URL: `http://127.0.0.1:8001`
- Interactive Swagger UI: `http://127.0.0.1:8001/docs`
- ReDoc Documentation: `http://127.0.0.1:8001/redoc`

### Step 2: Start the React Frontend

In a separate terminal window:

```bash
cd frontend
npm run dev
```

- Web Dashboard URL: `http://localhost:5173`
- The Vite development server automatically proxies `/api` calls to `http://127.0.0.1:8001`.

---

## 10. REST API Documentation

### 1. `GET /api/health`
Checks backend readiness, dataset availability, and model status.

**Response (200 OK):**
```json
{
  "status": "ok",
  "model_loaded": true,
  "dataset_available": true,
  "best_model_name": "Gradient Boosting Regressor",
  "version": "1.0.0",
  "message": "Model service is healthy, trained pipeline and schema are ready."
}
```

### 2. `GET /api/model-info`
Returns model name, target metadata, evaluation metrics, and dynamic feature schema with min/max bounds.

**Response (200 OK):**
```json
{
  "model_name": "Gradient Boosting Regressor",
  "dataset_name": "Boston Housing Dataset (Kaggle/Census)",
  "dataset_size": 506,
  "train_size": 404,
  "test_size": 102,
  "feature_count": 13,
  "evaluation_metrics": {
    "r2_score": 0.914,
    "mae": 1.911,
    "rmse": 2.5107,
    "mae_dollars": 1911.0,
    "rmse_dollars": 2510.7
  },
  "feature_schema": { ... }
}
```

### 3. `POST /api/predict`
Validates inputs and predicts the estimated house price.

**Request Body:**
```json
{
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
```

**Response (200 OK):**
```json
{
  "predicted_price": 27638.51,
  "predicted_value_raw": 27.64,
  "currency": "USD",
  "target_unit": "$1,000 USD",
  "model_name": "Gradient Boosting Regressor",
  "prediction_timestamp": "2026-10-30T02:36:55.901225+00:00",
  "disclaimer": "This prediction is an educational machine learning estimate based on the historical Boston Housing benchmark. It is not an official appraisal or guaranteed market selling price.",
  "top_feature_factors": [
    {
      "feature": "rm",
      "label": "Average Rooms Per Dwelling",
      "input_value": 6.575,
      "importance_pct": 44.01,
      "impact_direction": "increases_value"
    },
    {
      "feature": "lstat",
      "label": "Lower Status Population",
      "input_value": 4.98,
      "importance_pct": 36.35,
      "impact_direction": "increases_value"
    }
  ],
  "price_bracket": "Mid-Market / Suburb Standard"
}
```

### 4. `GET /api/analytics`
Returns comparison metrics across all models, feature importance rankings, and actual vs. predicted test scatter points.

### 5. `GET /api/predictions?limit=10`
Retrieves recent prediction history recorded in the SQLite database.

### 6. `POST /api/retrain`
Development-only endpoint that triggers the model training pipeline and reloads models in memory.

---

## 11. Model Performance & Evaluation

All metrics are computed on the held-out test split ($n=102, 20\%$) using reproducible seed `42`:

| Model | Test $R^2$ Score | Test MAE ($k) | Test RMSE ($k) | Typical Error ($USD) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting Regressor** | **91.40%** | **$1.911k** | **$2.511k** | **~$1,911** | **Champion (Active)** |
| **Random Forest Regressor** | 88.18% | $2.033k | $2.944k | ~$2,033 | Candidate |
| **Linear Regression (OLS)** | 66.88% | $3.189k | $4.929k | ~$3,189 | Baseline |

### Key Feature Attribution Breakdown
1. **RM (Average Rooms Per Dwelling):** `44.01%` weight — Primary positive driver of house valuation.
2. **LSTAT (% Lower Socioeconomic Status):** `36.35%` weight — Strongest inverse correlation with median value.
3. **DIS (Distance to Employment Centers):** `7.36%` weight — Suburban accessibility gradient.
4. **CRIM (Per Capita Crime Rate):** `2.94%` weight — Safety penalty.
5. **PTRATIO (Pupil-Teacher Ratio):** `1.90%` weight — School district amenity.

---

## 12. Testing & Quality Assurance

The codebase includes automated unit and integration tests covering dataset validation, ML training, serialization, Pydantic schemas, and API error states.

### Run Backend Tests:
```bash
python -m pytest tests/ -v
```

**Test Suite Coverage (13/13 passing):**
- `test_dataset_exists_and_loads`: Verifies 506 rows loaded.
- `test_dataset_has_expected_columns`: Verifies all 14 columns present.
- `test_target_column_validity`: Validates finite positive target bounds.
- `test_feature_schema_generation`: Checks statistical ranges (min, mean, max).
- `test_train_pipeline_execution`: Validates training pipeline in a clean temp environment and reloads Joblib model.
- `test_model_metrics_are_authentic`: Ensures $R^2 \in (0, 1]$ and $\text{MAE} \le \text{RMSE}$.
- `test_root_endpoint`: Confirms root service discovery.
- `test_health_endpoint`: Confirms `/api/health` reports status `ok`.
- `test_model_info_endpoint`: Confirms schema and evaluation response.
- `test_predict_endpoint_valid`: Tests valid prediction request.
- `test_predict_endpoint_invalid_bounds`: Validates HTTP 422 on out-of-range inputs.
- `test_analytics_endpoint`: Tests `/api/analytics` data format.
- `test_predictions_history_endpoint`: Tests SQLite audit retrieval.

### Run Frontend Build & Type Check:
```bash
cd frontend
npm run build
```
Executes TypeScript type checking (`tsc`) followed by Vite production bundling with 0 errors.

---

## 13. Ethical Considerations & Limitations

The Boston Housing dataset is an established academic benchmark, but has documented historical limitations:

1. **Historical Currency & Deflation:** Data reflects 1970s price levels ($24.0k = $24,000 USD). It does not reflect modern real estate inflation.
2. **Geographical Limitation:** The model was trained strictly on Greater Boston census tracts; it does not represent modern nationwide housing markets.
3. **Fairness Concerns Regarding Variable B:** The feature `B` incorporates racial proportion formulas ($1000(B_k - 0.63)^2$) reflective of 1970s segregation patterns. In contemporary ethical ML and algorithmic lending, demographic attributes should not be utilized in property appraisals.
4. **Educational Disclaimer:** This system is an educational machine learning demonstration. It must never be used as a binding appraisal or financial advice.

---

## 14. Troubleshooting Guide

### Port 8000 Conflict: `[Errno 10048] address already in use`
- By default, some machines have background servers (like Django or IIS) running on port 8000.
- HousePrice AI is configured to use port **8001** to avoid port collisions.
- If you need a different port, set `PORT=8005` in `backend/.env` and `VITE_API_BASE_URL=http://127.0.0.1:8005` in `frontend/.env`.

### Model Not Loaded Banner in Frontend
- If you see "Machine Learning Model Artifacts Required", run:
  ```bash
  python backend/train_model.py
  ```
  This generates `backend/models/best_model.joblib` and `backend/models/metadata.json`.

### Cannot execute `npm` on Windows
- If `npm` is not in your current command prompt session:
  ```powershell
  $env:PATH = "C:\Program Files\nodejs;$env:PATH"
  ```
  Then run `npm run dev`.

---

## 15. License & Credits

- **Author:** HousePrice AI Team
- **Dataset:** Boston Housing Dataset ([Kaggle](https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data))
- **Built with:** Scikit-Learn, FastAPI, React, Vite, and Tailwind CSS.
