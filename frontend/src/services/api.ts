/**
 * Centralized API service for communicating with the HousePrice AI FastAPI backend.
 */

import {
  HealthResponse,
  ModelInfoResponse,
  PredictionRequest,
  PredictionResponse,
  PredictionHistoryResponse,
  AnalyticsResponse,
} from '../types';

// Read API base URL from Vite environment or default to local FastAPI server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // Ignore JSON parse error on non-json error responses
    }
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  /**
   * Check backend health and model readiness
   */
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      headers: { 'Accept': 'application/json' },
    });
    return handleResponse<HealthResponse>(res);
  },

  /**
   * Fetch current model details, feature schema, and test evaluation metrics
   */
  async getModelInfo(): Promise<ModelInfoResponse> {
    const res = await fetch(`${API_BASE_URL}/api/model-info`, {
      headers: { 'Accept': 'application/json' },
    });
    return handleResponse<ModelInfoResponse>(res);
  },

  /**
   * Run inference to predict house price
   */
  async predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<PredictionResponse>(res);
  },

  /**
   * Fetch analytics data comparing candidate models and test evaluation plots
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analytics`, {
      headers: { 'Accept': 'application/json' },
    });
    return handleResponse<AnalyticsResponse>(res);
  },

  /**
   * Retrieve recent prediction history from SQLite
   */
  async getPredictions(limit = 10): Promise<PredictionHistoryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/predictions?limit=${limit}`, {
      headers: { 'Accept': 'application/json' },
    });
    return handleResponse<PredictionHistoryResponse>(res);
  },

  /**
   * Retrain model via dev endpoint
   */
  async retrainModel(): Promise<{ status: string; message: string; best_model: string }> {
    const res = await fetch(`${API_BASE_URL}/api/retrain`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
    });
    return handleResponse(res);
  },
};
