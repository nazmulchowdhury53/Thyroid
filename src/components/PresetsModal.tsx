import React from 'react';
import { PatientPreset } from '../types';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface PresetsModalProps {
  presets: PatientPreset[];
  onSelectPreset: (preset: PatientPreset) => void;
  onClose: () => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  presets,
  onSelectPreset,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Clinical & Benchmark Presets</h3>
              <p className="text-xs text-slate-400">
                Load authentic cases from the Colab notebook or clinical archetypes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards List */}
        <div className="space-y-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-teal-500/50 rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 pt-0.5">
                  <span>TSH: {preset.data.tsh} mIU/L</span>
                  <span>•</span>
                  <span>FTI: {preset.data.fti}</span>
                  <span>•</span>
                  <span>TT4: {preset.data.tt4} nmol/L</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm flex-shrink-0 transition-colors"
              >
                <span>Apply Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
