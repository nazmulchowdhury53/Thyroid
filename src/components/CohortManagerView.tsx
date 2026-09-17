import React, { useState } from 'react';
import { PatientRecord } from '../types';
import {
  Search,
  Download,
  Trash2,
  Eye,
  ArrowRight,
  Filter,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

interface CohortManagerViewProps {
  records: PatientRecord[];
  onLoadPatient: (record: PatientRecord) => void;
  onDeletePatient: (id: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const CohortManagerView: React.FC<CohortManagerViewProps> = ({
  records,
  onLoadPatient,
  onDeletePatient,
  onExportCSV,
  onExportJSON,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<'all' | 'Hypothyroid' | 'Negative' | 'Borderline'>('all');
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);

  const filteredRecords = records.filter((rec) => {
    const matchesQuery =
      rec.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.patientName && rec.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.clinicalNotes && rec.clinicalNotes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (filterClass === 'Hypothyroid') {
      return rec.prediction.predictedClass === 'Hypothyroid';
    }
    if (filterClass === 'Negative') {
      return rec.prediction.predictedClass === 'Negative';
    }
    if (filterClass === 'Borderline') {
      return rec.prediction.riskTier === 'Borderline / Subclinical';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Cohort Assessment Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, inspect, export, and load historical patient diagnostic profiles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition-colors"
              title="Download cohort as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors"
              title="Download cohort as JSON payload"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-cohort-search"
              placeholder="Search by patient code, name, or clinical notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['all', 'Hypothyroid', 'Negative', 'Borderline'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterClass(cat)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterClass === cat
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Records' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Patient Code</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Key Lab Values</th>
                <th className="py-3 px-4">Model Probability</th>
                <th className="py-3 px-4">Diagnostic Verdict</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching patient profiles found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const { input, prediction } = record;
                  const isHypo = prediction.predictedClass === 'Hypothyroid';
                  const isBorderline = prediction.riskTier === 'Borderline / Subclinical';

                  return (
                    <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Patient Identifier */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-mono">{record.patientCode}</div>
                        {record.patientName && (
                          <div className="text-[11px] text-slate-400">{record.patientName}</div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {input.age} yrs, {input.sex === 0 ? 'Female' : 'Male'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {input.thyroid_surgery ? '• Prior Surgery ' : ''}
                          {input.on_thyroxine ? '• On L-T4 ' : ''}
                          {input.pregnant ? '• Pregnant ' : ''}
                          {!input.thyroid_surgery && !input.on_thyroxine && !input.pregnant ? 'Standard history' : ''}
                        </div>
                      </td>

                      {/* Labs */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>
                          TSH: <span className={input.tsh > 4 ? 'text-amber-300 font-bold' : 'text-slate-300'}>{input.tsh.toFixed(1)}</span> mIU/L
                        </div>
                        <div className="text-[10px] text-slate-400">
                          FTI: {input.fti.toFixed(1)} | TT4: {input.tt4.toFixed(1)}
                        </div>
                      </td>

                      {/* Probability */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={
                            isHypo
                              ? 'text-rose-400'
                              : isBorderline
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {prediction.probabilityPercent.toFixed(1)}%
                        </span>
                      </td>

                      {/* Verdict Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            isHypo
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : isBorderline
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isHypo ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : isBorderline ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>{prediction.predictedClass}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onLoadPatient(record)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 transition-all"
                            title="Load values into diagnostic form"
                          >
                            <span>Load</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => onDeletePatient(record.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal if open */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold block">
                  {selectedRecord.patientCode}
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedRecord.patientName || 'Patient Record Inspection'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Content summary */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Model Diagnostic Outcome
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {selectedRecord.prediction.predictedClass} (
                    {selectedRecord.prediction.probabilityPercent.toFixed(1)}%)
                  </span>
                  <span className="text-xs text-teal-300 font-medium">
                    {selectedRecord.prediction.riskTier}
                  </span>
                </div>
              </div>

              {/* Lab table */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">TSH Level</span>
                  <span className="font-mono font-bold text-white">
                    {selectedRecord.input.tsh} mIU/L
                  </span>
                </div>
                <div className="bg-slate-800/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Free Thyroxine Index</span>
                  <span className="font-mono font-bold text-white">
                    {selectedRecord.input.fti}
                  </span>
                </div>
                <div className="bg-slate-800/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Total T4 (TT4)</span>
                  <span className="font-mono font-bold text-white">
                    {selectedRecord.input.tt4} nmol/L
                  </span>
                </div>
                <div className="bg-slate-800/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">T4 Uptake Ratio</span>
                  <span className="font-mono font-bold text-white">
                    {selectedRecord.input.t4u}
                  </span>
                </div>
              </div>

              {/* Clinical Notes */}
              {selectedRecord.clinicalNotes && (
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    Physician Remarks:
                  </span>
                  <p>{selectedRecord.clinicalNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLoadPatient(selectedRecord);
                  setSelectedRecord(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 flex items-center gap-1"
              >
                <span>Load into Form</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
