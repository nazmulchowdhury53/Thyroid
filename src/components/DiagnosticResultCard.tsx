import React, { useState } from 'react';
import { PredictionResult, PatientInput } from '../types';
import {
  FileText,
  BookmarkPlus,
  Check,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Info,
} from 'lucide-react';

interface DiagnosticResultCardProps {
  prediction: PredictionResult;
  input: PatientInput;
  onSaveToCohort: () => void;
  onOpenReport: () => void;
  isSaved?: boolean;
}

export const DiagnosticResultCard: React.FC<DiagnosticResultCardProps> = ({
  prediction,
  onSaveToCohort,
  onOpenReport,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { probabilityPercent, predictedClass, riskTier, keyFactors, clinicalRecommendations } = prediction;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(prediction, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Clinical Decision Support Analysis</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated by 25-feature Deep ThyroidMLP Neural Architecture
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveToCohort}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSaved
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved to Records' : 'Save Patient Record'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Primary Interpretation */}
      <div
        className={`p-4 rounded-xl border ${
          predictedClass === 'Hypothyroid'
            ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
            : riskTier === 'Borderline / Subclinical'
            ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
              Diagnostic Verdict
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {predictedClass === 'Hypothyroid'
                ? 'High Likelihood of Primary Hypothyroidism'
                : riskTier === 'Borderline / Subclinical'
                ? 'Subclinical Thyroid Dysfunction Suspected'
                : 'Normal Euthyroid Pattern Detected'}
            </h4>
            <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
              {predictedClass === 'Hypothyroid'
                ? `Model output yields a ${probabilityPercent}% probability of overt hypothyroidism, primarily driven by impaired peripheral thyroid hormone synthesis and compensatory TSH surge.`
                : riskTier === 'Borderline / Subclinical'
                ? `TSH or history indices suggest mild early thyroid stress (${probabilityPercent}%), while active circulating hormone levels remain partially compensated.`
                : `Thyroid panel and clinical flags are consistent with an intact hypothalamic-pituitary-thyroid axis (${probabilityPercent}% hypothyroid probability).`}
            </p>
          </div>
        </div>
      </div>

      {/* Key Influencing Factors (SHAP/Attribution approximation) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            Key Determinant Factors (Feature Importance)
          </span>
          <span className="text-[11px] text-slate-500">Relative impact on logit score</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {keyFactors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">{factor.label}</span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    factor.direction === 'increases_risk'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {factor.direction === 'increases_risk' ? (
                    <>
                      <TrendingUp className="w-3 h-3" /> Increases Risk
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" /> Decreases Risk
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{factor.clinicalNote}</span>
                <span className="font-mono font-bold text-slate-300 ml-2">{factor.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence-Based Clinical Recommendations */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
          Clinical Management & Action Protocol
        </span>

        <ul className="space-y-2">
          {clinicalRecommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800"
            >
              <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer tool button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleCopyJson}
          className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
          <span>{copied ? 'Copied JSON payload' : 'Copy diagnostic payload (JSON)'}</span>
        </button>
      </div>
    </div>
  );
};
