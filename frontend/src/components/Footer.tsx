import React from 'react';
import { Home, ExternalLink, ShieldCheck, Database, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-navy-900 tracking-tight">HousePrice AI</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Supervised Machine Learning web application delivering algorithmic house valuation,
              transparent feature attribution, and empirical regression analytics.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full-Stack ML Architecture with FastAPI &amp; Scikit-Learn</span>
            </div>
          </div>

          {/* Technology Stack Tags */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Python &bull; FastAPI &bull; Pydantic</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Scikit-Learn &bull; Gradient Boosting</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>React &bull; TypeScript &bull; Vite</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Tailwind CSS &bull; Recharts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>SQLite Prediction Store</span>
              </li>
            </ul>
          </div>

          {/* Dataset & Educational Note */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Benchmark Dataset</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              Trained on the Boston Housing benchmark dataset (Kaggle/Census). Intended strictly for educational demonstration.
            </p>
            <a
              href="https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Kaggle Dataset Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HousePrice AI. Designed as a production-grade ML portfolio demonstration.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span>Regression Algorithms: LR, RF, GBR</span>
            <span>&bull;</span>
            <span>Test-Set Verified Metrics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
