import React from 'react';
import {
  BookOpen,
  Target,
  Database,
  Cpu,
  ShieldAlert,
  GitBranch,
  Layers,
  Award,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic &amp; Technical Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          About HousePrice AI Project
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Comprehensive project overview covering econometric problem formulation, algorithmic architecture,
          preprocessing pipelines, model diagnostics, and ethical considerations.
        </p>
      </div>

      {/* 1. Problem Statement & Project Objectives */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>1. Problem Statement &amp; Objectives</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Real estate property valuation is intrinsically non-linear, governed by complex interplay between
          architectural dimensions (e.g. rooms per dwelling), municipal infrastructure (e.g. tax rates, pupil-teacher ratios),
          and environmental accessibility (e.g. proximity to employment centers and radial transit).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1">Primary Objective</h3>
            <p className="text-xs text-slate-600">
              Build a reliable, production-ready supervised machine learning regression pipeline capable of predicting
              residential selling prices while providing transparent feature attribution and empirical diagnostic plots.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1">Target Audience</h3>
            <p className="text-xs text-slate-600">
              Students, academic evaluators, real estate analytics learners, and engineers studying modern machine learning
              lifecycle architectures.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Dataset Integration & Kaggle Source */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <Database className="w-5 h-5 text-teal-600" />
          <span>2. Dataset Source &amp; Feature Schema</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The pipeline utilizes the standard Boston Housing Price dataset, hosted on Kaggle and originally collected by the
          U.S. Census Bureau. It contains 506 tract observations with 13 independent input features and 1 continuous target variable (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-blue-700">medv</code>).
        </p>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Feature</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Benchmark Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
              <tr><td className="py-2 px-3 font-bold text-slate-900">CRIM</td><td className="font-sans">Per capita crime rate by town</td><td>Float</td><td>0.01 – 88.98</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">ZN</td><td className="font-sans">Residential land zoned for lots &gt;25,000 sq ft (%)</td><td>Float</td><td>0.00 – 100.00%</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">INDUS</td><td className="font-sans">Non-retail commercial business acres (%)</td><td>Float</td><td>0.46 – 27.74%</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">CHAS</td><td className="font-sans">Charles River dummy variable (1 if tract bounds river, 0 otherwise)</td><td>Binary</td><td>0 or 1</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">NOX</td><td className="font-sans">Nitric oxides concentration (parts per 10 million)</td><td>Float</td><td>0.38 – 0.87 pphm</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">RM</td><td className="font-sans">Average number of rooms per dwelling</td><td>Float</td><td>3.56 – 8.78 rooms</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">AGE</td><td className="font-sans">Proportion of owner units built prior to 1940 (%)</td><td>Float</td><td>2.90 – 100.00%</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">DIS</td><td className="font-sans">Weighted distance to five employment centers</td><td>Float</td><td>1.13 – 12.13 miles</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">RAD</td><td className="font-sans">Index of accessibility to radial highways</td><td>Integer</td><td>1 – 24 index</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">TAX</td><td className="font-sans">Full-value property-tax rate per $10,000</td><td>Float</td><td>$187 – $711</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">PTRATIO</td><td className="font-sans">Pupil-teacher ratio by town</td><td>Float</td><td>12.60 – 22.00</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">B</td><td className="font-sans">Historical demographic index 1000(Bk - 0.63)^2</td><td>Float</td><td>0.32 – 396.90</td></tr>
              <tr><td className="py-2 px-3 font-bold text-slate-900">LSTAT</td><td className="font-sans">Percentage of lower status population (%)</td><td>Float</td><td>1.73 – 37.97%</td></tr>
              <tr className="bg-blue-50/50 font-bold text-blue-900"><td className="py-2 px-3">MEDV (Target)</td><td className="font-sans">Median value of owner-occupied homes ($1000s)</td><td>Continuous</td><td>$5.0k – $50.0k</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Machine Learning Algorithms Explained */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <span>3. Regression Algorithms Compared</span>
        </h2>
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-1">1. Ordinary Least Squares (Linear Regression)</h3>
            <p>
              Linear regression models the relationship between target price and features using a linear combination:
              <br />
              <code className="inline-block mt-1 bg-white p-1.5 rounded border border-slate-200 font-mono text-slate-800">
                y = &beta;₀ + &beta;₁·X₁ + &beta;₂·X₂ + ... + &beta;ₙ·Xₙ + &epsilon;
              </code>
              <br />
              Serves as an interpretable baseline, capturing global monotonic linear trends (Achieving ~66.9% R²).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-1">2. Random Forest Regressor</h3>
            <p>
              An ensemble bagging technique that fits 150 independent decision trees on bootstrap subsets of the training set.
              Averages predictions across trees, drastically reducing prediction variance and naturally capturing non-linear interactions without overfitting (Achieving ~88.2% R²).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-1">3. Gradient Boosting Regressor (Champion)</h3>
            <p>
              A sequential boosting algorithm that trains shallow regression trees iteratively. Each new tree corrects the pseudo-residuals (gradient of squared loss) of preceding trees:
              <br />
              <code className="inline-block mt-1 bg-white p-1.5 rounded border border-slate-200 font-mono text-slate-800">
                F_m(x) = F_(m-1)(x) + &gamma;_m · h_m(x)
              </code>
              <br />
              Achieved the highest held-out test score (<span className="font-bold text-emerald-700">R² = 91.4%</span>, <span className="font-bold text-blue-700">MAE = $1.91k</span>), accurately modeling non-linear inflection points in room counts and demographic factors.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Mathematical Evaluation Metrics */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>4. Evaluation Metrics Formulation</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">R² (Coefficient of Determination)</h3>
            <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-center">
              R² = 1 - (&sum;(y - ŷ)² / &sum;(y - ȳ)²)
            </div>
            <p className="text-slate-600">
              Measures the proportion of variance in house prices explained by the features. 1.0 represents a perfect fit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Mean Absolute Error (MAE)</h3>
            <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-center">
              MAE = (1/n) &sum; |yᵢ - ŷᵢ|
            </div>
            <p className="text-slate-600">
              Direct linear average magnitude of errors in thousands of dollars. Less sensitive to outliers than RMSE.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Root Mean Squared Error (RMSE)</h3>
            <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-center">
              RMSE = &radic;[ (1/n) &sum; (yᵢ - ŷᵢ)² ]
            </div>
            <p className="text-slate-600">
              Squares errors before averaging, heavily penalizing large deviations. Crucial for detecting extreme mispredictions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Dataset Limitations & Ethical Considerations */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="text-lg font-bold text-amber-950 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>5. Ethical Considerations &amp; Dataset Limitations</span>
        </h2>
        <p className="text-xs text-amber-900 leading-relaxed">
          The Boston Housing dataset is an established pedagogical benchmark in data science history. However, it carries significant limitations that must be transparently addressed:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-800 pl-1">
          <li>
            <span className="font-bold">Historical Era: </span>
            Data was collected in 1970–1978. Price levels reflect 1970s dollars ($24.0k = $24,000 USD) and do not represent modern inflationary real estate values.
          </li>
          <li>
            <span className="font-bold">Geographic Isolation: </span>
            Covers only tracts within the Greater Boston metropolitan area and cannot generalize to other cities or regions.
          </li>
          <li>
            <span className="font-bold">Fairness &amp; Demographic Variables: </span>
            The feature <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">B</code> incorporates racial proportion formulas (<code className="font-mono">1000*(Bk - 0.63)^2</code>) reflecting historical segregation patterns. Modern ethical ML standards rightly discourage using demographic identity in algorithmic lending or property appraisal.
          </li>
          <li>
            <span className="font-bold">Educational Purpose: </span>
            This application is constructed for demonstrating supervised regression architecture and must not be used for actual real estate appraisals.
          </li>
        </ul>
      </section>

      {/* 6. Future Scope */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <span>6. Future Improvements &amp; Technical Roadmap</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">&bull; Modern MLS / Open-Source Real Estate API</h3>
            <p>Integrate modern Zillow / Redfin / Kaggle California or Ames housing datasets to reflect contemporary market prices.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">&bull; Tree SHAP (SHapley Additive exPlanations)</h3>
            <p>Compute exact game-theoretic SHAP force plots for individual house predictions to explain each feature's contribution.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">&bull; Geospatial Map Visualization</h3>
            <p>Embed interactive Leaflet / Mapbox layers to visualize housing tract clusters by predicted median price.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">&bull; Neural Network &amp; CatBoost Integration</h3>
            <p>Add deep tabular neural networks (TabNet) and CatBoost to provide wider model benchmarking.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
