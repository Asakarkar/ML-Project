import React from 'react';
import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  FileCheck2,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  backendStatus,
  onRefreshStatus,
  isRefreshing,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'predict',
      label: 'Predict',
      icon: Stethoscope,
      badge: !backendStatus.modelAvailable ? 'Offline' : null,
    },
    {
      id: 'results',
      label: 'Results',
      icon: FileCheck2,
    },
    {
      id: 'about',
      label: 'About',
      icon: BookOpen,
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#fcfaf6] border-r border-[#e7e1d4] flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Section with scroll support if needed */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="p-5 border-b border-[#e7e1d4] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#ede7d8] border border-[#dcd4c2] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#8c3b2d]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-sm font-bold tracking-wider text-[#1c1917] uppercase">
                  CardioPulse
                </span>
                <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#f3ece0] text-[#8c3b2d] font-bold border border-[#e2d7c5]">
                  v2.4
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8c857b] uppercase tracking-wider">
                ECG Diagnostics
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-xs font-mono transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1c1917] font-bold shadow-2xs border border-[#ded5c2]'
                    : 'text-[#665f55] hover:text-[#1c1917] hover:bg-[#f3ede1]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#8c3b2d]' : 'text-[#8c857b]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#eee8da] text-[#706757] border border-[#ded5c2]">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8c3b2d]" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Minimal Footer Status Bar - pinned securely to the very bottom */}
      <div className="shrink-0 p-3.5 border-t border-[#e7e1d4] bg-[#f9f6f0] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.online && backendStatus.modelAvailable
                ? 'bg-emerald-600'
                : 'bg-amber-600'
            }`}
          />
          <span className="text-[#44403c] font-medium">
            {backendStatus.online ? 'Online' : 'Offline'} • 80.22%
          </span>
        </div>

        <button
          onClick={onRefreshStatus}
          disabled={isRefreshing}
          title="Refresh backend status"
          className="p-1 text-[#8c857b] hover:text-[#1c1917] hover:bg-[#ede7d8] rounded transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </aside>
  );
}
