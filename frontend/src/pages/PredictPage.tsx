import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Sparkles,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Building,
  MapPin,
  Users,
  GraduationCap,
  Layers,
  Wand2,
} from 'lucide-react';
import {
  ModelInfoResponse,
  PredictionRequest,
  PredictionResponse,
  FeatureFieldSchema,
} from '../types';
import { api } from '../services/api';
import { PredictionResultModal } from '../components/PredictionResultModal';

interface PredictPageProps {
  modelInfo: ModelInfoResponse | null;
  onPredictionSuccess: () => void;
  onGoToAnalytics: () => void;
}

// Sensible property preset configurations for easy user testing
const PRESETS: Record<string, Partial<PredictionRequest>> = {
  suburban_family: {
    rm: 6.575,
    crim: 0.027,
    zn: 18.0,
    indus: 2.31,
    chas: 0,
    nox: 0.538,
    age: 65.2,
    dis: 4.09,
    rad: 1.0,
    tax: 296.0,
    ptratio: 15.3,
    b: 396.9,
    lstat: 4.98,
  },
  waterfront_estate: {
    rm: 7.82,
    crim: 0.015,
    zn: 25.0,
    indus: 1.8,
    chas: 1, // On Charles River
    nox: 0.42,
    age: 32.0,
    dis: 5.4,
    rad: 2.0,
    tax: 240.0,
    ptratio: 13.5,
    b: 395.0,
    lstat: 3.2,
  },
  urban_budget: {
    rm: 5.3,
    crim: 2.45,
    zn: 0.0,
    indus: 18.1,
    chas: 0,
    nox: 0.67,
    age: 95.0,
    dis: 1.9,
    rad: 24.0,
    tax: 666.0,
    ptratio: 20.2,
    b: 380.0,
    lstat: 23.5,
  },
};

export const PredictPage: React.FC<PredictPageProps> = ({
  modelInfo,
  onPredictionSuccess,
  onGoToAnalytics,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('Gradient Boosting Regressor');

  const schema = modelInfo?.feature_schema;

  // Initialize form with defaults from schema or fallback
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PredictionRequest>({
    defaultValues: {
      crim: schema?.crim?.default ?? 0.26,
      zn: schema?.zn?.default ?? 0.0,
      indus: schema?.indus?.default ?? 9.69,
      chas: (schema?.chas?.default as any) ?? 0,
      nox: schema?.nox?.default ?? 0.54,
      rm: schema?.rm?.default ?? 6.21,
      age: schema?.age?.default ?? 77.5,
      dis: schema?.dis?.default ?? 3.21,
      rad: schema?.rad?.default ?? 5.0,
      tax: schema?.tax?.default ?? 330.0,
      ptratio: schema?.ptratio?.default ?? 19.05,
      b: schema?.b?.default ?? 391.44,
      lstat: schema?.lstat?.default ?? 11.36,
    },
  });

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      Object.entries(preset).forEach(([key, val]) => {
        setValue(key as any, val);
      });
      setApiError(null);
    }
  };

  const onSubmit = async (data: PredictionRequest) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const payload: PredictionRequest = {
        ...data,
        crim: Number(data.crim),
        zn: Number(data.zn),
        indus: Number(data.indus),
        chas: Number(data.chas),
        nox: Number(data.nox),
        rm: Number(data.rm),
        age: Number(data.age),
        dis: Number(data.dis),
        rad: Number(data.rad),
        tax: Number(data.tax),
        ptratio: Number(data.ptratio),
        b: Number(data.b),
        lstat: Number(data.lstat),
        selected_model: selectedAlgorithm,
      };

      const result = await api.predictPrice(payload);
      setPredictionResult(result);
      onPredictionSuccess();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setApiError(err.message || 'Prediction failed. Please check inputs and ensure backend is active.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setPredictionResult(null);
    setApiError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Property Valuation Estimator
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Enter structural, geographic, and municipal characteristics to predict the estimated selling price.
        </p>
      </div>

      {/* Show Result if Available */}
      {predictionResult && (
        <PredictionResultModal
          result={predictionResult}
          featureSchema={schema || null}
          onReset={handleReset}
          onGoToAnalytics={onGoToAnalytics}
        />
      )}

      {/* Error alert */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Prediction Error</h4>
            <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Preset Quick Fill Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-blue-600" />
            <span>Quick-Load Sample Properties</span>
          </div>
          <span className="text-xs text-slate-400">Click to autofill form</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('suburban_family')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition-colors"
          >
            🏡 Suburban Family Home (6.6 rms, low crime)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('waterfront_estate')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition-colors"
          >
            🌊 Riverfront Luxury Residence (7.8 rms, waterfront)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('urban_budget')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 border border-slate-200 transition-colors"
          >
            🏢 City Fringe Budget Apartment (5.3 rms, older build)
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Algorithm Override Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Select Machine Learning Algorithm for Inference</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'Gradient Boosting Regressor', label: 'Gradient Boosting (Recommended)', badge: 'Best R²: 0.914' },
              { id: 'Random Forest Regressor', label: 'Random Forest Regressor', badge: 'R²: 0.882' },
              { id: 'Linear Regression', label: 'Linear Regression (OLS)', badge: 'R²: 0.669' },
            ].map((m) => (
              <label
                key={m.id}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedAlgorithm === m.id
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{m.label}</span>
                  <input
                    type="radio"
                    name="algorithm"
                    value={m.id}
                    checked={selectedAlgorithm === m.id}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{m.badge}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Group 1: Structure & Building */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              1. Physical Property Structure
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* RM: Rooms */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Average Rooms Per Dwelling (RM) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Typical: 3.5 - 8.8 rooms</span>
              </div>
              <input
                type="number"
                step="0.05"
                {...register('rm', {
                  required: 'Average number of rooms is required',
                  min: { value: 3.0, message: 'Minimum rooms is 3.0' },
                  max: { value: 10.0, message: 'Maximum rooms is 10.0' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Highest weighted feature (~44% model attribution). Average rooms across the tract.
              </p>
              {errors.rm && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.rm.message}</p>}
            </div>

            {/* AGE: Built Prior to 1940 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Built Prior to 1940 (%) (AGE) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">0% - 100%</span>
              </div>
              <input
                type="number"
                step="1"
                {...register('age', {
                  required: 'Property age proportion is required',
                  min: { value: 0, message: 'Must be >= 0%' },
                  max: { value: 100, message: 'Must be <= 100%' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Percentage of owner-occupied units built prior to 1940.
              </p>
              {errors.age && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.age.message}</p>}
            </div>
          </div>
        </div>

        {/* Form Group 2: Location, Transit & Environment */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              2. Location, Transit &amp; Environment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* DIS: Distance to employment */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Distance to Centers (DIS) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                {...register('dis', {
                  required: 'Distance is required',
                  min: { value: 0.5, message: 'Min 0.5 miles' },
                  max: { value: 15.0, message: 'Max 15.0 miles' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Miles to five employment hubs</span>
              {errors.dis && <p className="text-xs text-rose-600 mt-1">{errors.dis.message}</p>}
            </div>

            {/* RAD: Highway Access */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Highway Access Index (RAD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                {...register('rad', {
                  required: 'RAD is required',
                  min: { value: 1, message: 'Min 1' },
                  max: { value: 30, message: 'Max 30' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Radial highway accessibility (1-24)</span>
              {errors.rad && <p className="text-xs text-rose-600 mt-1">{errors.rad.message}</p>}
            </div>

            {/* NOX: Nitric oxides */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Air Quality / NOX (pphm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('nox', {
                  required: 'NOX is required',
                  min: { value: 0.3, message: 'Min 0.3' },
                  max: { value: 1.0, message: 'Max 1.0' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Nitric oxides concentration (0.38 - 0.87)</span>
              {errors.nox && <p className="text-xs text-rose-600 mt-1">{errors.nox.message}</p>}
            </div>

            {/* CHAS: Charles River Tract */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Charles River Tract (CHAS)
              </label>
              <select
                {...register('chas')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                <option value={0}>0 - Inland Tract</option>
                <option value={1}>1 - Bounds Charles River</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">Tract borders river (amenity bonus)</span>
            </div>
          </div>
        </div>

        {/* Form Group 3: Neighborhood & Socioeconomics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              3. Neighborhood Demographics &amp; Land Zoning
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* LSTAT: Lower Status Pop */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Lower Status Pop (%) (LSTAT) <span className="text-rose-500">*</span>
                </label>
              </div>
              <input
                type="number"
                step="0.1"
                {...register('lstat', {
                  required: 'LSTAT is required',
                  min: { value: 1.0, message: 'Min 1.0%' },
                  max: { value: 45.0, message: 'Max 45.0%' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                2nd highest weighted feature (~36% model attribution). Range 1.7% - 38%.
              </span>
              {errors.lstat && <p className="text-xs text-rose-600 mt-1">{errors.lstat.message}</p>}
            </div>

            {/* CRIM: Crime Rate */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Per Capita Crime Rate (CRIM) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('crim', {
                  required: 'Crime rate is required',
                  min: { value: 0.0, message: 'Must be >= 0.0' },
                  max: { value: 100.0, message: 'Max 100.0' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Crime rate per capita by town</span>
              {errors.crim && <p className="text-xs text-rose-600 mt-1">{errors.crim.message}</p>}
            </div>

            {/* INDUS: Non-Retail Acres */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Non-Retail Acres (%) (INDUS) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                {...register('indus', {
                  required: 'INDUS is required',
                  min: { value: 0.0, message: 'Min 0%' },
                  max: { value: 40.0, message: 'Max 40%' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Proportion of commercial business acres</span>
              {errors.indus && <p className="text-xs text-rose-600 mt-1">{errors.indus.message}</p>}
            </div>

            {/* ZN: Zoned Land > 25k */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Zoned Land &gt; 25k sq ft (%) (ZN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                {...register('zn', {
                  required: 'ZN is required',
                  min: { value: 0.0, message: 'Min 0%' },
                  max: { value: 100.0, message: 'Max 100%' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Large residential zoning proportion</span>
              {errors.zn && <p className="text-xs text-rose-600 mt-1">{errors.zn.message}</p>}
            </div>

            {/* B: Census Metric */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Historical Census Metric (B) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                {...register('b', {
                  required: 'B index is required',
                  min: { value: 0.0, message: 'Min 0' },
                  max: { value: 450.0, message: 'Max 450' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard benchmark census formula 1000(Bk - 0.63)^2. Kept strictly for model compatibility.
              </span>
              {errors.b && <p className="text-xs text-rose-600 mt-1">{errors.b.message}</p>}
            </div>
          </div>
        </div>

        {/* Form Group 4: Taxes & Education */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              4. Property Taxes &amp; School District
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* TAX: Property Tax */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Property Tax Rate per $10k (TAX) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">$187 - $711</span>
              </div>
              <input
                type="number"
                step="5"
                {...register('tax', {
                  required: 'Property tax rate is required',
                  min: { value: 150, message: 'Min $150' },
                  max: { value: 800, message: 'Max $800' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Full-value property-tax rate per $10,000</span>
              {errors.tax && <p className="text-xs text-rose-600 mt-1">{errors.tax.message}</p>}
            </div>

            {/* PTRATIO: Pupil-Teacher Ratio */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Pupil-Teacher Ratio (PTRATIO) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">12.6 - 22.0</span>
              </div>
              <input
                type="number"
                step="0.1"
                {...register('ptratio', {
                  required: 'Pupil-teacher ratio is required',
                  min: { value: 10.0, message: 'Min 10.0' },
                  max: { value: 25.0, message: 'Max 25.0' },
                })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Students per teacher in town school district</span>
              {errors.ptratio && <p className="text-xs text-rose-600 mt-1">{errors.ptratio.message}</p>}
            </div>
          </div>
        </div>

        {/* Buttons / Controls */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Inputs</span>
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 disabled:opacity-60 transition-all active:scale-95"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Machine Learning Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Estimated Price</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
