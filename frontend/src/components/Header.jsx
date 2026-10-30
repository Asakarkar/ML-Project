import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, backendStatus }) {
  const titles = {
    dashboard: {
      title: 'Diagnostic Command Center',
      subtitle: 'Multi-channel ECG analysis, real-time waveform surveillance & pipeline metrics',
    },
    predict: {
      title: 'Patient ECG Ingestion',
      subtitle: 'Input patient lead parameters or upload 279-channel telemetry CSV files',
    },
    results: {
      title: 'Diagnostic Pathology Report',
      subtitle: 'Classification output, probability distribution, and clinical risk analysis',
    },
    about: {
      title: 'About CardioPulse™ & Model Performance',
      subtitle: '12-model comparative benchmarks, 122-D PCA architecture & 16-class taxonomy',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="shrink-0 bg-[#fcfaf6] border-b border-[#e7e1d4] px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10 select-none">
      <div>
        <h2 className="font-mono text-lg font-bold tracking-tight text-[#1c1917]">
          {current.title}
        </h2>
        <p className="text-xs text-[#78716c] font-sans">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-2.5 font-mono text-xs">
        {/* Model Accuracy Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f3ede1] border border-[#ded5c2] text-[#44403c]">
          <Activity className="w-3.5 h-3.5 text-[#8c3b2d]" />
          <span className="font-semibold">80.22% Accuracy</span>
          <span className="text-[#8c857b]">· 122-D PCA</span>
        </div>

        {/* Engine Live Status Beacon */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${
            backendStatus.modelAvailable
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-[#ede6d5] text-[#6b6252] border-[#d8cfbe]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.modelAvailable ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          />
          <span>{backendStatus.modelAvailable ? 'Engine Active' : 'Model Offline'}</span>
        </div>
      </div>
    </header>
  );
}
