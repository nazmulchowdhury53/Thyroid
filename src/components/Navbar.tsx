import React from 'react';
import { Activity, Brain, Database, Code, FileText, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'performance' | 'cohort' | 'code';
  setActiveTab: (tab: 'calculator' | 'performance' | 'cohort' | 'code') => void;
  onOpenReport: () => void;
  onOpenPresets: () => void;
  onOpenInputReportModal?: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenPresets,
  onOpenInputReportModal,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  ThyroidMLP
                  <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium border border-teal-500/30">
                    Clinical AI
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Deep Neural Net Hypothyroidism Assessment • PyTorch MLP
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
            <button
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Diagnostic Assessment</span>
            </button>

            <button
              id="tab-performance"
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'performance'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Model Metrics</span>
              <span className="hidden md:inline text-[10px] px-1 py-0.2 rounded bg-slate-900/60 text-teal-300">
                96.9% Acc
              </span>
            </button>

            <button
              id="tab-cohort"
              onClick={() => setActiveTab('cohort')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cohort'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cohort Records</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Colab Script</span>
              <span className="sm:hidden">Code</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {onOpenInputReportModal && (
              <button
                id="btn-input-report"
                onClick={onOpenInputReportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm transition-all"
                title="Input values from a physical or digital lab testing report"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Input Testing Report</span>
              </button>
            )}

            <button
              id="btn-presets"
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition-colors"
              title="Load benchmark patient cases"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clinical Presets</span>
            </button>

            <button
              id="btn-report"
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-sm transition-all"
              title="Generate printable clinical evaluation report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
