import React, { useState, useMemo } from 'react';
import { PatientInput } from '../types';
import { runThyroidMLP } from '../data/modelWeights';
import {
  FileText,
  X,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  User,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Activity,
} from 'lucide-react';

interface InputTestingReportModalProps {
  currentInput: PatientInput;
  onApplyReportValues: (newInput: PatientInput) => void;
  onClose: () => void;
}

export const InputTestingReportModal: React.FC<InputTestingReportModalProps> = ({
  currentInput,
  onApplyReportValues,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'paste' | 'templates'>('form');
  
  // Working draft of report values
  const [reportValues, setReportValues] = useState<PatientInput>({ ...currentInput });

  // Paste raw report state
  const [rawReportText, setRawReportText] = useState<string>(
    'PATIENT LABORATORY REPORT\nAge: 55 | Sex: Female\nSerum Thyroid Hormone Profile:\n- TSH: 45.0 mIU/L (Ref: 0.40 - 4.00)\n- Free Thyroxine Index (FTI): 60.0 (Ref: 70 - 130)\n- Total Thyroxine (TT4): 55.0 nmol/L (Ref: 60 - 150)\n- T4 Uptake Ratio: 0.85 (Ref: 0.70 - 1.30)\nClinical History: No prior thyroidectomy, not currently on antithyroid medications.'
  );
  const [parseStatus, setParseStatus] = useState<{ count: number; fields: string[] } | null>(null);

  // Live prediction preview based on current modal values
  const previewPrediction = useMemo(() => {
    return runThyroidMLP(reportValues);
  }, [reportValues]);

  const updateField = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    setReportValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Parser function for pasted report text
  const handleParseReport = () => {
    const text = rawReportText;
    const extracted: Partial<PatientInput> = {};
    const foundFields: string[] = [];

    // Age
    const ageMatch = text.match(/(?:age\s*[:=-]?\s*|(\d{1,3})\s*(?:yo|y\/o|years|yrs))(\d{1,3})?/i);
    if (ageMatch) {
      const ageVal = parseInt(ageMatch[1] || ageMatch[2]);
      if (!isNaN(ageVal) && ageVal >= 1 && ageVal <= 110) {
        extracted.age = ageVal;
        foundFields.push(`Age: ${ageVal} yrs`);
      }
    }

    // Sex
    if (/(?:female|\bf\b|sex\s*[:=]\s*f)/i.test(text)) {
      extracted.sex = 0;
      foundFields.push('Sex: Female');
    } else if (/(?:male|\bm\b|sex\s*[:=]\s*m)/i.test(text)) {
      extracted.sex = 1;
      foundFields.push('Sex: Male');
    }

    // TSH
    const tshMatch = text.match(/(?:tsh|thyrotropin|thyroid\s*stimulating\s*hormone)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (tshMatch) {
      const val = parseFloat(tshMatch[1]);
      extracted.tsh = val;
      extracted.tsh_measured = 1;
      foundFields.push(`TSH: ${val} mIU/L`);
    }

    // TT4
    const tt4Match = text.match(/(?:tt4|total\s*t4|total\s*thyroxine)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (tt4Match) {
      const val = parseFloat(tt4Match[1]);
      extracted.tt4 = val;
      extracted.tt4_measured = 1;
      foundFields.push(`TT4: ${val} nmol/L`);
    }

    // T4U
    const t4uMatch = text.match(/(?:t4u|t4\s*uptake|thyroxine\s*uptake)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (t4uMatch) {
      const val = parseFloat(t4uMatch[1]);
      extracted.t4u = val;
      extracted.t4u_measured = 1;
      foundFields.push(`T4U: ${val}`);
    }

    // FTI
    const ftiMatch = text.match(/(?:fti|free\s*thyroxine\s*index)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (ftiMatch) {
      const val = parseFloat(ftiMatch[1]);
      extracted.fti = val;
      extracted.fti_measured = 1;
      foundFields.push(`FTI: ${val}`);
    }

    // Clinical history flags
    if (/thyroid\s*surgery|thyroidectomy|lobectomy/i.test(text) && !/no\s*thyroid\s*surgery|no\s*prior\s*thyroid/i.test(text)) {
      extracted.thyroid_surgery = 1;
      foundFields.push('Thyroid Surgery: Yes');
    }
    if (/on\s*thyroxine|levothyroxine|synthroid|eltroxin/i.test(text) && !/not\s*on\s*thyroxine|no\s*thyroxine/i.test(text)) {
      extracted.on_thyroxine = 1;
      foundFields.push('On Thyroxine: Yes');
    }
    if (/i-?131|radioiodine|iodine\s*131/i.test(text)) {
      extracted.i131_treatment = 1;
      foundFields.push('I-131 Treatment: Yes');
    }
    if (/pregnant|pregnancy/i.test(text) && !/not\s*pregnant/i.test(text)) {
      extracted.pregnant = 1;
      foundFields.push('Pregnant: Yes');
    }
    if (/lithium/i.test(text) && !/no\s*lithium/i.test(text)) {
      extracted.lithium = 1;
      foundFields.push('Lithium: Yes');
    }
    if (/antithyroid|methimazole|carbimazole|ptu|propylthiouracil/i.test(text) && !/not\s*on\s*antithyroid/i.test(text)) {
      extracted.on_antithyroid_medication = 1;
      foundFields.push('On Antithyroid Meds: Yes');
    }
    if (/goitre|goiter/i.test(text)) {
      extracted.goitre = 1;
      foundFields.push('Goitre: Yes');
    }
    if (/tumor|tumour|nodule/i.test(text)) {
      extracted.tumor = 1;
      foundFields.push('Thyroid Tumor/Nodule: Yes');
    }
    if (/sick|acute\s*illness|hospitalized/i.test(text)) {
      extracted.sick = 1;
      foundFields.push('Acute Illness: Yes');
    }

    if (foundFields.length > 0) {
      setReportValues((prev) => ({
        ...prev,
        ...extracted,
      }));
      setParseStatus({ count: foundFields.length, fields: foundFields });
    } else {
      setParseStatus({ count: 0, fields: [] });
    }
  };

  const handleApply = () => {
    onApplyReportValues(reportValues);
    onClose();
  };

  // Quick report templates
  const reportTemplates = [
    {
      id: 'cell25',
      title: 'Colab Notebook Cell 25 Test Sample',
      badge: '99.15% Hypothyroid',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Standard benchmark hypothyroid sample from the training notebook (TSH 45, TT4 55, FTI 60).',
      data: {
        age: 55,
        sex: 0 as const,
        tsh: 45.0,
        tsh_measured: 1 as const,
        tt4: 55.0,
        tt4_measured: 1 as const,
        t4u: 0.85,
        t4u_measured: 1 as const,
        fti: 60.0,
        fti_measured: 1 as const,
        t3_measured: 1 as const,
        on_thyroxine: 0 as const,
        query_on_thyroxine: 0 as const,
        on_antithyroid_medication: 0 as const,
        sick: 0 as const,
        pregnant: 0 as const,
        thyroid_surgery: 0 as const,
        i131_treatment: 0 as const,
        query_hypothyroid: 0 as const,
        query_hyperthyroid: 0 as const,
        lithium: 0 as const,
        goitre: 0 as const,
        tumor: 0 as const,
        hypopituitary: 0 as const,
        psych: 0 as const,
      },
    },
    {
      id: 'cell26',
      title: 'Colab Notebook Cell 26 Run Sample',
      badge: '0.00% Negative',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Edge case from notebook: Young male with positive history flags but normal euthyroid TSH (2.0) and TT4 (120).',
      data: {
        age: 12,
        sex: 1 as const,
        tsh: 2.0,
        tsh_measured: 1 as const,
        tt4: 120.0,
        tt4_measured: 1 as const,
        t4u: 1.3,
        t4u_measured: 1 as const,
        fti: 70.0,
        fti_measured: 1 as const,
        t3_measured: 1 as const,
        on_thyroxine: 1 as const,
        query_on_thyroxine: 1 as const,
        on_antithyroid_medication: 0 as const,
        sick: 1 as const,
        pregnant: 0 as const,
        thyroid_surgery: 1 as const,
        i131_treatment: 1 as const,
        query_hypothyroid: 1 as const,
        query_hyperthyroid: 1 as const,
        lithium: 1 as const,
        goitre: 1 as const,
        tumor: 1 as const,
        hypopituitary: 1 as const,
        psych: 1 as const,
      },
    },
    {
      id: 'subclinical',
      title: 'Subclinical Hypothyroidism Report',
      badge: 'Borderline Risk (~52%)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Mild compensatory TSH elevation (7.8 mIU/L) with preserved normal peripheral thyroid hormone levels.',
      data: {
        age: 48,
        sex: 0 as const,
        tsh: 7.8,
        tsh_measured: 1 as const,
        tt4: 98.0,
        tt4_measured: 1 as const,
        t4u: 0.95,
        t4u_measured: 1 as const,
        fti: 103.0,
        fti_measured: 1 as const,
        t3_measured: 1 as const,
        on_thyroxine: 0 as const,
        query_on_thyroxine: 0 as const,
        on_antithyroid_medication: 0 as const,
        sick: 0 as const,
        pregnant: 0 as const,
        thyroid_surgery: 0 as const,
        i131_treatment: 0 as const,
        query_hypothyroid: 1 as const,
        query_hyperthyroid: 0 as const,
        lithium: 0 as const,
        goitre: 0 as const,
        tumor: 0 as const,
        hypopituitary: 0 as const,
        psych: 0 as const,
      },
    },
    {
      id: 'post_op',
      title: 'Post-Thyroidectomy Clinical Lab Report',
      badge: 'High Risk (98.9%)',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Post-surgical thyroid ablation with markedly elevated TSH (38.5) and deficient thyroxine output.',
      data: {
        age: 63,
        sex: 0 as const,
        tsh: 38.5,
        tsh_measured: 1 as const,
        tt4: 42.0,
        tt4_measured: 1 as const,
        t4u: 0.82,
        t4u_measured: 1 as const,
        fti: 51.0,
        fti_measured: 1 as const,
        t3_measured: 1 as const,
        on_thyroxine: 0 as const,
        query_on_thyroxine: 0 as const,
        on_antithyroid_medication: 0 as const,
        sick: 0 as const,
        pregnant: 0 as const,
        thyroid_surgery: 1 as const,
        i131_treatment: 0 as const,
        query_hypothyroid: 1 as const,
        query_hyperthyroid: 0 as const,
        lithium: 0 as const,
        goitre: 0 as const,
        tumor: 0 as const,
        hypopituitary: 0 as const,
        psych: 0 as const,
      },
    },
    {
      id: 'euthyroid',
      title: 'Routine Normal Euthyroid Checkup',
      badge: '0.01% Negative',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Healthy adult profile with optimal pituitary-thyroid feedback axis (TSH 1.65, TT4 112, FTI 114).',
      data: {
        age: 32,
        sex: 0 as const,
        tsh: 1.65,
        tsh_measured: 1 as const,
        tt4: 112.0,
        tt4_measured: 1 as const,
        t4u: 0.98,
        t4u_measured: 1 as const,
        fti: 114.0,
        fti_measured: 1 as const,
        t3_measured: 1 as const,
        on_thyroxine: 0 as const,
        query_on_thyroxine: 0 as const,
        on_antithyroid_medication: 0 as const,
        sick: 0 as const,
        pregnant: 0 as const,
        thyroid_surgery: 0 as const,
        i131_treatment: 0 as const,
        query_hypothyroid: 0 as const,
        query_hyperthyroid: 0 as const,
        lithium: 0 as const,
        goitre: 0 as const,
        tumor: 0 as const,
        hypopituitary: 0 as const,
        psych: 0 as const,
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Input Testing & Lab Report Values
              </h2>
              <p className="text-xs text-slate-400">
                Type exact numerical report values, paste a patient lab requisition slip, or select verified benchmark cases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'form'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Direct Numeric Entry</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'paste'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Paste / Parse Lab Text</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'templates'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Colab & Clinical Reports ({reportTemplates.length})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: DIRECT NUMERIC ENTRY */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              {/* Patient Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Patient Age (Years)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={105}
                      value={reportValues.age}
                      onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('sex', 0)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        reportValues.sex === 0
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      Female (0)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('sex', 1)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        reportValues.sex === 1
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      Male (1)
                    </button>
                  </div>
                </div>
              </div>

              {/* Lab Biomarkers Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Serum Laboratory Biomarkers
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* TSH */}
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-white">TSH (Thyrotropin)</label>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: 0.40 - 4.00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.1}
                        min={0.01}
                        max={150}
                        value={reportValues.tsh}
                        onChange={(e) => updateField('tsh', parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">mIU/L</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          reportValues.tsh > 10
                            ? 'text-rose-400'
                            : reportValues.tsh > 4.0
                            ? 'text-amber-400'
                            : reportValues.tsh < 0.4
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {reportValues.tsh > 10
                          ? 'Severely Elevated'
                          : reportValues.tsh > 4.0
                          ? 'Elevated'
                          : reportValues.tsh < 0.4
                          ? 'Suppressed / Low'
                          : 'Normal Range'}
                      </span>
                    </div>
                  </div>

                  {/* TT4 */}
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-white">TT4 (Total Thyroxine)</label>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: 60 - 150</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={1}
                        min={5}
                        max={300}
                        value={reportValues.tt4}
                        onChange={(e) => updateField('tt4', parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">nmol/L</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          reportValues.tt4 < 60
                            ? 'text-rose-400'
                            : reportValues.tt4 > 150
                            ? 'text-purple-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {reportValues.tt4 < 60 ? 'Subnormal / Low' : reportValues.tt4 > 150 ? 'Elevated' : 'Normal Range'}
                      </span>
                    </div>
                  </div>

                  {/* FTI */}
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-white">FTI (Free Thyroxine Index)</label>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: 70 - 130</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={1}
                        min={10}
                        max={260}
                        value={reportValues.fti}
                        onChange={(e) => updateField('fti', parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">index</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          reportValues.fti < 70
                            ? 'text-rose-400'
                            : reportValues.fti > 130
                            ? 'text-purple-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {reportValues.fti < 70 ? 'Low Free T4' : reportValues.fti > 130 ? 'Elevated' : 'Normal Range'}
                      </span>
                    </div>
                  </div>

                  {/* T4U */}
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-white">T4U (Thyroxine Uptake Ratio)</label>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: 0.70 - 1.30</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.01}
                        min={0.3}
                        max={2.5}
                        value={reportValues.t4u}
                        onChange={(e) => updateField('t4u', parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">ratio</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          reportValues.t4u < 0.7 || reportValues.t4u > 1.3
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {reportValues.t4u < 0.7 ? 'Low Binding' : reportValues.t4u > 1.3 ? 'High Binding' : 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Clinical History Flags */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                  Pertinent Clinical History Flags (from Requisition / Intake)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'on_thyroxine', label: 'On Thyroxine (L-T4)' },
                    { key: 'thyroid_surgery', label: 'Prior Thyroid Surgery' },
                    { key: 'i131_treatment', label: 'I-131 Ablation' },
                    { key: 'pregnant', label: 'Currently Pregnant' },
                    { key: 'on_antithyroid_medication', label: 'Antithyroid Drugs' },
                    { key: 'lithium', label: 'Lithium Therapy' },
                    { key: 'goitre', label: 'Goitre Present' },
                    { key: 'tumor', label: 'Thyroid Tumor/Nodule' },
                    { key: 'sick', label: 'Acute Systemic Illness' },
                  ].map(({ key, label }) => {
                    const isChecked = reportValues[key as keyof PatientInput] === 1;
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            updateField(key as keyof PatientInput, (e.target.checked ? 1 : 0) as any)
                          }
                          className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400"
                        />
                        <span className="text-[11px] font-medium leading-tight">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE LAB TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Extract Values from Lab Text or Electronic Medical Record
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste raw text from a laboratory testing report, hospital EHR note, or physician dictation.
                  The parser automatically scans for age, sex, TSH, TT4, FTI, T4U, and medical history keywords.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-200">Raw Lab Report / Text Snippet</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRawReportText(
                          'Patient 55 years old Female. Serum Thyroid Profile: TSH = 45.0 mIU/L, TT4 = 55.0 nmol/L, FTI = 60.0, T4U = 0.85. No thyroid surgery, no antithyroid medications.'
                        )
                      }
                      className="text-[10px] text-teal-400 hover:underline"
                    >
                      Load Sample Lab Slip
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRawReportText(
                          'Age: 12, Sex: Male. History: on thyroxine, prior thyroid surgery, I131 treatment, sick. Thyroid panel: TSH: 2.0 mIU/L, TT4: 120 nmol/L, T4U: 1.3, FTI: 70.'
                        )
                      }
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Load Notebook Case 2
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={rawReportText}
                  onChange={(e) => setRawReportText(e.target.value)}
                  placeholder="Paste laboratory requisition notes here, e.g. TSH: 45.0 mIU/L, TT4: 55, Age: 55, Sex: F..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-teal-300 font-mono focus:outline-none focus:border-teal-500 shadow-inner leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleParseReport}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse & Extract Lab Values</span>
                </button>

                {parseStatus && (
                  <div className="text-xs flex items-center gap-1.5">
                    {parseStatus.count > 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Successfully extracted {parseStatus.count} fields!
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        No recognized biomarker keywords found.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {parseStatus && parseStatus.fields.length > 0 && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-teal-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-teal-300">Extracted Values:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {parseStatus.fields.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/40 text-xs font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BENCHMARK & NOTEBOOK TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select one of the verified testing cases from the PyTorch research dataset or standard endocrinology scenarios:
              </p>

              <div className="space-y-2.5">
                {reportTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setReportValues({ ...t.data })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      reportValues.tsh === t.data.tsh && reportValues.age === t.data.age
                        ? 'bg-teal-500/15 border-teal-500 shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70 hover:border-slate-600'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{t.title}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                          {t.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.description}</p>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-0.5">
                        <span>Age: {t.data.age}</span>
                        <span>•</span>
                        <span>TSH: {t.data.tsh}</span>
                        <span>•</span>
                        <span>TT4: {t.data.tt4}</span>
                        <span>•</span>
                        <span>FTI: {t.data.fti}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportValues({ ...t.data });
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-teal-300 border border-teal-500/30 hover:bg-teal-500 hover:text-slate-950 transition-colors flex-shrink-0"
                    >
                      Select Case
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Model Outcome Preview & Action Footer */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Activity className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Live PyTorch MLP Assessment Preview
                </span>
                <span className="text-white font-semibold">
                  Classification:{' '}
                  <strong
                    className={
                      previewPrediction.predictedClass === 'Hypothyroid'
                        ? 'text-rose-400'
                        : previewPrediction.riskTier === 'Borderline / Subclinical'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {previewPrediction.predictedClass}
                  </strong>{' '}
                  ({previewPrediction.probabilityPercent.toFixed(1)}% probability)
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-400">
              <span>TSH: {reportValues.tsh} | FTI: {reportValues.fti}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-lg shadow-teal-500/25 transition-all"
            >
              <span>Apply Report Values to Model</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
