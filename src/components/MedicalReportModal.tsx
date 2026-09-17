import React from 'react';
import { PatientInput, PredictionResult } from '../types';
import { Printer, X, Activity, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

interface MedicalReportModalProps {
  input: PatientInput;
  prediction: PredictionResult;
  onClose: () => void;
}

export const MedicalReportModal: React.FC<MedicalReportModalProps> = ({
  input,
  prediction,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const { probabilityPercent, predictedClass, riskTier, biomarkers, keyFactors, clinicalRecommendations } =
    prediction;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-6 print:max-w-none print:shadow-none print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-bold text-slate-800">
              Clinical Assessment Report (Print Preview)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Report Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              ThyroidMLP Clinical Diagnostic Summary
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Deep Neural Network Classifier Evaluation • Trained on 4,316 Clinical Cohorts
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <div>Report Date: {new Date().toLocaleDateString()}</div>
            <div>Eval ID: EVAL-{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
          </div>
        </div>

        {/* Patient Profile & Demographics */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Patient Age</span>
            <span className="font-bold text-slate-800 text-sm">{input.age} Years</span>
          </div>
          <div>
            <span className="text-slate-500 block">Biological Sex</span>
            <span className="font-bold text-slate-800 text-sm">
              {input.sex === 0 ? 'Female (F=0)' : 'Male (M=1)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Relevant History Flags</span>
            <span className="font-medium text-slate-800">
              {input.thyroid_surgery ? 'Prior Thyroidectomy • ' : ''}
              {input.i131_treatment ? 'I-131 Ablation • ' : ''}
              {input.on_thyroxine ? 'On L-T4 • ' : ''}
              {input.pregnant ? 'Pregnant • ' : ''}
              {input.lithium ? 'Lithium Therapy • ' : ''}
              {!input.thyroid_surgery && !input.i131_treatment && !input.on_thyroxine && !input.pregnant && !input.lithium
                ? 'Unremarkable'
                : ''}
            </span>
          </div>
        </div>

        {/* Primary Model Diagnostic Outcome */}
        <div
          className={`p-4 rounded-xl border-2 flex items-center justify-between ${
            predictedClass === 'Hypothyroid'
              ? 'bg-rose-50 border-rose-400 text-rose-950'
              : riskTier === 'Borderline / Subclinical'
              ? 'bg-amber-50 border-amber-400 text-amber-950'
              : 'bg-emerald-50 border-emerald-400 text-emerald-950'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              Assessed Risk Classification
            </span>
            <h2 className="text-xl font-black mt-0.5 flex items-center gap-2">
              {predictedClass === 'Hypothyroid' ? (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              ) : riskTier === 'Borderline / Subclinical' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
              {predictedClass} ({riskTier})
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              Hypothyroid Probability
            </span>
            <span className="text-2xl font-black font-mono">
              {probabilityPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Biomarkers Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Serum Thyroid Hormone Profile
          </h3>
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th className="p-2.5">Biomarker Assay</th>
                <th className="p-2.5">Recorded Value</th>
                <th className="p-2.5">Reference Window</th>
                <th className="p-2.5">Assay Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-semibold">Thyroid Stimulating Hormone (TSH)</td>
                <td className="p-2.5 font-mono font-bold">{biomarkers.tsh.value.toFixed(2)} mIU/L</td>
                <td className="p-2.5 text-slate-600">{biomarkers.tsh.normalRange}</td>
                <td className="p-2.5 font-semibold capitalize">{biomarkers.tsh.status.replace('_', ' ')}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Free Thyroxine Index (FTI)</td>
                <td className="p-2.5 font-mono font-bold">{biomarkers.fti.value.toFixed(1)}</td>
                <td className="p-2.5 text-slate-600">{biomarkers.fti.normalRange}</td>
                <td className="p-2.5 font-semibold capitalize">{biomarkers.fti.status}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Total Thyroxine (TT4)</td>
                <td className="p-2.5 font-mono font-bold">{biomarkers.tt4.value.toFixed(1)} nmol/L</td>
                <td className="p-2.5 text-slate-600">{biomarkers.tt4.normalRange}</td>
                <td className="p-2.5 font-semibold capitalize">{biomarkers.tt4.status}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">T4 Uptake Ratio (T4U)</td>
                <td className="p-2.5 font-mono font-bold">{biomarkers.t4u.value.toFixed(2)}</td>
                <td className="p-2.5 text-slate-600">{biomarkers.t4u.normalRange}</td>
                <td className="p-2.5 font-semibold capitalize">{biomarkers.t4u.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contributing Determinants */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Primary Determinant Clinical Factors
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {keyFactors.map((f, i) => (
              <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>{f.label}</span>
                  <span className="font-mono">{f.value}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{f.clinicalNote}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Clinical Recommendations & Follow-Up Protocol
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-5">
            {clinicalRecommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-relaxed">
          <strong>Notice:</strong> This report is generated by ThyroidMLP (v1.2 PyTorch Deep Multi-Layer Perceptron), trained with class-weighted cross-entropy on clinical datasets. This system serves as clinical decision support for differential stratification and should be corroborated by comprehensive clinical examination and formal endocrinology consultation.
        </div>
      </div>
    </div>
  );
};
