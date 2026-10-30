import React, { useState } from 'react';
import {
  CLINICAL_FEATURE_SECTIONS,
  SAMPLE_PATIENT_NORMAL,
  SAMPLE_PATIENT_BRADYCARDIA,
  SAMPLE_PATIENT_RBBB,
  SAMPLE_PATIENT_SUPRAVENTRICULAR,
} from '../data/schema';
import StatusBanner from '../components/StatusBanner';
import {
  Upload,
  FileText,
  AlertCircle,
  Stethoscope,
  CheckCircle,
  HelpCircle,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  Cpu,
} from 'lucide-react';

export default function Predict({
  backendStatus,
  onRunPrediction,
  isPredicting,
}) {
  const [mode, setMode] = useState('manual'); // 'manual' | 'csv'
  const [patientVector, setPatientVector] = useState([...SAMPLE_PATIENT_NORMAL]);
  const [activePreset, setActivePreset] = useState('normal');

  const [uploadedFile, setUploadedFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvError, setCsvError] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVectorChange = (index, value) => {
    setPatientVector((prev) => {
      const copy = [...prev];
      copy[index] = Number(value);
      return copy;
    });
    setActivePreset('custom');
  };

  const loadSample = (sampleType) => {
    setActivePreset(sampleType);
    let sample = SAMPLE_PATIENT_NORMAL;
    if (sampleType === 'bradycardia') sample = SAMPLE_PATIENT_BRADYCARDIA;
    else if (sampleType === 'rbbb') sample = SAMPLE_PATIENT_RBBB;
    else if (sampleType === 'supraventricular') sample = SAMPLE_PATIENT_SUPRAVENTRICULAR;

    setPatientVector([...sample]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setCsvError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (!text) return;
        const lines = text.trim().split(/\r?\n/);
        const firstLine = lines[0].split(',');
        setCsvPreview({
          filename: file.name,
          totalRows: lines.length,
          firstRowColumns: firstLine.length,
          previewValues: firstLine.slice(0, 15),
        });

        if (firstLine.length < 279 && firstLine.length !== 1) {
          setCsvError(`Notice: CSV row has ${firstLine.length} columns. Backend will auto-align to standard 279-feature schema.`);
        }
      } catch (err) {
        setCsvError('Failed to parse CSV file. Ensure valid comma-separated numeric format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = (type = 'normal') => {
    const sample = type === 'normal' ? SAMPLE_PATIENT_NORMAL : SAMPLE_PATIENT_BRADYCARDIA;
    const csvContent = "data:text/csv;charset=utf-8," + sample.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `uci_arrhythmia_${type}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isModelReady = backendStatus.modelAvailable;

  const handleSubmit = () => {
    if (mode === 'manual') {
      onRunPrediction(patientVector);
    } else {
      if (!uploadedFile) {
        alert('Please select or upload a CSV file first.');
        return;
      }
      onRunPrediction(uploadedFile);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in relative">
      <StatusBanner backendStatus={backendStatus} />

      {/* Scientific Analysis Overlay when Predicting */}
      {isPredicting && (
        <div className="fixed inset-0 bg-[#faf7f2]/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#ded5c2] rounded-lg p-7 max-w-md w-full shadow-lg space-y-5 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#faf4ec] border border-[#e8dccd] flex items-center justify-center">
              <Activity className="w-8 h-8 text-[#8c3b2d] animate-heart-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-base font-bold text-[#1c1917]">
                Executing ML Inference Pipeline
              </h3>
              <p className="text-xs text-[#78716c] font-sans">
                Processing 279-feature clinical vector through trained model
              </p>
            </div>

            {/* Scientific Pipeline Execution Stages */}
            <div className="space-y-2 text-left font-mono text-[11px] bg-[#fcfbf9] p-3.5 rounded border border-[#e5dfd3]">
              <div className="flex items-center space-x-2 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>1. Median Imputation on Missing Channels</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>2. Variance Filtering (262 Features Retained)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#8c3b2d]">
                <span className="w-2 h-2 rounded-full bg-[#8c3b2d] animate-ping" />
                <span>3. PCA 95% Projection (78 Components)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#78716c]">
                <span className="w-2 h-2 rounded-full bg-stone-300" />
                <span>4. Kernelized SVC Non-Linear Classification</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#8c857b]">
              TELEMETRY: Real-time matrix computation in progress...
            </div>
          </div>
        </div>
      )}

      {/* Header controls & Mode Switcher */}
      <div className="bg-white border border-[#e5dfd3] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="font-mono text-base font-bold text-[#1c1917]">
            Arrhythmia Clinical Inference
          </h2>
          <p className="text-xs text-[#78716c] font-sans mt-0.5">
            Input patient clinical metrics or upload a 279-column UCI feature vector
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#f4eee4] p-1 rounded-md border border-[#dfd7c5] self-start sm:self-auto">
          <button
            onClick={() => setMode('manual')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-medium transition-all ${
              mode === 'manual'
                ? 'bg-white text-[#1c1917] shadow-xs border border-[#d8cfbe]'
                : 'text-[#615c54] hover:text-[#1c1917]'
            }`}
          >
            Manual Feature Entry
          </button>
          <button
            onClick={() => setMode('csv')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-medium transition-all ${
              mode === 'csv'
                ? 'bg-white text-[#1c1917] shadow-xs border border-[#d8cfbe]'
                : 'text-[#615c54] hover:text-[#1c1917]'
            }`}
          >
            CSV Vector Upload
          </button>
        </div>
      </div>

      {/* MODE 1: Manual Input Form */}
      {mode === 'manual' && (
        <div className="space-y-5">
          {/* Preset patient loader bar */}
          <div className="bg-[#fcfbf9] border border-[#e5dfd3] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center space-x-2 text-[#57534e]">
              <Info className="w-4 h-4 text-[#8c857b]" />
              <span>
                Load validated clinical vector from <code>arrhythmia.csv</code>:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => loadSample('normal')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                  activePreset === 'normal'
                    ? 'bg-[#292524] text-white border-[#292524]'
                    : 'bg-white text-[#292524] border-[#d8d0c0] hover:bg-[#f5f1e8]'
                }`}
              >
                Sample 1: Normal (Class 01)
              </button>
              <button
                type="button"
                onClick={() => loadSample('bradycardia')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                  activePreset === 'bradycardia'
                    ? 'bg-[#292524] text-white border-[#292524]'
                    : 'bg-white text-[#292524] border-[#d8d0c0] hover:bg-[#f5f1e8]'
                }`}
              >
                Sample 2: Sinus Bradycardia (Class 06)
              </button>
              <button
                type="button"
                onClick={() => loadSample('rbbb')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                  activePreset === 'rbbb'
                    ? 'bg-[#292524] text-white border-[#292524]'
                    : 'bg-white text-[#292524] border-[#d8d0c0] hover:bg-[#f5f1e8]'
                }`}
              >
                Sample 3: RBBB (Class 10)
              </button>
              <button
                type="button"
                onClick={() => loadSample('supraventricular')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                  activePreset === 'supraventricular'
                    ? 'bg-[#292524] text-white border-[#292524]'
                    : 'bg-white text-[#292524] border-[#d8d0c0] hover:bg-[#f5f1e8]'
                }`}
              >
                Sample 4: SVPC (Class 08)
              </button>
            </div>
          </div>

          {/* Form Sections */}
          {CLINICAL_FEATURE_SECTIONS.map((section) => {
            const isCollapsed = collapsedSections[section.id];
            return (
              <div
                key={section.id}
                className="bg-white border border-[#e5dfd3] rounded-lg overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 bg-[#fcfaf6] border-b border-[#e9e3d7] flex items-center justify-between text-left hover:bg-[#f7f3ea] transition-colors"
                >
                  <div>
                    <h3 className="font-mono text-sm font-bold text-[#1c1917]">
                      {section.title}
                    </h3>
                    <p className="text-xs text-[#78716c] font-sans mt-0.5">
                      {section.description}
                    </p>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[#8c857b]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[#8c857b]" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {section.fields.map((field) => {
                      const val = patientVector[field.index] ?? '';
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <label
                              htmlFor={field.id}
                              className="font-medium text-[#292524] font-mono text-[12px]"
                            >
                              {field.label}
                            </label>
                            <span className="text-[10px] font-mono text-[#8c857b]">
                              {field.unit}
                            </span>
                          </div>

                          {field.type === 'select' ? (
                            <select
                              id={field.id}
                              value={val}
                              onChange={(e) =>
                                handleVectorChange(field.index, e.target.value)
                              }
                              className="w-full text-xs px-3 py-2 rounded border border-[#dfd7c5] bg-white focus:outline-none focus:border-[#78716c]"
                            >
                              {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="number"
                              id={field.id}
                              value={val}
                              step={field.step || 'any'}
                              onChange={(e) =>
                                handleVectorChange(field.index, e.target.value)
                              }
                              className="w-full text-xs px-3 py-2 rounded border border-[#dfd7c5] bg-white font-mono focus:outline-none focus:border-[#78716c]"
                            />
                          )}
                          {field.note && (
                            <p className="text-[10px] text-[#8c857b] font-sans">
                              {field.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: CSV Vector Upload */}
      {mode === 'csv' && (
        <div className="space-y-5">
          <div className="bg-white border-2 border-dashed border-[#dfd7c5] rounded-lg p-8 text-center space-y-4 hover:border-[#a89f8c] transition-colors bg-[#fcfbf9]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f3ece0] flex items-center justify-center text-[#78716c]">
              <Upload className="w-6 h-6 text-[#8c3b2d]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold text-[#1c1917]">
                Upload ECG Patient Feature CSV
              </h3>
              <p className="text-xs text-[#78716c] max-w-md mx-auto leading-relaxed">
                Accepts comma-separated numeric vectors conforming to the UCI Arrhythmia 279-attribute format or raw dataset files.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <label className="cursor-pointer px-4 py-2 bg-[#292524] text-white hover:bg-[#1c1917] rounded font-mono text-xs font-semibold shadow-xs">
                <span>Browse Local CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => handleDownloadSampleCsv('normal')}
                className="px-3 py-2 bg-white hover:bg-[#f5f1e8] text-[#57534e] border border-[#d8d0c0] rounded font-mono text-xs flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>

          {/* CSV File Feedback & Preview */}
          {uploadedFile && (
            <div className="bg-white border border-[#e5dfd3] rounded-lg p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#eee8dc] pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#8c3b2d]" />
                  <span className="font-mono text-xs font-bold text-[#1c1917]">
                    {uploadedFile.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#8c857b]">
                    ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready for Inference
                </span>
              </div>

              {csvPreview && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[11px] bg-[#faf8f5] p-3 rounded border border-[#ece4d5]">
                    <div>
                      <span className="text-[#8c857b]">Total Records: </span>
                      <strong className="text-[#1c1917]">{csvPreview.totalRows}</strong>
                    </div>
                    <div>
                      <span className="text-[#8c857b]">Row Columns: </span>
                      <strong className="text-[#1c1917]">{csvPreview.firstRowColumns}</strong>
                    </div>
                    <div>
                      <span className="text-[#8c857b]">Pipeline: </span>
                      <strong className="text-[#1c1917]">279 → 262 → 78 PCA</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#78716c] font-mono text-[11px]">
                      Preview (First 15 Values):
                    </span>
                    <div className="font-mono text-[11px] bg-[#f5f1e8] p-2 rounded border border-[#ded5c2] overflow-x-auto text-[#292524] mt-1">
                      {csvPreview.previewValues.join(', ')} ...
                    </div>
                  </div>
                </div>
              )}

              {csvError && (
                <div className="p-3 bg-[#fdf3f2] border border-[#f5c6cb] rounded text-xs text-[#a94442] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{csvError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Bar / Submit Section */}
      <div className="bg-white border border-[#e5dfd3] rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-[#78716c]">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isModelReady ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          />
          <span className="font-mono">
            {isModelReady
              ? 'Trained Model Loaded on Backend'
              : 'Model Not Trained (Inference Inactive)'}
          </span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={!isModelReady || isPredicting}
            onClick={handleSubmit}
            title={
              !isModelReady
                ? 'Prediction disabled until trained model is available on backend'
                : 'Run Arrhythmia Classification'
            }
            className={`w-full sm:w-auto px-6 py-2.5 rounded font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              isModelReady && !isPredicting
                ? 'bg-[#8c3b2d] hover:bg-[#73281c] text-white shadow-xs cursor-pointer'
                : 'bg-[#ede7d8] text-[#8c857b] border border-[#dcd4c2] cursor-not-allowed opacity-80'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>
              {isPredicting
                ? 'Processing Inference...'
                : !isModelReady
                ? 'Prediction Disabled (Model Not Trained)'
                : 'Classify Arrhythmia'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
