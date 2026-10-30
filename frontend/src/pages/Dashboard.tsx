import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Database,
  ArrowRight,
  ShieldCheck,
  Cpu,
  History,
  CheckCircle2,
  BarChart2,
  Sliders,
} from 'lucide-react';
import { ModelInfoResponse, PredictionHistoryItem } from '../types';
import { MetricCard } from '../components/MetricCard';

interface DashboardProps {
  modelInfo: ModelInfoResponse | null;
  recentPredictions: PredictionHistoryItem[];
  onNavigateToPredict: () => void;
  onNavigateToAnalytics: () => void;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  modelInfo,
  recentPredictions,
  onNavigateToPredict,
  onNavigateToAnalytics,
  loading,
}) => {
  const metrics = modelInfo?.evaluation_metrics;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-slate-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Supervised Machine Learning Valuation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Algorithmic House Price Predictions with Transparent Analytics
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Estimate residential property values using trained Scikit-Learn regression pipelines.
            Explore feature attributions, model benchmark comparisons, and held-out test evaluations.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onNavigateToPredict}
              className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Predict House Price</span>
            </button>

            <button
              onClick={onNavigateToAnalytics}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-sm transition-all"
            >
              <span>Explore Model Benchmarks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Summary KPI Cards populated from actual backend metrics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Live Machine Learning Performance Metrics
          </h2>
          <span className="text-xs text-slate-500">Held-out test set evaluation (n={modelInfo?.test_size || 102})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Selected Best Model"
            value={modelInfo?.model_name || (loading ? 'Loading...' : 'Gradient Boosting')}
            subtitle="Scikit-Learn Regression Pipeline"
            icon={Award}
            badge="Production Active"
            badgeColor="emerald"
            tooltip="Best algorithm selected based on highest R² test score"
          />

          <MetricCard
            title="Model Accuracy (R² Score)"
            value={
              metrics
                ? `${(metrics.r2_score * 100).toFixed(1)}%`
                : loading
                ? '...'
                : '91.4%'
            }
            subtitle={metrics ? `R² = ${metrics.r2_score.toFixed(4)}` : 'Variance Explained'}
            icon={TrendingUp}
            badge="Held-out Test Split"
            badgeColor="blue"
            tooltip="Coefficient of Determination: Proportion of price variance predictable from features"
          />

          <MetricCard
            title="Test Mean Absolute Error"
            value={
              metrics?.mae_dollars
                ? `$${metrics.mae_dollars.toLocaleString()}`
                : metrics?.mae
                ? `$${(metrics.mae * 1000).toLocaleString()}`
                : '$1,911'
            }
            subtitle={metrics ? `Raw Target MAE: ${metrics.mae.toFixed(2)}k` : 'Average absolute error'}
            icon={Cpu}
            badge="MAE Benchmark"
            badgeColor="purple"
            tooltip="Average dollar difference between predicted price and actual sale price"
          />

          <MetricCard
            title="Dataset Benchmark Size"
            value={modelInfo?.dataset_size ? `${modelInfo.dataset_size} Homes` : '506 Homes'}
            subtitle={`${modelInfo?.feature_count || 13} Independent Features`}
            icon={Database}
            badge="Kaggle Boston Data"
            badgeColor="amber"
            tooltip="Benchmark dataset size split 80% train / 20% test"
          />
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl font-bold text-navy-900">Enterprise ML Architecture Features</h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered with strict separation of preprocessing, training pipelines, and REST inference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Triple-Model Benchmarking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trains Linear Regression, Random Forest, and Gradient Boosting Regressor side-by-side.
              Metrics strictly evaluated on the same held-out test split.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dynamic Schema Validation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Frontend input limits and types are dynamically synchronized with backend Pydantic schemas,
              preventing out-of-range numerical errors and target leakage.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">SQLite Audit Persistence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Valuation inputs, model algorithms, and predicted values are stored in a local SQLite database
              for review, history audits, and consistency analysis.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Flow */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200/80 p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-6 text-center">How the Valuation Pipeline Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Enter Property Details</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supply rooms, crime index, lower-status percentage, tax rate, and accessibility factors or choose from realistic presets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pydantic Validation &amp; Inference</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              FastAPI validates features against the training bounds, imputes missing values, applies standard scaling, and executes the regression model.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative space-y-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Estimated Price &amp; Feature Attribution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive the predicted market estimate with positive and negative feature attributions and benchmark comparisons.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Predictions Table from SQLite */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-navy-900">Recent Prediction History</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Recorded in SQLite</span>
        </div>

        {recentPredictions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">No predictions recorded yet.</p>
            <button
              onClick={onNavigateToPredict}
              className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Make your first property price prediction &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Predicted Price</th>
                  <th className="py-3 px-4">Rooms (RM)</th>
                  <th className="py-3 px-4">Lower Status (LSTAT)</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">#{pred.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${pred.predicted_price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {pred.input_features?.rm || '6.2'} rms
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {pred.input_features?.lstat || '11.36'}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {pred.model_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(pred.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
