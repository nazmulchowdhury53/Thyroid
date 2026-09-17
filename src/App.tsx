import React, { useState, useEffect, useMemo } from 'react';
import {
  PatientInput,
  PatientRecord,
  PatientPreset,
} from './types';
import {
  PATIENT_PRESETS,
  runThyroidMLP,
} from './data/modelWeights';
import { INITIAL_PATIENT_COHORT } from './data/patientCohort';
import { Navbar } from './components/Navbar';
import { PatientForm } from './components/PatientForm';
import { ProbabilityMeter } from './components/ProbabilityMeter';
import { DiagnosticResultCard } from './components/DiagnosticResultCard';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { CohortManagerView } from './components/CohortManagerView';
import { ColabCodeViewerModal } from './components/ColabCodeViewerModal';
import { PresetsModal } from './components/PresetsModal';
import { MedicalReportModal } from './components/MedicalReportModal';
import { InputTestingReportModal } from './components/InputTestingReportModal';
import {
  Sparkles,
  Info,
  CheckCircle2,
  Brain,
  ShieldCheck,
  RotateCcw,
  Zap,
  FileText,
} from 'lucide-react';

const STORAGE_KEY_COHORT = 'thyroidmlp_cohort_records_v1';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'calculator' | 'performance' | 'cohort' | 'code'>('calculator');

  // Active patient input state (Default to Colab Notebook Sample 1 for immediate validation)
  const [patientInput, setPatientInput] = useState<PatientInput>(() => {
    return PATIENT_PRESETS[0].data;
  });

  // Saved clinical patient cohort
  const [cohortRecords, setCohortRecords] = useState<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COHORT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading cohort storage:', e);
    }
    return INITIAL_PATIENT_COHORT;
  });

  // Modals state
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInputReportModal, setShowInputReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-sync cohort to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COHORT, JSON.stringify(cohortRecords));
    } catch (e) {
      console.error('Error saving cohort to storage:', e);
    }
  }, [cohortRecords]);

  // Real-time PyTorch MLP inference
  const currentPrediction = useMemo(() => {
    return runThyroidMLP(patientInput);
  }, [patientInput]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset to euthyroid normal baseline
  const handleResetForm = () => {
    setPatientInput(PATIENT_PRESETS[1].data);
    showToast('Reset form to normal euthyroid reference baseline');
  };

  // Select preset
  const handleSelectPreset = (preset: PatientPreset) => {
    setPatientInput(preset.data);
    showToast(`Loaded preset: ${preset.name}`);
  };

  // Apply testing report values from modal
  const handleApplyReportValues = (newInput: PatientInput) => {
    setPatientInput(newInput);
    setActiveTab('calculator');
    showToast(`Applied report values: TSH ${newInput.tsh} mIU/L, TT4 ${newInput.tt4} nmol/L`);
  };

  // Save current patient into cohort
  const handleSaveToCohort = () => {
    const newRecord: PatientRecord = {
      id: `rec_${Date.now()}`,
      patientCode: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: `Patient Assessment #${cohortRecords.length + 1}`,
      createdAt: new Date().toISOString(),
      input: { ...patientInput },
      prediction: currentPrediction,
      clinicalNotes: `Assessed via ThyroidMLP. Outcome: ${currentPrediction.predictedClass} (${currentPrediction.probabilityPercent}%).`,
    };

    setCohortRecords((prev) => [newRecord, ...prev]);
    showToast(`Saved assessment as ${newRecord.patientCode}`);
  };

  // Load record from cohort into form
  const handleLoadFromCohort = (record: PatientRecord) => {
    setPatientInput(record.input);
    setActiveTab('calculator');
    showToast(`Loaded ${record.patientCode} into diagnostic calculator`);
  };

  // Delete record from cohort
  const handleDeleteCohortRecord = (id: string) => {
    setCohortRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Record deleted from cohort');
  };

  // Export Cohort CSV
  const handleExportCSV = () => {
    const headers = [
      'Patient Code',
      'Created Date',
      'Age',
      'Sex (0=F 1=M)',
      'TSH (mIU/L)',
      'TT4 (nmol/L)',
      'T4U',
      'FTI',
      'On Thyroxine',
      'Thyroid Surgery',
      'I-131',
      'Predicted Class',
      'Probability (%)',
      'Risk Tier',
    ];

    const rows = cohortRecords.map((r) => [
      r.patientCode,
      r.createdAt.split('T')[0],
      r.input.age,
      r.input.sex,
      r.input.tsh,
      r.input.tt4,
      r.input.t4u,
      r.input.fti,
      r.input.on_thyroxine,
      r.input.thyroid_surgery,
      r.input.i131_treatment,
      r.prediction.predictedClass,
      r.prediction.probabilityPercent,
      `"${r.prediction.riskTier}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thyroidmlp_cohort_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported cohort spreadsheet (.CSV)');
  };

  // Export Cohort JSON
  const handleExportJSON = () => {
    const data = {
      model: 'ThyroidMLP v1.2',
      architecture: 'PyTorch 25-feature MLP with BCEWithLogitsLoss (pos_weight=12.308)',
      exportedAt: new Date().toISOString(),
      recordCount: cohortRecords.length,
      records: cohortRecords,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thyroidmlp_cohort_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported cohort JSON payload');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-teal-500 text-slate-950 px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setShowReportModal(true)}
        onOpenPresets={() => setShowPresetsModal(true)}
        onOpenInputReportModal={() => setShowInputReportModal(true)}
        savedCount={cohortRecords.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Model Status Sub-banner */}
        <div className="bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-cyan-950/40 border border-teal-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold border border-teal-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white flex items-center gap-2">
                PyTorch Neural Model Loaded & Scaled
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  Online
                </span>
              </span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                StandardScaler normalization: 25 features • Imbalanced BCE Loss weight:{' '}
                <strong className="text-teal-300 font-mono">12.308</strong> • Holdout ROC-AUC:{' '}
                <strong className="text-cyan-300 font-mono">0.9968</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setShowInputReportModal(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1.5"
              title="Input or paste testing report values"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Input Testing Report Values</span>
            </button>

            <button
              onClick={() => handleSelectPreset(PATIENT_PRESETS[0])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
              title="Cell 25 from notebook: Age 55 F, TSH 45, TT4 55 -> 99.15% Hypo"
            >
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Colab Sample 1 (99.15%)</span>
            </button>

            <button
              onClick={() => handleSelectPreset(PATIENT_PRESETS[1])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
              title="Healthy euthyroid control: TSH 1.8, TT4 105 -> Negative"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Normal Control</span>
            </button>

            <button
              onClick={() => handleSelectPreset(PATIENT_PRESETS[3])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
              title="Cell 26 from notebook: All flags positive but normal TSH -> 0.00% Negative"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Colab Cell 26 Run (0%)</span>
            </button>
          </div>
        </div>

        {/* View Switcher based on Active Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Form Input */}
            <div className="lg:col-span-7">
              <PatientForm
                input={patientInput}
                onChangeInput={setPatientInput}
                onReset={handleResetForm}
                onOpenTestingReportModal={() => setShowInputReportModal(true)}
                biomarkers={currentPrediction.biomarkers}
              />
            </div>

            {/* Right 5 Columns: Realtime Probability Gauge & Decision Support Output */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              <ProbabilityMeter prediction={currentPrediction} />

              <DiagnosticResultCard
                prediction={currentPrediction}
                input={patientInput}
                onSaveToCohort={handleSaveToCohort}
                onOpenReport={() => setShowReportModal(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'performance' && <ModelPerformanceView />}

        {activeTab === 'cohort' && (
          <CohortManagerView
            records={cohortRecords}
            onLoadPatient={handleLoadFromCohort}
            onDeletePatient={handleDeleteCohortRecord}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
          />
        )}

        {activeTab === 'code' && <ColabCodeViewerModal />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-400">
              ThyroidMLP Hypothyroidism Diagnostic System
            </span>
            <span>•</span>
            <span>Based on PyTorch Deep MLP & Combined UCI Thyroid Cohort</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">
              Test Accuracy: <strong>96.91%</strong> | ROC-AUC: <strong>0.9968</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Presets Modal */}
      {showPresetsModal && (
        <PresetsModal
          presets={PATIENT_PRESETS}
          onSelectPreset={handleSelectPreset}
          onClose={() => setShowPresetsModal(false)}
        />
      )}

      {/* Input Testing Report Values Modal */}
      {showInputReportModal && (
        <InputTestingReportModal
          currentInput={patientInput}
          onApplyReportValues={handleApplyReportValues}
          onClose={() => setShowInputReportModal(false)}
        />
      )}

      {/* Printable Clinical Report Modal */}
      {showReportModal && (
        <MedicalReportModal
          input={patientInput}
          prediction={currentPrediction}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
