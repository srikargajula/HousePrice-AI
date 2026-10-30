/**
 * HousePrice AI - TypeScript Interfaces matching FastAPI backend schemas
 */

export interface FeatureFieldSchema {
  name: string;
  label: string;
  description: string;
  unit: string;
  step: number;
  category: string;
  type: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  std: number;
  default: number;
  required: boolean;
}

export interface EvaluationMetrics {
  r2_score: number;
  mae: number;
  rmse: number;
  mae_dollars?: number;
  rmse_dollars?: number;
}

export interface ModelEvaluationDetail {
  name: string;
  test_metrics: EvaluationMetrics;
  train_metrics?: Record<string, number>;
}

export interface FeatureImportanceItem {
  feature: string;
  label: string;
  importance: number;
  importance_pct: number;
}

export interface ActualVsPredictedPoint {
  id: number;
  actual: number;
  predicted: number;
  actual_dollars: number;
  predicted_dollars: number;
  residual: number;
  abs_error: number;
}

export interface HealthResponse {
  status: 'ok' | 'warning' | 'error';
  model_loaded: boolean;
  dataset_available: boolean;
  best_model_name: string | null;
  version: string;
  message: string;
}

export interface ModelInfoResponse {
  model_name: string;
  dataset_name: string;
  dataset_source: string;
  dataset_size: number;
  train_size: number;
  test_size: number;
  feature_count: number;
  features: string[];
  target_info: {
    name: string;
    label: string;
    unit: string;
    description: string;
    multiplier: number;
    currency: string;
  };
  evaluation_metrics: EvaluationMetrics;
  feature_schema: Record<string, FeatureFieldSchema>;
  ethical_disclaimer: string;
}

export interface FeatureContribution {
  feature: string;
  label: string;
  input_value: number;
  importance_pct: number;
  impact_direction: 'increases_value' | 'decreases_value' | 'neutral';
}

export interface PredictionRequest {
  crim: number;
  zn: number;
  indus: number;
  chas: number;
  nox: number;
  rm: number;
  age: number;
  dis: number;
  rad: number;
  tax: number;
  ptratio: number;
  b: number;
  lstat: number;
  selected_model?: string;
}

export interface PredictionResponse {
  predicted_price: number;
  predicted_value_raw: number;
  currency: string;
  target_unit: string;
  model_name: string;
  prediction_timestamp: string;
  disclaimer: string;
  input_summary: Record<string, number>;
  top_feature_factors: FeatureContribution[];
  price_bracket: string;
}

export interface PredictionHistoryItem {
  id: number;
  predicted_price: number;
  raw_predicted_value: number;
  currency: string;
  model_name: string;
  input_features: Record<string, number>;
  created_at: string;
}

export interface PredictionHistoryResponse {
  total_count: number;
  predictions: PredictionHistoryItem[];
}

export interface AnalyticsResponse {
  best_model_name: string;
  models_comparison: Record<string, ModelEvaluationDetail>;
  feature_importances: FeatureImportanceItem[];
  test_actual_vs_predicted: ActualVsPredictedPoint[];
  training_config: Record<string, any>;
  dataset_stats: {
    dataset_size: number;
    train_size: number;
    test_size: number;
  };
}
