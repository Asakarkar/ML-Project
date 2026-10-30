import React, { useState, useEffect } from 'react';
import { ARRHYTHMIA_CLASSES, DATASET_STATS, MODEL_PERFORMANCE } from '../data/schema';
import StatusBanner from '../components/StatusBanner';
import { getBackendBenchmarks } from '../services/api';
import {
  BookOpen,
  Database,
  Award,
  Layers,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Activity,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  Table,
  Columns,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

export default function About({ backendStatus }) {
  const [liveBenchmarks, setLiveBenchmarks] = useState(null);
  const [loadingBenchmarks, setLoadingBenchmarks] = useState(false);
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'benchmarks', 'pca', 'taxonomy', 'specs'
  const [benchmarkView, setBenchmarkView] = useState('matrix'); // 'matrix' | 'cards'

  useEffect(() => {
    async function loadMetrics() {
      if (backendStatus?.online) {
        setLoadingBenchmarks(true);
        try {
          const data = await getBackendBenchmarks();
          if (data && !data.error && !data.status) {
            setLiveBenchmarks(data);
          }
        } catch {
          // Fall back to schema defaults
        } finally {
          setLoadingBenchmarks(false);
        }
      }
    }
    loadMetrics();
  }, [backendStatus?.online]);

  // Unified resolution function matching live backend benchmark payload
  const resolveMetric = (item, isPca) => {
    if (!liveBenchmarks) return item;
    const clean = item.name.replace(' Classifier', '').replace(' (RBF)', '');
    const candidates = isPca
      ? [
          `${clean} with PCA`,
          `${clean} Classifier with PCA`,
          `${item.name} with PCA`,
          `${item.name.replace(' (RBF)', '')} with PCA`,
        ]
      : [
          clean,
          `${clean} Classifier`,
          item.name,
          item.name.replace(' (RBF)', ''),
        ];

    for (const c of candidates) {
      if (liveBenchmarks[c]) {
        const live = liveBenchmarks[c];
        return {
          ...item,
          accuracy: live.accuracy ?? live.test_accuracy ?? item.accuracy,
          recall: live.recall ?? item.recall,
          precision: live.precision ?? item.precision,
          f1: live.f1_score ?? live.f1 ?? item.f1,
          trainAccuracy: live.train_accuracy ?? item.trainAccuracy,
        };
      }
    }
    return item;
  };

  const rawModels = MODEL_PERFORMANCE.withoutPca.map((m) => resolveMetric(m, false));
  const pcaModels = MODEL_PERFORMANCE.withPcaAndSmote.map((m) => resolveMetric(m, true));

  // Head-to-head delta comparisons
  const headToHead = [
    {
      name: 'Linear SVC',
      raw: rawModels.find((m) => m.name.includes('Linear SVC')),
      pca: pcaModels.find((m) => m.name.includes('Linear SVC')),
      delta: +(pcaModels.find((m) => m.name.includes('Linear SVC'))?.accuracy - rawModels.find((m) => m.name.includes('Linear SVC'))?.accuracy).toFixed(2),
      insight: 'Joint Top Test Accuracy: Maximum margin hyperplane excels on 122 orthogonal continuous PCA dimensions with +2.20% gain over raw.',
      badge: 'Joint Top Test Acc (80.22%)',
      badgeTone: 'emerald',
    },
    {
      name: 'Kernelized SVC (RBF)',
      raw: rawModels.find((m) => m.name.includes('Kernelized')),
      pca: pcaModels.find((m) => m.name.includes('Kernelized')),
      delta: +(pcaModels.find((m) => m.name.includes('Kernelized'))?.accuracy - rawModels.find((m) => m.name.includes('Kernelized'))?.accuracy).toFixed(2),
      insight: 'Joint Top & Production Pipeline: Achieves 80.22% test accuracy with superior non-linear margin boundary separation across 16 arrhythmia classes.',
      badge: 'Joint Top Test Acc (80.22%)',
      badgeTone: 'emerald',
    },
    {
      name: 'Logistic Regression',
      raw: rawModels.find((m) => m.name.includes('Logistic')),
      pca: pcaModels.find((m) => m.name.includes('Logistic')),
      delta: +(pcaModels.find((m) => m.name.includes('Logistic'))?.accuracy - rawModels.find((m) => m.name.includes('Logistic'))?.accuracy).toFixed(2),
      insight: 'Overfitting Shield: Eliminated raw 93.91% training memorization (down to 78.39% train on PCA) with +1.10% test boost.',
      badge: '+1.10% Test Accuracy Boost',
      badgeTone: 'emerald',
    },
    {
      name: 'KNN Classifier',
      raw: rawModels.find((m) => m.name.includes('KNN')),
      pca: pcaModels.find((m) => m.name.includes('KNN')),
      delta: +(pcaModels.find((m) => m.name.includes('KNN'))?.accuracy - rawModels.find((m) => m.name.includes('KNN'))?.accuracy).toFixed(2),
      insight: 'Zero Information Loss: Preserves exact 64.84% accuracy while Euclidean distances compute on 56% fewer orthogonal dimensions.',
      badge: 'Zero Loss (64.84%)',
      badgeTone: 'stone',
    },
    {
      name: 'Decision Tree',
      raw: rawModels.find((m) => m.name.includes('Decision Tree')),
      pca: pcaModels.find((m) => m.name.includes('Decision Tree')),
      delta: +(pcaModels.find((m) => m.name.includes('Decision Tree'))?.accuracy - rawModels.find((m) => m.name.includes('Decision Tree'))?.accuracy).toFixed(2),
      insight: 'Axis-Aligned Limitation: Degrades on PCA coordinates because orthogonal cuts struggle on linear combinations of clinical ECG leads.',
      badge: 'Axis Split Decay (-7.69%)',
      badgeTone: 'rose',
    },
    {
      name: 'Random Forest',
      raw: rawModels.find((m) => m.name.includes('Random Forest')),
      pca: pcaModels.find((m) => m.name.includes('Random Forest')),
      delta: +(pcaModels.find((m) => m.name.includes('Random Forest'))?.accuracy - rawModels.find((m) => m.name.includes('Random Forest'))?.accuracy).toFixed(2),
      insight: 'Ensemble Rotation Penalty: Random sub-sampling of dense continuous PCA eigenvectors dilutes ECG domain feature importance.',
      badge: 'Rotated Subspace Decay (-14.28%)',
      badgeTone: 'rose',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-fade-in">
      <StatusBanner backendStatus={backendStatus} />

      {/* Main Hero Header */}
      <div className="bg-white border border-[#e5dfd3] rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8c3b2d] font-bold bg-[#faf0ed] px-2.5 py-1 rounded-md border border-[#eed4cb] flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>CardioPulse™ Documentation</span>
              </span>
              <span className="font-mono text-xs text-[#15803d] font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                122-D PCA • 98.07% Variance
              </span>
              <span className="font-mono text-xs text-[#78716c] bg-[#f7f3ea] px-2.5 py-1 rounded-md border border-[#e5dfd3]">
                12-Model Benchmarks
              </span>
            </div>

            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
              About the Project & Model Architecture
            </h1>

            <p className="text-sm text-[#57534e] max-w-3xl leading-relaxed">
              CardioPulse™ is an electrophysiology classification system trained on the 12-lead electrocardiogram (ECG) database from the UCI Machine Learning Repository. It combines robust outlier handling, mean imputation, 98% variance Principal Component Analysis (122 dimensions), and kernelized support vector hyperplanes to classify cardiac rhythms across 16 diagnostic pathologies.
            </p>
          </div>

          <div className="shrink-0 p-5 bg-[#fcfbf7] border border-[#ded5c2] rounded-xl text-center min-w-[200px]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8c857b] block">
              Highest Test Accuracy
            </span>
            <span className="font-mono text-4xl font-bold text-[#1c1917] block my-1">
              80.22%
            </span>
            <span className="text-xs font-mono text-[#15803d] font-semibold block">
              Linear SVC & Kernel SVC PCA
            </span>
            <span className="text-[11px] font-mono text-[#8c857b] mt-1 block">
              Selected Model: 80.22%
            </span>
          </div>
        </div>

        {/* Section Quick Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-[#eee8dc]">
          {[
            { id: 'all', label: 'Complete Overview' },
            { id: 'benchmarks', label: '12-Model Benchmarks' },
            { id: 'pca', label: 'PCA & Pipeline Architecture' },
            { id: 'taxonomy', label: '16-Class Taxonomy' },
            { id: 'specs', label: 'Dataset Specifications' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                activeSection === sec.id
                  ? 'bg-[#292524] text-[#faf8f5] border-[#292524] shadow-xs font-medium'
                  : 'bg-[#fcfaf6] text-[#57534e] hover:bg-[#f3ede1] border-[#e5dfd3]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: 12-Model Comparative Performance Benchmarks */}
      {(activeSection === 'all' || activeSection === 'benchmarks') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee8dc] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#8c3b2d]" />
                <h2 className="font-mono text-xl font-bold text-[#1c1917]">
                  Comparative Model Performance Benchmarks
                </h2>
              </div>
              <p className="text-xs text-[#78716c] font-sans mt-0.5">
                Head-to-head empirical evaluation across 6 distinct learning algorithms evaluated on raw 278 features versus 122-component PCA subspace (361 train / 91 test samples)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {loadingBenchmarks && (
                <div className="flex items-center space-x-1.5 font-mono text-xs text-[#78716c]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Syncing...</span>
                </div>
              )}

              {/* View Switcher: Matrix Table vs Two-Column Cards */}
              <div className="inline-flex rounded-lg border border-[#ded5c2] bg-[#fbf9f5] p-0.5 text-xs font-mono">
                <button
                  onClick={() => setBenchmarkView('matrix')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    benchmarkView === 'matrix'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs border border-[#ded5c2]'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  <Table className="w-3.5 h-3.5 text-[#8c3b2d]" />
                  <span>Matrix Table</span>
                </button>
                <button
                  onClick={() => setBenchmarkView('cards')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    benchmarkView === 'cards'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs border border-[#ded5c2]'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 text-[#8c3b2d]" />
                  <span>Dual Cards</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Empirical Insights KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#ded5c2] rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8c857b] uppercase font-bold tracking-wider">
                  Top Generalization
                </span>
                <span className="font-mono text-[10px] text-[#15803d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  +2.20% Δ
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-[#1c1917]">
                Linear SVC with PCA
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-mono text-2xl font-bold text-[#15803d]">80.22%</span>
                <span className="font-mono text-xs text-[#78716c]">Test Acc (Train: 80.89%)</span>
              </div>
              <p className="text-[11px] text-[#78716c] font-sans pt-1">
                Joint highest test accuracy (0.802198); minimal 0.67% overfitting gap.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#ded5c2] rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8c857b] uppercase font-bold tracking-wider">
                  Production Deployment
                </span>
                <span className="font-mono text-[10px] text-[#15803d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  +1.10% Δ
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-[#1c1917]">
                Kernelized SVC with PCA
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-mono text-2xl font-bold text-[#8c3b2d]">80.22%</span>
                <span className="font-mono text-xs text-[#78716c]">Test Acc (Train: 83.93%)</span>
              </div>
              <p className="text-[11px] text-[#78716c] font-sans pt-1">
                Joint highest 80.22% accuracy (0.802198); non-linear margin boundary separation in Hilbert space.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#ded5c2] rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8c857b] uppercase font-bold tracking-wider">
                  Overfitting Shield
                </span>
                <span className="font-mono text-[10px] text-[#15803d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  15.9% → -0.7%
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-[#1c1917]">
                Logistic Regression PCA
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-mono text-2xl font-bold text-[#1c1917]">79.12%</span>
                <span className="font-mono text-xs text-[#15803d] font-semibold">+1.10% vs Raw</span>
              </div>
              <p className="text-[11px] text-[#78716c] font-sans pt-1">
                Raw 93.91% train memorization eliminated; test accuracy boosted from 78.02% to 79.12%.
              </p>
            </div>
          </div>

          {/* VIEW A: Head-to-Head Comparative Matrix Table */}
          {benchmarkView === 'matrix' && (
            <div className="bg-white border border-[#ded5c2] rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#eee8dc] bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#1c1917] uppercase tracking-wider">
                    Full Comparative Performance Matrix (Raw 278 Features vs 122 PCA Dimensions)
                  </h3>
                  <p className="text-xs text-[#78716c] font-sans mt-0.5">
                    Direct delta comparison showing test accuracy gains/losses, variance compression, and trade-offs
                  </p>
                </div>
                <span className="font-mono text-xs text-[#15803d] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto font-semibold">
                  12 Total Model Configurations
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#eee8dc] bg-[#faf8f4] text-[#8c857b] font-mono uppercase text-[11px]">
                      <th className="py-3 px-4">Classifier Architecture</th>
                      <th className="py-3 px-3 text-right">Raw Test (278-D)</th>
                      <th className="py-3 px-3 text-right">PCA Test (122-D)</th>
                      <th className="py-3 px-3 text-center">Δ Gain/Loss</th>
                      <th className="py-3 px-3 text-right">PCA Train Acc</th>
                      <th className="py-3 px-3 text-right">Overfit Gap</th>
                      <th className="py-3 px-3 text-right">Precision</th>
                      <th className="py-3 px-3 text-right">Recall</th>
                      <th className="py-3 px-3 text-right">F1-Score</th>
                      <th className="py-3 px-4">Empirical Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ede4] font-sans">
                    {headToHead.map((row) => {
                      const isPositive = row.delta > 0;
                      const isZero = row.delta === 0;
                      const overfitGap = (row.pca?.trainAccuracy - row.pca?.accuracy).toFixed(2);
                      const isLinearTop = row.name.includes('Linear SVC');
                      const isKernelSelected = row.name.includes('Kernelized');

                      return (
                        <tr
                          key={row.name}
                          className={`hover:bg-[#faf7f2] transition-colors ${
                            isLinearTop
                              ? 'bg-[#f7faf7]/60'
                              : isKernelSelected
                              ? 'bg-[#fcf9f4]/80'
                              : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-[#1c1917]">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">{row.name}</span>
                              {isLinearTop && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300 font-semibold">
                                  Top Acc
                                </span>
                              )}
                              {isKernelSelected && (
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300 font-semibold">
                                  Selected
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8c857b] font-mono">
                              {row.pca?.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right text-[#57534e]">
                            {row.raw?.accuracy.toFixed(2)}%
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right font-bold text-[#1c1917]">
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                isLinearTop
                                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                                  : isKernelSelected
                                  ? 'bg-[#fcf0ec] text-[#8c3b2d] font-bold'
                                  : ''
                              }`}
                            >
                              {row.pca?.accuracy.toFixed(2)}%
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-mono text-center">
                            <span
                              className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                                isPositive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : isZero
                                  ? 'bg-[#f5f1ea] text-[#78716c] border-[#ded5c2]'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUpRight className="w-3 h-3 text-emerald-700" />
                              ) : !isZero ? (
                                <ArrowDownRight className="w-3 h-3 text-rose-700" />
                              ) : null}
                              <span>
                                {isPositive ? `+${row.delta}%` : `${row.delta}%`}
                              </span>
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right text-[#78716c]">
                            {row.pca?.trainAccuracy?.toFixed(2)}%
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right text-[#78716c]">
                            <span
                              className={`text-[11px] ${
                                Number(overfitGap) > 10
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-[#15803d]'
                              }`}
                            >
                              {overfitGap}%
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right text-[#57534e]">
                            {row.pca?.precision?.toFixed(1)}%
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right text-[#57534e]">
                            {row.pca?.recall?.toFixed(1)}%
                          </td>

                          <td className="py-3.5 px-3 font-mono text-right font-semibold text-[#1c1917]">
                            {row.pca?.f1?.toFixed(1)}%
                          </td>

                          <td className="py-3.5 px-4 text-[11px] text-[#57534e] max-w-xs leading-relaxed">
                            {row.insight}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW B: Dual Group Side-by-Side Breakdown Cards */}
          {benchmarkView === 'cards' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Table 1: Baseline Without PCA */}
              <div className="bg-white border border-[#e5dfd3] rounded-xl p-6 space-y-4">
                <div className="border-b border-[#eee8dc] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#8c857b] bg-[#f4efe4] px-2 py-0.5 rounded">
                      GROUP A
                    </span>
                    <h3 className="font-mono text-base font-bold text-[#1c1917]">
                      1. Baseline (Without PCA)
                    </h3>
                  </div>
                  <p className="text-xs text-[#78716c] font-sans mt-1">
                    Trained on all 278 features with StandardScaler & mean imputation. Subject to high collinearity across ECG channels.
                  </p>
                </div>

                <div className="divide-y divide-[#f5f1ea]">
                  {rawModels.map((m) => (
                    <div key={m.name} className="py-3.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-[#292524]">{m.name}</span>
                          <span className="text-[11px] font-mono text-[#8c857b] ml-2">
                            ({m.status})
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#1c1917]">
                          {m.accuracy.toFixed(2)}%
                        </span>
                      </div>

                      <div className="w-full bg-[#f0eae0] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#78716c] rounded-full"
                          style={{ width: `${m.accuracy}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#8c857b] pt-0.5">
                        <span>Train: {m.trainAccuracy?.toFixed(1) || '—'}%</span>
                        <span>Precision: {m.precision?.toFixed(1)}%</span>
                        <span>Recall: {m.recall?.toFixed(1)}%</span>
                        <span>F1: {m.f1?.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table 2: PCA Dimensionality Reduction */}
              <div className="bg-white border border-[#ded5c2] rounded-xl p-6 space-y-4 shadow-xs">
                <div className="border-b border-[#eee8dc] pb-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#15803d] bg-[#edf7ee] px-2 py-0.5 rounded border border-[#cbe4cc]">
                        GROUP B
                      </span>
                      <h3 className="font-mono text-base font-bold text-[#1c1917]">
                        2. PCA Dimensionality Reduction
                      </h3>
                    </div>
                    <p className="text-xs text-[#78716c] font-sans mt-1">
                      Fitted PCA retaining 98.07% cumulative variance (122 orthogonal principal components).
                    </p>
                  </div>
                  {liveBenchmarks && (
                    <span className="font-mono text-[10px] text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Verified
                    </span>
                  )}
                </div>

                <div className="divide-y divide-[#f5f1ea]">
                  {pcaModels.map((m) => {
                    const isTopAcc = m.name.includes('Linear SVC');
                    const isSelected = m.name.includes('Kernelized SVC');
                    return (
                      <div key={m.name} className="py-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-medium text-[#292524]">{m.name}</span>
                            {isTopAcc && (
                              <span className="font-mono text-[10px] font-bold text-[#15803d] bg-[#edf7ee] px-1.5 py-0.2 rounded border border-[#cbe4cc]">
                                Top Acc
                              </span>
                            )}
                            {isSelected && (
                              <span className="font-mono text-[10px] font-bold text-[#8c3b2d] bg-[#fbf0ec] px-1.5 py-0.2 rounded border border-[#eed4cb] flex items-center space-x-1">
                                <Award className="w-3 h-3 inline" />
                                <span>Selected</span>
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-mono text-xs font-bold ${
                              isTopAcc
                                ? 'text-[#15803d]'
                                : isSelected
                                ? 'text-[#8c3b2d]'
                                : 'text-[#1c1917]'
                            }`}
                          >
                            {m.accuracy.toFixed(2)}%
                          </span>
                        </div>

                        <div className="w-full bg-[#f0eae0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTopAcc
                                ? 'bg-[#15803d]'
                                : isSelected
                                ? 'bg-[#8c3b2d]'
                                : 'bg-[#44403c]'
                            }`}
                            style={{ width: `${m.accuracy}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#8c857b] pt-0.5">
                          <span>Train: {m.trainAccuracy?.toFixed(1) || '—'}%</span>
                          <span>Precision: {m.precision?.toFixed(1)}%</span>
                          <span>Recall: {m.recall?.toFixed(1)}%</span>
                          <span>F1: {m.f1?.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Theoretical Geometric Rationale Callout */}
          <div className="p-5 bg-[#fcfbf7] border border-[#ded5c2] rounded-xl flex items-start space-x-3.5">
            <Scale className="w-5 h-5 text-[#8c3b2d] shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs">
              <h4 className="font-mono font-bold text-[#1c1917] uppercase tracking-wider text-[11px]">
                Machine Learning Rationale: Why Hyperplane Models Improve While Decision Trees Degrade on PCA
              </h4>
              <p className="text-[#57534e] leading-relaxed">
                Principal Component Analysis creates orthogonal axes that are <em>linear combinations of all 278 raw features</em>. Hyperplane-based classifiers (such as <strong>Linear SVC</strong> and <strong>Logistic Regression</strong>) operate by determining optimal separating hyperplanes across continuous linear projections; by removing collinear redundancy and noise, their test generalization improves (e.g. Linear SVC reaching <strong>80.22%</strong>). In contrast, <strong>Decision Trees</strong> and <strong>Random Forests</strong> rely on axis-parallel partitioning (e.g. <code>feature_j &lt; threshold</code>); when correlated physiological features (like ECG wave amplitudes) are blended into rotated eigenvector coordinates, orthogonal cuts lose their domain-specific discriminant power, explaining the empirical drop from 76.92% down to 58.24%.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: PCA & Preprocessing Methodology Details */}
      {(activeSection === 'all' || activeSection === 'pca') && (
        <section className="space-y-4">
          <div className="border-b border-[#eee8dc] pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#8c3b2d]" />
              <h2 className="font-mono text-xl font-bold text-[#1c1917]">
                Pipeline Preprocessing & PCA Dimensionality Reduction
              </h2>
            </div>
            <p className="text-xs text-[#78716c] font-sans mt-0.5">
              Strict leakage-free methodology ensuring all transformers and imputers are fitted solely on training splits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#fcfbf9] border border-[#e5dfd3] rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#8c3b2d]">
                <Layers className="w-4 h-4" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  1. Feature Scrubbing & Outliers
                </h4>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Raw index 13 (J angle / missing column) is dropped prior to modeling, reducing dimensions from 279 to 278. Height outliers (e.g. 608 cm corrected to 108 cm, 780 cm corrected to 180 cm) are repaired to prevent scalar distortion.
              </p>
              <div className="pt-2 border-t border-[#ede7d8] font-mono text-[11px] text-[#78716c]">
                Features: 279 → 278
              </div>
            </div>

            <div className="bg-[#fcfbf9] border border-[#e5dfd3] rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#8c3b2d]">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  2. 98% Variance PCA (122-D)
                </h4>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                PCA decompresses collinear cross-talk across limb leads (DI, DII, DIII, aVR, aVL, aVF) and chest leads (V1–V6). 122 orthogonal principal axes preserve 98.07% cumulative variance while slashing dimensionality by 56.1%.
              </p>
              <div className="pt-2 border-t border-[#ede7d8] font-mono text-[11px] text-[#15803d] font-semibold">
                122 Axes (98.07% Var)
              </div>
            </div>

            <div className="bg-[#fcfbf9] border border-[#e5dfd3] rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#8c3b2d]">
                <Award className="w-4 h-4" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  3. Optimal Margin Classifiers
                </h4>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Linear SVC achieves the highest overall accuracy (80.22% test) by establishing maximal linear separating hyperplanes, while Kernelized SVC (75.82% test, 69.51% F1) delivers superior sensitivity across critical arrhythmia classes.
              </p>
              <div className="pt-2 border-t border-[#ede7d8] font-mono text-[11px] text-[#8c3b2d] font-semibold">
                80.22% Linear / 75.82% Kernel
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Dataset Specifications */}
      {(activeSection === 'all' || activeSection === 'specs') && (
        <section className="space-y-4">
          <div className="border-b border-[#eee8dc] pb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-[#8c3b2d]" />
              <h2 className="font-mono text-xl font-bold text-[#1c1917]">
                UCI Machine Learning Repository Specification
              </h2>
            </div>
            <p className="text-xs text-[#78716c] font-sans mt-0.5">
              Standardized benchmark electrophysiology dataset characteristics (Guvenir et al., 1997)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-white p-5 rounded-xl border border-[#e8e2d4]">
              <span className="text-[#8c857b] block text-[10px] uppercase font-bold tracking-wider">
                Total Records
              </span>
              <span className="text-2xl font-bold text-[#1c1917] block my-1">
                {DATASET_STATS.totalRecords}
              </span>
              <span className="text-[#78716c] block text-[11px] font-sans">
                Patient ECG recordings
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e8e2d4]">
              <span className="text-[#8c857b] block text-[10px] uppercase font-bold tracking-wider">
                Raw Input Features
              </span>
              <span className="text-2xl font-bold text-[#1c1917] block my-1">
                {DATASET_STATS.totalFeatures}
              </span>
              <span className="text-[#78716c] block text-[11px] font-sans">
                206 linear, 73 nominal
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e8e2d4]">
              <span className="text-[#8c857b] block text-[10px] uppercase font-bold tracking-wider">
                Target Classes
              </span>
              <span className="text-2xl font-bold text-[#1c1917] block my-1">
                {DATASET_STATS.totalClasses}
              </span>
              <span className="text-[#78716c] block text-[11px] font-sans">
                1 Normal + 15 Arrhythmias
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e8e2d4]">
              <span className="text-[#8c857b] block text-[10px] uppercase font-bold tracking-wider">
                PCA Compression
              </span>
              <span className="text-2xl font-bold text-[#1c1917] block my-1">
                {DATASET_STATS.pcaComponents}
              </span>
              <span className="text-[#15803d] block text-[11px] font-sans font-semibold">
                {DATASET_STATS.pcaVarianceRetained} variance retained
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Complete Clinical Class Taxonomy */}
      {(activeSection === 'all' || activeSection === 'taxonomy') && (
        <section className="bg-white border border-[#e5dfd3] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#eee8dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[#8c3b2d]" />
                <h2 className="font-mono text-xl font-bold text-[#1c1917]">
                  Complete 16-Class Diagnostic Taxonomy
                </h2>
              </div>
              <p className="text-xs text-[#78716c] font-sans mt-0.5">
                Clinical electrophysiology nomenclature and sample distribution across all diagnostic classes
              </p>
            </div>

            <span className="font-mono text-xs text-[#78716c] bg-[#f7f3ea] px-3 py-1 rounded-md border border-[#e3dccb] self-start sm:self-auto">
              54.2% Normal / 45.8% Arrhythmic
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {Object.entries(ARRHYTHMIA_CLASSES).map(([key, cls]) => {
              const isNormal = cls.code === '01';
              const isHighRisk = cls.clinicalSeverity === 'High' || cls.clinicalSeverity === 'Critical';
              return (
                <div
                  key={key}
                  className="p-4 bg-[#faf8f5] hover:bg-[#f7f3ed] transition-colors rounded-lg border border-[#e8e2d4] space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#1c1917]">
                        Class {cls.code}: {cls.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isNormal
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isHighRisk
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {cls.clinicalSeverity}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#57534e] font-sans leading-relaxed">
                    {cls.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#ede7d8] font-mono text-[10px] text-[#8c857b]">
                    <span>Cohort: {cls.instances} instances</span>
                    <span>{cls.percentage}% of dataset</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 5: Academic Reference */}
      <section className="bg-[#fcfbf9] border border-[#e5dfd3] rounded-xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-[#1c1917]">
          <GraduationCap className="w-4 h-4 text-[#8c857b]" />
          <h3 className="font-mono text-sm font-bold">
            Academic Reference & Dataset Citation
          </h3>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#ded5c2] font-mono text-xs text-[#292524] leading-relaxed">
          H. Altay Guvenir, Burak Acar, Gulsen Demiroz, Ayhan Cekin. <em>"A Supervised Machine Learning Algorithm for Arrhythmia Analysis."</em> Proceedings of the Computers in Cardiology Conference, Lund, Sweden, 1997.
        </div>
      </section>

      {/* SECTION 6: Strict Medical Disclaimer Notice */}
      <section className="p-5 bg-[#faf0ed] border border-[#eed4cb] rounded-xl space-y-2 text-[#73281c]">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-[#8c3b2d]" />
          <span>Clinical & Medical Practice Disclaimer</span>
        </div>
        <p className="text-xs font-sans leading-relaxed">
          This system is strictly developed as an academic machine learning evaluation environment. It is not approved by medical regulatory bodies (FDA, CE, or CDSCO) for clinical diagnostic use, screening, or medical treatment guidance. All cardiac evaluations require standard 12-lead ECG tracing interpreted by licensed medical practitioners and board-certified cardiologists.
        </p>
      </section>
    </div>
  );
}
