import React, { useState } from 'react';
import { Activity, Radio, Play, Pause, RefreshCw } from 'lucide-react';

export default function EcgMonitor({ bpm = 72, lead = 'Lead II', mode = 'Normal' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedLead, setSelectedLead] = useState(lead);

  // Authentic Lead II P-Q-R-S-T wave vector coordinates
  // Repeat 2 full cardiac cycles across width 900
  const pathD = `
    M 0 50
    L 30 50
    C 40 50, 45 42, 55 42
    C 65 42, 70 50, 80 50
    L 110 50
    L 115 54
    L 125 10
    L 135 75
    L 142 50
    L 170 50
    C 185 50, 195 35, 210 35
    C 225 35, 235 50, 250 50
    L 360 50

    L 390 50
    C 400 50, 405 42, 415 42
    C 425 42, 430 50, 440 50
    L 470 50
    L 475 54
    L 485 10
    L 495 75
    L 502 50
    L 530 50
    C 545 50, 555 35, 570 35
    C 585 35, 595 50, 610 50
    L 720 50

    L 750 50
    C 760 50, 765 42, 775 42
    C 785 42, 790 50, 800 50
    L 830 50
    L 835 54
    L 845 10
    L 855 75
    L 862 50
    L 890 50
    L 900 50
  `;

  return (
    <div className="bg-white border border-[#e5dfd3] rounded-lg overflow-hidden shadow-xs">
      {/* Telemetry Header */}
      <div className="bg-[#fcfaf6] px-4 py-2.5 border-b border-[#e9e3d7] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
          <span className="font-mono font-bold text-[#1c1917] flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-[#8c3b2d]" />
            <span>CLINICAL TELEMETRY MONITOR</span>
          </span>
          <span className="font-mono text-[10px] text-[#8c857b] bg-[#f5f0e6] px-1.5 py-0.5 rounded border border-[#dfd7c5]">
            360 Hz Sampling
          </span>
        </div>

        {/* Clinical Controls & Calibration */}
        <div className="flex items-center space-x-3 font-mono text-[11px] text-[#57534e]">
          <div className="flex items-center space-x-1">
            <span className="text-[#8c857b]">LEAD:</span>
            <select
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="text-[11px] font-mono py-0.5 px-1.5 rounded border border-[#dfd7c5] bg-white text-[#1c1917]"
            >
              <option value="Lead II">Lead II (Standard)</option>
              <option value="Lead I">Lead I</option>
              <option value="Lead V1">Lead V1</option>
              <option value="Lead V5">Lead V5</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-[#8c857b]">
            <span>25 mm/s</span>
            <span>•</span>
            <span>10 mm/mV</span>
          </div>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-[#ded5c2]">
            <span className="animate-heart-pulse text-[#8c3b2d]">💓</span>
            <strong className="text-[#1c1917] font-mono">{bpm} BPM</strong>
          </div>
        </div>
      </div>

      {/* Oscilloscope ECG Tracing Canvas with Grid */}
      <div className="relative h-28 ecg-grid-paper overflow-hidden border-b border-[#e9e3d7]">
        {/* Animated Scanning Line */}
        {isPlaying && <div className="animate-scanline" />}

        {/* ECG SVG Vector Trace */}
        <svg
          viewBox="0 0 900 100"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Subtle Trace Glow Shadow */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(140, 59, 45, 0.25)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Primary Sharp ECG Wave Trace */}
          <path
            d={pathD}
            fill="none"
            stroke="#8c3b2d"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isPlaying ? 'animate-ecg-trace' : ''}
          />
        </svg>

        {/* Telemetry Axis Annotation */}
        <div className="absolute bottom-1 left-2 font-mono text-[9px] text-[#9c9384] tracking-wider select-none">
          P-WAVE / PR-INTERVAL / QRS-COMPLEX / ST-SEGMENT / T-WAVE
        </div>

        <div className="absolute top-1 right-2 font-mono text-[9px] text-[#9c9384] select-none">
          RHYTHM: {mode.toUpperCase()}
        </div>
      </div>

      {/* Monitor Legend & Calibration Strip */}
      <div className="bg-[#fcfbf9] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#78716c]">
        <div className="flex items-center space-x-4">
          <span>Signal Filter: <strong>0.5 – 40 Hz Bandpass</strong></span>
          <span className="hidden md:inline">ADC: <strong>12-bit</strong></span>
          <span className="hidden md:inline">Impedance: <strong>&lt; 5 kΩ</strong></span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-1 hover:text-[#1c1917] transition-colors"
          title={isPlaying ? 'Pause signal trace' : 'Resume signal trace'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 text-[#8c3b2d]" />
              <span>PAUSE TRACE</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-emerald-700" />
              <span>RESUME TRACE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

