import React from 'react';
import { AlertCircle, Terminal, RefreshCw } from 'lucide-react';

interface ModelNotReadyBannerProps {
  onRefresh: () => void;
  message?: string;
}

export const ModelNotReadyBanner: React.FC<ModelNotReadyBannerProps> = ({ onRefresh, message }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 mb-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Machine Learning Model Artifacts Required</h3>
            <p className="text-xs text-amber-700 mt-1 max-w-2xl leading-relaxed">
              {message ||
                'The backend API is running, but the machine learning pipeline has not been trained or serialized yet. Run the training script below to train the models and generate metadata.'}
            </p>

            <div className="mt-3 bg-amber-950/90 text-amber-100 rounded-lg p-3 font-mono text-xs overflow-x-auto max-w-xl flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>python backend/train_model.py</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Check Status</span>
        </button>
      </div>
    </div>
  );
};
