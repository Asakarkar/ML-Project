import React, { useState } from 'react';
import {
  DATASET_STATS,
  SAMPLE_PATIENT_NORMAL,
  SAMPLE_PATIENT_BRADYCARDIA,
  SAMPLE_PATIENT_RBBB,
} from '../data/schema';
import StatusBanner from '../components/StatusBanner';
import EcgMonitor from '../components/EcgMonitor';
import {
  Activity,
  Layers,
  TrendingUp,
  ArrowRight,
  Stethoscope,
  Upload,
  Clock,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export default function Dashboard({ setActiveTab, backendStatus, onRunPrediction }) {
  const [dragOver, setDragOver] = useState(false);

  // Quick verified clinical presets for instant testing
  const presets = [
    {
      id: 'normal',
      title: 'Patient 01: Normal ECG',
      finding: 'Normal Sinus Rhythm',
      details: '55y Male • Lead II • 71 BPM',
      classCode: '01',
      severity: 'Normal',
      data: SAMPLE_PATIENT_NORMAL,
    },
    {
      id: 'bradycardia',
      title: 'Patient 02: Sinus Bradycardia',
      finding: 'Rate < 60 bpm, preserved P-wave',
      details: '56y Female • Lead II • 53 BPM',
      classCode: '06',
      severity: 'Moderate',
      data: SAMPLE_PATIENT_BRADYCARDIA,
    },
    {
      id: 'rbbb',
      title: 'Patient 03: Right Bundle Branch Block',
      finding: 'Delayed right ventricular activation',
      details: '42y Male • Lead V1 • 68 BPM',
      classCode: '10',
      severity: 'Moderate',
      data: SAMPLE_PATIENT_RBBB,
    },
  ];

  const handleRunSample = (sampleData) => {
    if (onRunPrediction) {
      onRunPrediction(sampleData);
    } else {
      setActiveTab('predict');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && onRunPrediction) {
      onRunPrediction(file);
    } else {
      setActiveTab('predict');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file && onRunPrediction) {
      onRunPrediction(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-12 animate-fade-in">
      <StatusBanner backendStatus={backendStatus} />

      {/* Hero Header Strip */}
      <div className="bg-white border border-[#e5dfd3] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8c3b2d] font-bold bg-[#faf0ed] px-2 py-0.5 rounded border border-[#eed4cb] flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>CardioPulse™ AI</span>
            </span>
            <span className="font-mono text-[11px] text-[#15803d] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              122-D PCA Active
            </span>
          </div>

          <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight">
            Clinical Arrhythmia Surveillance
          </h1>

          <p className="text-xs text-[#57534e] max-w-xl leading-relaxed">
            Multi-channel 12-lead electrocardiogram analysis powered by 98.07% variance PCA and optimal-margin support vector hyperplanes across 16 diagnostic pathologies.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('predict')}
            className="px-4 py-2.5 bg-[#292524] text-[#faf8f5] hover:bg-[#1c1917] rounded-lg font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#e5dfd3]" />
            <span>Ingest Patient ECG</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('predict')}
            className="px-4 py-2.5 bg-[#fbf9f5] text-[#44403c] hover:bg-[#f3ece0] border border-[#dcd4c2] rounded-lg font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#8c3b2d]" />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Oscilloscope Waveform Monitor */}
      <EcgMonitor bpm={72} lead="Lead II" mode="Normal" />

      {/* Minimal Telemetry KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#e5dfd3] rounded-xl p-4.5 space-y-1 hover:border-[#cfc7b4] transition-all">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8c3b2d]">
              Diagnostic Sensitivity
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8c3b2d]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-2xl font-bold text-[#1c1917]">
              80.22%
            </span>
            <span className="text-[10px] font-mono font-semibold text-[#15803d] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Joint Top Acc
            </span>
          </div>
          <p className="text-[11px] text-[#78716c] font-sans">
            Linear & Kernel SVC with PCA on test split.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#e5dfd3] rounded-xl p-4.5 space-y-1 hover:border-[#cfc7b4] transition-all">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Signal Compression
            </span>
            <Layers className="w-3.5 h-3.5 text-[#8c857b]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-2xl font-bold text-[#1c1917]">
              278 → 122
            </span>
            <span className="text-[10px] font-mono font-semibold text-[#8c3b2d] bg-[#faf0ed] px-1.5 py-0.2 rounded border border-[#eed4cb]">
              -56.1%
            </span>
          </div>
          <p className="text-[11px] text-[#78716c] font-sans">
            98.07% cumulative variance preserved.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#e5dfd3] rounded-xl p-4.5 space-y-1 hover:border-[#cfc7b4] transition-all">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Diagnostic Taxonomy
            </span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#8c857b]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-2xl font-bold text-[#1c1917]">
              16 Classes
            </span>
            <span className="text-[10px] font-mono text-[#78716c] bg-[#f7f3ea] px-1.5 py-0.2 rounded border border-[#e5dfd3]">
              452 Cases
            </span>
          </div>
          <p className="text-[11px] text-[#78716c] font-sans">
            Sinus, blocks, ischemia & ectopic arrhythmias.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#e5dfd3] rounded-xl p-4.5 space-y-1 hover:border-[#cfc7b4] transition-all">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Inference Latency
            </span>
            <Clock className="w-3.5 h-3.5 text-[#8c857b]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-2xl font-bold text-[#1c1917]">
              14 ms
            </span>
            <span className="text-[10px] font-mono font-semibold text-[#15803d] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Sub-20ms
            </span>
          </div>
          <p className="text-[11px] text-[#78716c] font-sans">
            End-to-end vector transformation & inference.
          </p>
        </div>
      </div>

      {/* Interactive Quick Ingest & Testing Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: 3 Preloaded Patient Test Cases (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#e5dfd3] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#eee8dc] pb-3">
            <div>
              <h2 className="font-mono text-sm font-bold text-[#1c1917] uppercase tracking-wider">
                Instant Diagnostic Testing Presets
              </h2>
              <p className="text-xs text-[#78716c] font-sans mt-0.5">
                Execute live vector classification immediately with representative patient records
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Live Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {presets.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-lg border border-[#e8e2d4] bg-[#faf8f5] flex flex-col justify-between space-y-2.5 hover:border-[#cfc7b4] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#8c857b]">
                    <span>[{p.classCode}]</span>
                    <span
                      className={`px-1.5 py-0.2 rounded border font-mono ${
                        p.severity === 'Normal'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {p.severity}
                    </span>
                  </div>
                  <h3 className="font-mono text-xs font-bold text-[#1c1917] mt-1">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-[#57534e] font-sans mt-0.5 leading-snug">
                    {p.finding}
                  </p>
                  <p className="text-[10px] text-[#8c857b] font-mono mt-1">
                    {p.details}
                  </p>
                </div>

                <button
                  onClick={() => handleRunSample(p.data)}
                  className="w-full py-1.5 px-2 bg-white hover:bg-[#f3ede1] text-[#292524] border border-[#dcd4c2] rounded font-mono text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>Test Sample</span>
                  <ChevronRight className="w-3 h-3 text-[#8c3b2d]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick CSV Dropzone (1/3 width) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-colors ${
            dragOver ? 'border-[#8c3b2d] bg-[#faf3f0]' : 'border-[#e5dfd3]'
          }`}
        >
          <div>
            <div className="flex items-center space-x-2 text-[#8c3b2d]">
              <Upload className="w-4 h-4" />
              <h2 className="font-mono text-sm font-bold text-[#1c1917] uppercase tracking-wider">
                Quick CSV Ingest
              </h2>
            </div>
            <p className="text-xs text-[#78716c] font-sans mt-1">
              Drop an ECG record (.csv) matching the 279-column UCI schema for real-time classification.
            </p>
          </div>

          <label className="border-2 border-dashed border-[#ded5c2] hover:border-[#8c3b2d] rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#fdfcf9]">
            <Upload className="w-6 h-6 text-[#8c857b] mb-1.5" />
            <span className="font-mono text-xs font-bold text-[#1c1917]">
              Drop CSV or Browse
            </span>
            <span className="text-[10px] text-[#8c857b] font-sans mt-0.5">
              Supports raw 279-lead patient vectors
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setActiveTab('predict')}
            className="w-full py-2 bg-[#f8f5ee] hover:bg-[#efe8d8] text-[#44403c] border border-[#ded5c2] rounded-lg font-mono text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Manual Vector Entry Form</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Pathology Spectrum Bar & High-Level Breakdown */}
      <div className="bg-white border border-[#e5dfd3] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee8dc] pb-3">
          <div>
            <h2 className="font-mono text-sm font-bold text-[#1c1917] uppercase tracking-wider">
              Cardiac Cohort Electrophysiology Distribution
            </h2>
            <p className="text-xs text-[#78716c] font-sans mt-0.5">
              Proportional pathology distribution across 452 UCI electrocardiogram instances
            </p>
          </div>

          <button
            onClick={() => setActiveTab('about')}
            className="font-mono text-xs text-[#8c3b2d] hover:text-[#5c241a] font-semibold flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full 12-Model Benchmarks in About</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Proportional Spectrum Bar */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-[#f0eae0] rounded-full overflow-hidden flex">
            <div
              className="bg-[#15803d] h-full transition-all"
              style={{ width: '54.2%' }}
              title="Normal Sinus Rhythm (54.2%)"
            />
            <div
              className="bg-[#b45309] h-full transition-all"
              style={{ width: '13.1%' }}
              title="Conduction & Bundle Blocks (13.1%)"
            />
            <div
              className="bg-[#b91c1c] h-full transition-all"
              style={{ width: '10.8%' }}
              title="Ischemia & Infarctions (10.8%)"
            />
            <div
              className="bg-[#d97706] h-full transition-all"
              style={{ width: '6.2%' }}
              title="Rate Disturbances (6.2%)"
            />
            <div
              className="bg-[#78716c] h-full transition-all"
              style={{ width: '15.7%' }}
              title="Ectopic & Complex Rhythms (15.7%)"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#78716c] pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#15803d]" />
              <span>Normal Sinus Rhythm (54.2%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#b45309]" />
              <span>Conduction Blocks (13.1%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#b91c1c]" />
              <span>Ischemia & Infarction (10.8%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" />
              <span>Rate Disturbances (6.2%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#78716c]" />
              <span>Complex Rhythms (15.7%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
