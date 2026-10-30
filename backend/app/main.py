"""
HousePrice AI - FastAPI Application Entry Point.
"""

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.services.ml_service import ml_service
from backend.app.api.routes import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
)
logger = logging.getLogger("HousePriceAI.App")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for application startup and shutdown."""
    logger.info("Initializing HousePrice AI Backend...")
    # Initialize SQLite database
    init_db()
    # Preload machine learning models
    loaded = ml_service.load_artifacts()
    if loaded:
        logger.info(f"Primary model '{ml_service.metadata.get('best_model_name')}' loaded successfully.")
    else:
        logger.warning("ML artifacts not yet ready. Training can be executed using train_model.py.")
    yield
    logger.info("Shutting down HousePrice AI Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Machine Learning REST API for House Price Prediction and Valuation Analytics.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Root"])
def root_status():
    """Service landing endpoint with API metadata and status overview."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_endpoints": {
            "health": f"{settings.API_PREFIX}/health",
            "model_info": f"{settings.API_PREFIX}/model-info",
            "predict": f"{settings.API_PREFIX}/predict",
            "analytics": f"{settings.API_PREFIX}/analytics",
            "predictions": f"{settings.API_PREFIX}/predictions"
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred.",
            "error_message": str(exc),
            "path": request.url.path
        }
    )


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=port, reload=True)
