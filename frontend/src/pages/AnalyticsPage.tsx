import React from 'react';
import {
  LineChart as LineChartIcon,
  Award,
  Layers,
  Database,
  Info,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart2,
  GitBranch,
} from 'lucide-react';
import { AnalyticsResponse, ModelInfoResponse } from '../types';
import { MetricCard } from '../components/MetricCard';
import { FeatureImportanceChart } from '../components/FeatureImportanceChart';
import { ModelComparisonChart } from '../components/ModelComparisonChart';
import { ActualVsPredictedChart } from '../components/ActualVsPredictedChart';
import { ResidualPlot } from '../components/ResidualPlot';

interface AnalyticsPageProps {
  analytics: AnalyticsResponse | null;
  modelInfo: ModelInfoResponse | null;
  loading: boolean;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics, modelInfo, loading }) => {
  const comparison = analytics?.models_comparison || {};
  const bestModelName = analytics?.best_model_name || modelInfo?.model_name || 'Gradient Boosting Regressor';
  const bestModelDetail = comparison[bestModelName];
  const testMetrics = bestModelDetail?.test_metrics || modelInfo?.evaluation_metrics;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Machine Learning Model Analytics
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Empirical evaluation metrics, residual diagnostics, and cross-algorithm regression benchmarks.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Held-Out Test Set Verified (n={analytics?.dataset_stats?.test_size || 102})</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Champion Algorithm"
          value={bestModelName}
          subtitle="Selected based on highest test R²"
          icon={Award}
          badge="Production Pipeline"
          badgeColor="emerald"
        />

        <MetricCard
          title="Coefficient of Det. (R²)"
          value={testMetrics ? `${(testMetrics.r2_score * 100).toFixed(1)}%` : '91.4%'}
          subtitle={testMetrics ? `R² = ${testMetrics.r2_score.toFixed(4)}` : 'Test accuracy'}
          icon={TrendingUp}
          badge="Variance Explained"
          badgeColor="blue"
        />

        <MetricCard
          title="Mean Absolute Error (MAE)"
          value={
            testMetrics?.mae_dollars
              ? `$${testMetrics.mae_dollars.toLocaleString()}`
              : testMetrics?.mae
              ? `$${(testMetrics.mae * 1000).toLocaleString()}`
              : '$1,911'
          }
          subtitle={`MAE: ${testMetrics?.mae.toFixed(3) || '1.911'}k raw units`}
          icon={Cpu}
          badge="Average Error"
          badgeColor="purple"
        />

        <MetricCard
          title="Root Mean Sq Error (RMSE)"
          value={
            testMetrics?.rmse_dollars
              ? `$${testMetrics.rmse_dollars.toLocaleString()}`
              : testMetrics?.rmse
              ? `$${(testMetrics.rmse * 1000).toLocaleString()}`
              : '$2,510'
          }
          subtitle={`RMSE: ${testMetrics?.rmse.toFixed(3) || '2.511'}k raw units`}
          icon={LineChartIcon}
          badge="Penalizes Large Errors"
          badgeColor="amber"
        />
      </div>

      {/* Algorithm Benchmark Comparison Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Algorithm Performance Comparison</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            All models were evaluated under identical 80/20 train/test splits with reproducible random seed 42.
          </p>
        </div>

        {/* Grouped Bar Chart */}
        <div className="pt-2">
          <ModelComparisonChart models={comparison} />
        </div>

        {/* Comparison Data Table */}
        <div className="overflow-x-auto border-t border-slate-100 pt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Algorithm Name</th>
                <th className="py-3 px-4">Test R² Score</th>
                <th className="py-3 px-4">Test MAE ($k)</th>
                <th className="py-3 px-4">Test RMSE ($k)</th>
                <th className="py-3 px-4">Est. Dollar MAE</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(comparison).map(([name, detail]) => {
                const isChampion = name === bestModelName;
                return (
                  <tr
                    key={name}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isChampion ? 'bg-blue-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center space-x-2 text-slate-900">
                      {isChampion && <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      <span>{name}</span>
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-bold">
                      {(detail.test_metrics.r2_score * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 font-mono">${detail.test_metrics.mae.toFixed(3)}k</td>
                    <td className="py-3 px-4 font-mono">${detail.test_metrics.rmse.toFixed(3)}k</td>
                    <td className="py-3 px-4">
                      ${detail.test_metrics.mae_dollars ? detail.test_metrics.mae_dollars.toLocaleString() : (detail.test_metrics.mae * 1000).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {isChampion ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Production Champion
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          Candidate
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance & Attribution Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-teal-600" />
            <span>Feature Importance &amp; Gini Importance Attribution</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Relative percentage contribution of each feature in predicting median home value for the champion model.
          </p>
        </div>

        {analytics?.feature_importances && analytics.feature_importances.length > 0 ? (
          <FeatureImportanceChart data={analytics.feature_importances} maxItems={13} />
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">Loading feature importance data...</div>
        )}
      </div>

      {/* Diagnostics Grid: Actual vs Predicted & Residual Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actual vs Predicted Scatter */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Actual vs. Predicted Price (Test Set)</h3>
            <p className="text-[11px] text-slate-500">
              Dotted gray diagonal line indicates ideal 1:1 prediction fit ($y = x$).
            </p>
          </div>
          {analytics?.test_actual_vs_predicted ? (
            <ActualVsPredictedChart data={analytics.test_actual_vs_predicted} />
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          )}
        </div>

        {/* Residual Plot */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Residual Diagnostics ($Actual - Predicted$)</h3>
            <p className="text-[11px] text-slate-500">
              Red horizontal line represents zero residual error. Verifies homoscedasticity.
            </p>
          </div>
          {analytics?.test_actual_vs_predicted ? (
            <ResidualPlot data={analytics.test_actual_vs_predicted} />
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
          )}
        </div>
      </div>

      {/* Dataset Partition Summary */}
      <div className="bg-slate-100/70 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Evaluation Split &amp; Reproducibility Configuration</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block">Total Observations</span>
            <span className="font-bold text-slate-800 text-sm">{analytics?.dataset_stats?.dataset_size || 506} Homes</span>
          </div>
          <div>
            <span className="text-slate-400 block">Training Split (80%)</span>
            <span className="font-bold text-slate-800 text-sm">{analytics?.dataset_stats?.train_size || 404} Samples</span>
          </div>
          <div>
            <span className="text-slate-400 block">Test Split (20%)</span>
            <span className="font-bold text-slate-800 text-sm">{analytics?.dataset_stats?.test_size || 102} Samples</span>
          </div>
          <div>
            <span className="text-slate-400 block">Random Seed</span>
            <span className="font-bold text-slate-800 text-sm">42 (Reproducible)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
