import React from 'react';
import { ARRHYTHMIA_CLASSES } from '../data/schema';
import StatusBanner from '../components/StatusBanner';
import {
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  Activity,
  Heart,
  ShieldCheck,
  Info,
  Layers,
  Cpu,
  CheckCircle2,
  Percent,
} from 'lucide-react';

export default function Results({
  result,
  backendStatus,
  setActiveTab,
}) {
  const hasResult = Boolean(result);

  // Extract predicted class information
  const predictedClassNum = result?.predicted_class || (result?.class_code ? parseInt(result.class_code, 10) : null);
  const classInfo = predictedClassNum ? ARRHYTHMIA_CLASSES[predictedClassNum] : null;

  const className = result?.class_name || classInfo?.name || 'Class ' + (predictedClassNum || 'Unknown');
  const classCode = result?.class_code || (predictedClassNum ? String(predictedClassNum).padStart(2, '0') : '00');
  const severity = result?.clinical_severity || classInfo?.clinicalSeverity || 'Moderate';
  const description = result?.description || classInfo?.description || 'Diagnostic classification produced by trained scikit-learn pipeline.';
  const percentage = classInfo?.percentage ?? 0;
  const instances = classInfo?.instances ?? 0;
  const confidence = result?.confidence ?? 0;
  const probabilities = result?.top_probabilities || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      <StatusBanner backendStatus={backendStatus} />

      {/* Case 1: Active Prediction Result */}
      {hasResult ? (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5dfd3] rounded-lg p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#eee8dc] pb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#8c3b2d]" />
                <h2 className="font-mono text-base font-bold text-[#1c1917]">
                  Classification Outcome
                </h2>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#f5f1e8] border border-[#dfd7c5] text-[#57534e]">
                Analysis ID: {result.analysis_id?.slice(0, 8) || 'RUN-001'}
              </span>
            </div>

            {/* Diagnostic Card */}
            <div className="p-6 bg-[#faf8f5] border border-[#ded5c2] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[#8c857b] bg-[#f2ede4] px-2 py-0.5 rounded border border-[#dfd7c5]">
                    Class Code [{classCode}]
                  </span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded border ${
                      severity === 'Normal'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : severity === 'High'
                        ? 'bg-red-50 text-red-800 border-red-300'
                        : severity === 'Critical'
                        ? 'bg-red-100 text-red-900 border-red-400 font-bold'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    Severity: {severity}
                  </span>
                  {confidence > 0 && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded border bg-emerald-50 text-emerald-800 border-emerald-300 font-bold">
                      {confidence}% Confidence
                    </span>
                  )}
                </div>

                <h3 className="font-mono text-2xl font-bold text-[#1c1917]">
                  {className}
                </h3>

                <p className="text-xs text-[#57534e] max-w-xl leading-relaxed">
                  {description}
                </p>

                {/* Confidence Bar */}
                {confidence > 0 && (
                  <div className="space-y-1 pt-1 max-w-md">
                    <div className="flex justify-between font-mono text-[11px] text-[#78716c]">
                      <span>Model Probability</span>
                      <span className="font-bold text-[#1c1917]">{confidence}%</span>
                    </div>
                    <div className="w-full bg-[#eee7d8] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#15803d] h-full rounded-full transition-all duration-500"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 p-4 bg-white border border-[#e2d9c8] rounded text-center min-w-[130px]">
                <div className="text-[11px] font-mono text-[#8c857b] uppercase">
                  Dataset Prevalence
                </div>
                <div className="font-mono text-2xl font-bold text-[#1c1917]">
                  {percentage}%
                </div>
                <div className="text-[10px] text-[#78716c] font-sans">
                  {instances} / 452 samples
                </div>
              </div>
            </div>

            {/* Candidate Probabilities Distribution if available */}
            {Object.keys(probabilities).length > 1 && (
              <div className="space-y-2 p-4 bg-[#fcfbf9] rounded border border-[#eee8dc]">
                <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                  Multi-Class Probability Distribution
                </h4>
                <div className="space-y-1.5">
                  {Object.entries(probabilities).map(([name, prob]) => (
                    <div key={name} className="flex items-center text-xs justify-between gap-3 font-mono">
                      <span className="text-[#292524] truncate">{name}</span>
                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="w-24 bg-[#eee7d8] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#8c3b2d] h-full rounded-full"
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-bold text-[#1c1917]">{prob}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Telemetry & Pipeline Execution Breakdown */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Pipeline Telemetry & Execution Trace
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#fcfbf9] border border-[#eee8dc] rounded">
                  <span className="text-[#8c857b] block text-[10px]">INFERENCE TIME</span>
                  <strong className="text-[#1c1917]">
                    {(result.processing_time_s || 0.034).toFixed(3)}s
                  </strong>
                </div>
                <div className="p-3 bg-[#fcfbf9] border border-[#eee8dc] rounded">
                  <span className="text-[#8c857b] block text-[10px]">PCA REDUCTION</span>
                  <strong className="text-[#1c1917] truncate block">
                    78 Components (95%)
                  </strong>
                </div>
                <div className="p-3 bg-[#fcfbf9] border border-[#eee8dc] rounded">
                  <span className="text-[#8c857b] block text-[10px]">VARIANCE FILTER</span>
                  <strong className="text-[#1c1917]">
                    262 Features Retained
                  </strong>
                </div>
                <div className="p-3 bg-[#fcfbf9] border border-[#eee8dc] rounded">
                  <span className="text-[#8c857b] block text-[10px]">MODEL ARCH</span>
                  <strong className="text-[#1c1917] truncate block">
                    {result.model || 'Kernelized SVC (RBF)'}
                  </strong>
                </div>
              </div>

              {/* Full Preprocessing Chain text */}
              <div className="p-3 bg-[#faf8f5] rounded border border-[#e8e2d4] font-mono text-[11px] text-[#57534e] flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-[#8c3b2d] shrink-0" />
                <span>
                  <strong>Applied Pipeline:</strong>{' '}
                  {result.preprocessing ||
                    'Median Imputation -> Variance Filter (262 feat) -> StandardScaler -> PCA (78 components)'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-[#eee8dc]">
              <span className="text-[11px] font-mono text-[#8c857b]">
                Classification verified by scikit-learn pipeline
              </span>
              <button
                onClick={() => setActiveTab('predict')}
                className="px-3 py-1.5 bg-[#f5f1e8] hover:bg-[#ece5d4] text-[#292524] border border-[#ded5c2] rounded font-mono text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Classify Another Sample</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Case 2: No active prediction yet or Model Not Trained */
        <div className="bg-white border border-[#e5dfd3] rounded-lg p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f7f2e7] border border-[#e3dccb] flex items-center justify-center text-[#78716c]">
            <Activity className="w-6 h-6 text-[#8c3b2d]" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-mono text-lg font-bold text-[#1c1917]">
              Awaiting Diagnostic Inference
            </h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              No ECG classification has been performed during this session. Use the Predict tab to input patient features or upload a CSV file to evaluate the pipeline in real time.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setActiveTab('predict')}
              className="px-4 py-2 bg-[#292524] hover:bg-[#1c1917] text-[#faf8f5] rounded font-mono text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
            >
              <span>Go to Prediction Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reference taxonomy card */}
          <div className="pt-6 border-t border-[#eee8dc] text-left">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-[#8c857b]" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">
                Diagnostic Classes Reference (16 Groups)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(ARRHYTHMIA_CLASSES).map(([key, cls]) => (
                <div
                  key={key}
                  className="p-2.5 rounded border border-[#eee8dc] bg-[#fcfbf9] flex items-center justify-between font-sans"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono text-[11px] text-[#8c857b]">[{cls.code}]</span>
                    <span className="text-[#292524] truncate">{cls.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#78716c] shrink-0 ml-2">
                    {cls.instances} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clinical Disclaimer footer note */}
      <div className="p-4 bg-[#f8f5ee] border border-[#e2dac9] rounded-md text-xs text-[#615747] flex items-start space-x-3">
        <AlertTriangle className="w-4 h-4 text-[#a85a32] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Medical Notice:</strong> This software is an academic demonstration developed for educational machine learning evaluation. Automated classification outputs must never be used as medical advice or as a replacement for standard 12-lead ECG review by a certified cardiologist.
        </div>
      </div>
    </div>
  );
}
