import React from 'react';
import { PredictionResult } from '../types';
import { ShieldCheck, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface ProbabilityMeterProps {
  prediction: PredictionResult;
}

export const ProbabilityMeter: React.FC<ProbabilityMeterProps> = ({ prediction }) => {
  const { probability, probabilityPercent, predictedClass, riskTier, confidenceScore } = prediction;

  // Arc stroke dash calculations for semi-circle gauge (radius = 70, arc = 180 deg)
  const radius = 68;
  const circumference = Math.PI * radius; // half circle length ~ 213.6
  const strokeDashoffset = circumference - (Math.min(probability, 1.0) * circumference);

  const getThemeColor = () => {
    if (probability >= 0.5) {
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        stroke: '#f43f5e',
        glow: 'shadow-rose-500/20',
      };
    }
    if (probability >= 0.25 || riskTier === 'Borderline / Subclinical') {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        stroke: '#f59e0b',
        glow: 'shadow-amber-500/20',
      };
    }
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      stroke: '#10b981',
      glow: 'shadow-emerald-500/20',
    };
  };

  const theme = getThemeColor();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Neural MLP Prediction
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-400 border border-slate-700">
          Threshold: 0.50
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-48 h-28 flex items-end justify-center">
          <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
            {/* Background Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#334155"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Active Colored Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={theme.stroke}
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Centered value readout */}
          <div className="absolute bottom-1 flex flex-col items-center text-center">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${theme.text}`}>
              {probabilityPercent.toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Probability of Hypothyroid
            </span>
          </div>
        </div>

        {/* Diagnostic classification pill */}
        <div className="mt-3 text-center space-y-1">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${theme.bg}`}>
            {predictedClass === 'Hypothyroid' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : riskTier === 'Borderline / Subclinical' ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>Outcome: {predictedClass}</span>
          </div>

          <div className="text-xs text-slate-400">
            Clinical Tier: <strong className="text-slate-200">{riskTier}</strong>
          </div>
        </div>
      </div>

      {/* Confidence & Model details */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block">Model Confidence</span>
          <span className="font-semibold text-white font-mono">
            {confidenceScore}% certainty
          </span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block">Loss Optimization</span>
          <span className="font-semibold text-teal-300 font-mono">
            pos_weight = 12.3
          </span>
        </div>
      </div>
    </div>
  );
};
