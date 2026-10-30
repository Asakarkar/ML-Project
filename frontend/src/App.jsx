import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Results from './pages/Results';
import About from './pages/About';
import { checkBackendHealth, submitEcgAnalysis, predictFeatures } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    modelAvailable: false,
    checked: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const health = await checkBackendHealth();
      setBackendStatus({
        online: health.online,
        modelAvailable: health.modelAvailable,
        checked: true,
      });
    } catch {
      setBackendStatus({
        online: false,
        modelAvailable: false,
        checked: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const handleRunPrediction = async (dataPayload) => {
    if (!backendStatus.modelAvailable) {
      alert(
        'Prediction is disabled: The backend reports that no trained model artifact is available yet.'
      );
      return;
    }

    setIsPredicting(true);
    setPredictError(null);

    try {
      let res;
      if (dataPayload instanceof File) {
        res = await submitEcgAnalysis(dataPayload);
      } else if (Array.isArray(dataPayload)) {
        res = await predictFeatures(dataPayload);
      } else {
        res = await predictFeatures(Object.values(dataPayload));
      }
      setPredictionResult(res);
      setActiveTab('results');
    } catch (err) {
      setPredictError(err.message || 'Prediction failed');
      alert(`Inference failed: ${err.message}`);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#faf7f2] product-bg-ambient flex flex-row font-sans text-[#1c1917] antialiased relative">
      {/* Subtle Background Drifting ECG Silhouette Wave */}
      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden opacity-[0.035] h-32 flex items-end">
        <div className="flex shrink-0 animate-drift-wave w-[200%]">
          {[...Array(8)].map((_, i) => (
            <svg
              key={i}
              className="w-1/4 h-24 text-[#8c3b2d]"
              viewBox="0 0 600 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M0,60 L70,60 L80,50 L90,60 L140,60 L150,75 L160,10 L175,110 L185,60 L220,60 L240,40 L260,60 L360,60 L370,50 L380,60 L430,60 L440,75 L450,10 L465,110 L475,60 L510,60 L530,40 L550,60 L600,60" />
            </svg>
          ))}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onRefreshStatus={fetchHealth}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header activeTab={activeTab} backendStatus={backendStatus} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              backendStatus={backendStatus}
              onRunPrediction={handleRunPrediction}
            />
          )}

          {activeTab === 'predict' && (
            <Predict
              backendStatus={backendStatus}
              onRunPrediction={handleRunPrediction}
              isPredicting={isPredicting}
            />
          )}

          {activeTab === 'results' && (
            <Results
              result={predictionResult}
              backendStatus={backendStatus}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'about' && (
            <About backendStatus={backendStatus} />
          )}
        </main>

        {/* Global Minimal Footer */}
        <footer className="shrink-0 border-t border-[#e8e2d4] bg-[#fcfaf6] px-8 py-2.5 text-xs text-[#8c857b] font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UCI Arrhythmia Classification System • Educational Prototype</span>
          <span>452 Samples • 278 Features (PCA: 122) • 16 Classes • Linear SVC & Kernel SVC PCA: 80.22%</span>
        </footer>
      </div>
    </div>
  );
}
