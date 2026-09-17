import React from 'react';
import { BiomarkerStatus } from '../types';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BiomarkerGaugeProps {
  id: string;
  label: string;
  biomarker: BiomarkerStatus;
  min: number;
  max: number;
  step?: number;
  onChangeValue: (val: number) => void;
  onToggleMeasured: (measured: boolean) => void;
  infoTooltip: string;
}

export const BiomarkerGauge: React.FC<BiomarkerGaugeProps> = ({
  id,
  label,
  biomarker,
  min,
  max,
  step = 0.1,
  onChangeValue,
  onToggleMeasured,
  infoTooltip,
}) => {
  const { value, measured, unit, normalRange, status, clinicalMeaning } = biomarker;

  // Percentage position on range bar
  const clampedVal = Math.min(Math.max(value, min), max);
  const positionPercent = Math.round(((clampedVal - min) / (max - min)) * 100);

  const getStatusBadge = () => {
    if (!measured) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
          Not Measured (Median Imputed)
        </span>
      );
    }
    switch (status) {
      case 'severely_elevated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertCircle className="w-3 h-3" /> Severely Elevated
          </span>
        );
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" /> Elevated
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <AlertCircle className="w-3 h-3" /> Low
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <AlertTriangle className="w-3 h-3" /> High
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> Normal
          </span>
        );
    }
  };

  const getMarkerColor = () => {
    if (!measured) return 'bg-slate-400';
    if (status === 'severely_elevated') return 'bg-rose-500 ring-rose-300';
    if (status === 'elevated') return 'bg-amber-500 ring-amber-300';
    if (status === 'low') return 'bg-blue-500 ring-blue-300';
    if (status === 'high') return 'bg-purple-500 ring-purple-300';
    return 'bg-emerald-400 ring-emerald-200';
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5 space-y-2.5 transition-all hover:border-slate-600">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <label htmlFor={`input-${id}`} className="text-xs font-semibold text-slate-200 cursor-pointer">
              {label}
            </label>
            <span className="text-[11px] text-slate-400 font-mono">({unit})</span>
          </div>
          <p className="text-[11px] text-slate-400">Reference: {normalRange}</p>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <label className="flex items-center gap-1.5 text-xs text-slate-300 select-none cursor-pointer">
            <input
              type="checkbox"
              id={`check-${id}-measured`}
              checked={measured}
              onChange={(e) => onToggleMeasured(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-900"
            />
            <span className="text-[11px] text-slate-400">Measured</span>
          </label>
        </div>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="range"
            id={`slider-${id}`}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={!measured}
            onChange={(e) => onChangeValue(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400 disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 min-w-[90px] justify-between">
          <input
            type="number"
            id={`input-${id}`}
            min={min}
            max={max * 2}
            step={step}
            value={value}
            disabled={!measured}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChangeValue(val);
            }}
            className="w-14 bg-transparent text-right text-xs font-bold font-mono text-white focus:outline-none disabled:text-slate-500"
          />
          <span className="text-[10px] text-slate-500">{unit}</span>
        </div>
      </div>

      {/* Visual Range Indicator Bar */}
      <div className="space-y-1">
        <div className="relative w-full h-2 rounded-full bg-slate-700/80 overflow-hidden flex">
          {/* Visual colored zones */}
          <div className="h-full bg-blue-500/40 w-[20%]" title="Subnormal / Low" />
          <div className="h-full bg-emerald-500/40 w-[50%]" title="Normal Physiological Window" />
          <div className="h-full bg-amber-500/40 w-[15%]" title="Elevated / Borderline" />
          <div className="h-full bg-rose-500/40 w-[15%]" title="Severely Elevated" />
        </div>

        {/* Indicator marker pin */}
        <div className="relative w-full h-2">
          <div
            className={`absolute -top-1 w-2.5 h-2.5 rounded-full ring-2 shadow-sm transition-all -translate-x-1/2 ${getMarkerColor()}`}
            style={{ left: `${Math.min(Math.max(positionPercent, 2), 98)}%` }}
            title={`Current: ${value} ${unit}`}
          />
        </div>
      </div>

      {/* Clinical Meaning Tooltip Note */}
      <div className="text-[11px] text-slate-400 flex items-start gap-1 pt-0.5">
        <span className="text-slate-500 font-semibold">•</span>
        <span className="line-clamp-1 text-slate-300">{clinicalMeaning}</span>
      </div>
    </div>
  );
};
