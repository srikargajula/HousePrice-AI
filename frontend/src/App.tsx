import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ModelNotReadyBanner } from './components/ModelNotReadyBanner';
import { Dashboard } from './pages/Dashboard';
import { PredictPage } from './pages/PredictPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import {
  HealthResponse,
  ModelInfoResponse,
  AnalyticsResponse,
  PredictionHistoryItem,
} from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  const fetchAppData = async () => {
    setLoading(true);
    setBackendError(null);
    try {
      // 1. Fetch Health
      const healthData = await api.getHealth();
      setHealth(healthData);

      // 2. Fetch Model Info if model is ready
      if (healthData.model_loaded) {
        const [infoData, analyticsData, historyData] = await Promise.all([
          api.getModelInfo().catch((err) => {
            console.error('Failed to fetch model info:', err);
            return null;
          }),
          api.getAnalytics().catch((err) => {
            console.error('Failed to fetch analytics:', err);
            return null;
          }),
          api.getPredictions(10).catch((err) => {
            console.error('Failed to fetch predictions history:', err);
            return { total_count: 0, predictions: [] };
          }),
        ]);

        if (infoData) setModelInfo(infoData);
        if (analyticsData) setAnalytics(analyticsData);
        if (historyData) setRecentPredictions(historyData.predictions || []);
      }
    } catch (err: any) {
      console.error('Backend connection failed:', err);
      setBackendError(
        'Could not connect to FastAPI backend at http://127.0.0.1:8000. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handlePredictionSuccess = () => {
    // Refresh predictions history after making a prediction
    api.getPredictions(10).then((res) => {
      if (res && res.predictions) {
        setRecentPredictions(res.predictions);
      }
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Connection Failure or Model Offline Banner */}
        {backendError && (
          <ModelNotReadyBanner
            onRefresh={fetchAppData}
            message={backendError}
          />
        )}

        {!backendError && health && !health.model_loaded && (
          <ModelNotReadyBanner
            onRefresh={fetchAppData}
            message={health.message}
          />
        )}

        {/* Page Switcher */}
        {activeTab === 'dashboard' && (
          <Dashboard
            modelInfo={modelInfo}
            recentPredictions={recentPredictions}
            onNavigateToPredict={() => setActiveTab('predict')}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
            loading={loading}
          />
        )}

        {activeTab === 'predict' && (
          <PredictPage
            modelInfo={modelInfo}
            onPredictionSuccess={handlePredictionSuccess}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            analytics={analytics}
            modelInfo={modelInfo}
            loading={loading}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
