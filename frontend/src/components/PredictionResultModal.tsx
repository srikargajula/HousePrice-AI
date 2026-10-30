import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { PredictionResponse, FeatureFieldSchema } from '../types';

interface PredictionResultModalProps {
  result: PredictionResponse;
  featureSchema: Record<string, FeatureFieldSchema> | null;
  onReset: () => void;
  onGoToAnalytics: () => void;
}

export const PredictionResultModal: React.FC<PredictionResultModalProps> = ({
  result,
  featureSchema,
  onReset,
  onGoToAnalytics,
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: result.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(result.predicted_price);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden transition-all animate-fadeIn">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-navy-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Machine Learning Valuation Output</span>
            </div>
            <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-white">
              {formattedPrice}
            </div>
            <div className="mt-1 flex items-center space-x-3 text-xs text-blue-200 font-medium">
              <span>Raw Model Target: ${result.predicted_value_raw}k</span>
              <span>&bull;</span>
              <span className="bg-blue-600/60 px-2 py-0.5 rounded text-white font-semibold">
                {result.price_bracket}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs text-blue-100 space-y-1">
            <div className="font-semibold text-white">Model Utilized:</div>
            <div className="text-teal-300 font-bold">{result.model_name}</div>
            <div className="flex items-center space-x-1 text-[11px] text-blue-200 pt-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(result.prediction_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Top Influencing Features */}
        {result.top_feature_factors && result.top_feature_factors.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Key Feature Influences on This Valuation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.top_feature_factors.map((factor) => {
                const isPositive = factor.impact_direction === 'increases_value';
                const isNeutral = factor.impact_direction === 'neutral';
                return (
                  <div
                    key={factor.feature}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{factor.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        Input Value: <span className="font-bold text-slate-900">{factor.input_value}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Global Model Weight: {factor.importance_pct}%
                      </div>
                    </div>

                    <div className="mt-0.5">
                      {isPositive ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span>Appreciates</span>
                        </span>
                      ) : isNeutral ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <span>Neutral</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                          <span>Depreciates</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Parameters Recap */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Input Property Characteristics
          </h4>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              {Object.entries(result.input_summary).map(([key, value]) => {
                const schema = featureSchema ? featureSchema[key] : null;
                return (
                  <div key={key} className="border-b border-slate-200/50 pb-2">
                    <span className="text-slate-500 block truncate" title={schema?.label || key}>
                      {schema?.label || key.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {value} {schema?.unit && schema.unit !== 'numeric' && schema.unit !== 'binary' ? schema.unit : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strict Real Estate Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-800">Educational Model Disclaimer: </span>
            {result.disclaimer} This machine learning algorithm is designed for educational experimentation.
            Do not treat this estimate as an official appraisal or guaranteed market transaction price.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Prediction</span>
          </button>

          <button
            onClick={onGoToAnalytics}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <span>View Full Model Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
