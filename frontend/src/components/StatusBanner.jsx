import React from 'react';
import { AlertCircle, Terminal, HelpCircle } from 'lucide-react';

export default function StatusBanner({ backendStatus }) {
  if (backendStatus.modelAvailable) return null;

  return (
    <div className="bg-[#f7f3ea] border border-[#ded5c2] rounded-md p-4 mb-6 text-sm text-[#44403c]">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-[#8c3b2d] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#8c3b2d]">
              Notice: Model Not Trained / Pipeline Offline
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 bg-[#ebd0cb] text-[#73281c] rounded">
              Predictions Inactive
            </span>
          </div>
          <p className="text-xs text-[#57534e] leading-relaxed">
            In accordance with the clinical machine learning integrity protocol, real-time predictions and inference are disabled until the trained scikit-learn pipeline (PCA + SMOTE + Kernelized SVM or classical model artifact) is compiled and served by the backend API.
          </p>
          <div className="pt-1.5 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#78716c]">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3 h-3 text-[#57534e]" />
              <span>Backend endpoint expected: <code className="bg-[#ede7d8] px-1 py-0.5 rounded text-[#292524]">http://localhost:8000/api/v1/ecg/analyze</code></span>
            </span>
            <span>•</span>
            <span>Dataset Schema: <strong>UCI Arrhythmia (452 records × 279 features)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

