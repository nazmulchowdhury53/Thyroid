import React from 'react';
import { PatientInput, BiomarkerStatus } from '../types';
import { BiomarkerGauge } from './BiomarkerGauge';
import {
  User,
  FlaskConical,
  FileBadge,
  Pill,
  Scissors,
  HelpCircle,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

interface PatientFormProps {
  input: PatientInput;
  onChangeInput: (newInput: PatientInput) => void;
  onReset: () => void;
  onOpenTestingReportModal?: () => void;
  biomarkers: {
    tsh: BiomarkerStatus;
    tt4: BiomarkerStatus;
    t4u: BiomarkerStatus;
    fti: BiomarkerStatus;
  };
}

export const PatientForm: React.FC<PatientFormProps> = ({
  input,
  onChangeInput,
  onReset,
  onOpenTestingReportModal,
  biomarkers,
}) => {
  const updateField = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    onChangeInput({
      ...input,
      [key]: value,
    });
  };

  const toggleFlag = (key: keyof PatientInput) => {
    const current = input[key];
    updateField(key, (current === 1 ? 0 : 1) as any);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            Patient Profile & Diagnostic Inputs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            25 Clinical & Laboratory Features for Hypothyroid Risk Calculation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenTestingReportModal && (
            <button
              type="button"
              id="btn-open-report-input"
              onClick={onOpenTestingReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm transition-all"
              title="Input values from a physical or digital lab report slip"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Input Testing Report Values</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            title="Reset all inputs to euthyroid baseline defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* 1. Demographics */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <FileBadge className="w-3.5 h-3.5 text-teal-400" />
          <span>1. Demographics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
          {/* Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="input-patient-age" className="text-xs font-semibold text-slate-200">
                Patient Age (Years)
              </label>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={input.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                  className="w-10 bg-transparent text-right text-xs font-mono font-bold text-teal-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">yrs</span>
              </div>
            </div>
            <input
              type="range"
              id="input-patient-age"
              min={5}
              max={95}
              step={1}
              value={input.age}
              onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 yrs</span>
              <span>Median: ~54</span>
              <span>95 yrs</span>
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 block">Biological Sex</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-sex-female"
                onClick={() => updateField('sex', 0)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  input.sex === 0
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>Female (F=0)</span>
                <span className="text-[10px] opacity-75 font-normal">70% dataset</span>
              </button>

              <button
                type="button"
                id="btn-sex-male"
                onClick={() => updateField('sex', 1)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  input.sex === 1
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>Male (M=1)</span>
                <span className="text-[10px] opacity-75 font-normal">30% dataset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Thyroid Hormone Biomarkers Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
            <span>2. Serum Laboratory Panel (Biomarkers)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Unchecking auto-imputes dataset median values
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* TSH */}
          <BiomarkerGauge
            id="tsh"
            label="Thyroid Stimulating Hormone (TSH)"
            biomarker={biomarkers.tsh}
            min={0.1}
            max={60.0}
            step={0.1}
            onChangeValue={(v) => updateField('tsh', v)}
            onToggleMeasured={(m) => updateField('tsh_measured', m ? 1 : 0)}
            infoTooltip="Normal reference range: 0.4 - 4.0 mIU/L"
          />

          {/* FTI */}
          <BiomarkerGauge
            id="fti"
            label="Free Thyroxine Index (FTI)"
            biomarker={biomarkers.fti}
            min={20.0}
            max={200.0}
            step={0.5}
            onChangeValue={(v) => updateField('fti', v)}
            onToggleMeasured={(m) => updateField('fti_measured', m ? 1 : 0)}
            infoTooltip="Normal reference range: 70 - 130"
          />

          {/* TT4 */}
          <BiomarkerGauge
            id="tt4"
            label="Total Thyroxine (TT4)"
            biomarker={biomarkers.tt4}
            min={20.0}
            max={220.0}
            step={1.0}
            onChangeValue={(v) => updateField('tt4', v)}
            onToggleMeasured={(m) => updateField('tt4_measured', m ? 1 : 0)}
            infoTooltip="Normal reference range: 60 - 150 nmol/L"
          />

          {/* T4U */}
          <BiomarkerGauge
            id="t4u"
            label="T4 Uptake Ratio (T4U)"
            biomarker={biomarkers.t4u}
            min={0.4}
            max={2.0}
            step={0.01}
            onChangeValue={(v) => updateField('t4u', v)}
            onToggleMeasured={(m) => updateField('t4u_measured', m ? 1 : 0)}
            infoTooltip="Normal reference range: 0.7 - 1.3"
          />
        </div>
      </div>

      {/* 3. Clinical History & Medical Flags (14 features) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Pill className="w-3.5 h-3.5 text-teal-400" />
            <span>3. Medical History & Clinical Flags</span>
          </div>
          <span className="text-[11px] text-slate-500">Toggle active clinical conditions</span>
        </div>

        {/* Section A: Medications */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Pill className="w-3 h-3" /> Pharmacotherapy:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'on_thyroxine', label: 'On Thyroxine', desc: 'Taking L-T4 medication' },
              { key: 'query_on_thyroxine', label: 'Query On Thyroxine', desc: 'Suspected substitution' },
              { key: 'on_antithyroid_medication', label: 'Antithyroid Meds', desc: 'e.g. Methimazole, PTU' },
              { key: 'lithium', label: 'Lithium Intake', desc: 'Blocks thyroid hormone release' },
            ].map((item) => {
              const active = input[item.key as keyof PatientInput] === 1;
              return (
                <button
                  key={item.key}
                  type="button"
                  id={`flag-${item.key}`}
                  onClick={() => toggleFlag(item.key as keyof PatientInput)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    active
                      ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-teal-400 shadow-sm shadow-teal-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section B: Interventions & Surgical */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Interventions & Surgical:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'thyroid_surgery', label: 'Thyroid Surgery', desc: 'Partial or total resection' },
              { key: 'i131_treatment', label: 'I-131 Treatment', desc: 'Radioactive iodine ablation' },
              { key: 'goitre', label: 'Goitre Present', desc: 'Enlarged thyroid gland' },
              { key: 'tumor', label: 'Thyroid Tumor', desc: 'Nodular or malignant lesion' },
            ].map((item) => {
              const active = input[item.key as keyof PatientInput] === 1;
              return (
                <button
                  key={item.key}
                  type="button"
                  id={`flag-${item.key}`}
                  onClick={() => toggleFlag(item.key as keyof PatientInput)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    active
                      ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-teal-400 shadow-sm shadow-teal-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section C: Clinical Queries & Systemic Conditions */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Diagnostic Queries & Systemic Flags:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { key: 'query_hypothyroid', label: 'Query Hypo', desc: 'Suspected hypothyroid' },
              { key: 'query_hyperthyroid', label: 'Query Hyper', desc: 'Suspected thyrotoxic' },
              { key: 'sick', label: 'Acute Sick', desc: 'Concurrent illness' },
              { key: 'pregnant', label: 'Pregnant', desc: 'Trimester elevation' },
              { key: 'hypopituitary', label: 'Hypopituitary', desc: 'Central axis deficit' },
              { key: 'psych', label: 'Psychiatric', desc: 'Affective/psych condition' },
            ].map((item) => {
              const active = input[item.key as keyof PatientInput] === 1;
              return (
                <button
                  key={item.key}
                  type="button"
                  id={`flag-${item.key}`}
                  onClick={() => toggleFlag(item.key as keyof PatientInput)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    active
                      ? 'bg-teal-500/20 border-teal-500/50 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-teal-400 shadow-sm shadow-teal-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
