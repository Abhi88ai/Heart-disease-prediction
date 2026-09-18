import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { PatientRecord } from '../../types';

interface AdminDashboardProps {
  records: PatientRecord[];
  onSelectRecord: (record: PatientRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewDiagnostic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onNewDiagnostic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'positive' | 'negative' | 'critical'>('all');

  // Compute aggregate metrics
  const total = records.length;
  const positiveCount = records.filter((r) => r.prediction.hasDisease).length;
  const negativeCount = total - positiveCount;
  const positiveRate = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const criticalCount = records.filter((r) => r.prediction.riskLevel === 'Critical').length;
  const avgAge = total > 0 ? Math.round(records.reduce((acc, r) => acc + r.patientAge, 0) / total) : 0;

  // Filtered records
  const filtered = records.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.reportFileName && r.reportFileName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'positive') return r.prediction.hasDisease;
    if (filterStatus === 'negative') return !r.prediction.hasDisease;
    if (filterStatus === 'critical') return r.prediction.riskLevel === 'Critical';
    return true;
  });

  const exportCSV = () => {
    const headers = [
      'Patient ID',
      'Name',
      'Age',
      'Sex',
      'Resting BP',
      'Cholesterol',
      'Chest Pain Type',
      'Max HR',
      'ST Depression',
      'Major Vessels',
      'Disease Detected',
      'Risk Level',
      'Probability (%)',
      'Date',
    ];

    const rows = records.map((r) => [
      r.id,
      `"${r.patientName}"`,
      r.patientAge,
      r.patientSex,
      r.inputData.trestbps,
      r.inputData.chol,
      r.inputData.cp,
      r.inputData.thalach,
      r.inputData.oldpeak,
      r.inputData.ca,
      r.prediction.hasDisease ? 'YES' : 'NO',
      r.prediction.riskLevel,
      r.prediction.probability,
      new Date(r.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cardioscan_patient_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Cardiology Administration Portal</span>
            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-semibold">
              Clinical Control Center
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time patient monitoring, report records registry, and machine learning diagnostic oversight.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="admin-export-csv-btn"
            onClick={exportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            id="admin-new-diagnostic-btn"
            onClick={onNewDiagnostic}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg shadow-indigo-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Run New Diagnostic</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Evaluated</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Clinical records</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Disease Positive</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{positiveCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{positiveRate}% positivity rate</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Normal / Healthy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{negativeCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{100 - positiveRate}% clearance</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Critical Alerts</span>
            <HeartPulse className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{criticalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Urgent intervention</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Age</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300 font-mono mt-1">{avgAge} <span className="text-xs font-normal text-slate-400">yrs</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cleveland cohort baseline</div>
        </div>
      </div>

      {/* Patient Records Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name or report file..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setFilterStatus('positive')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'positive'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-400 hover:text-rose-300 bg-slate-800'
              }`}
            >
              Disease ({positiveCount})
            </button>
            <button
              onClick={() => setFilterStatus('negative')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'negative'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-400 hover:text-emerald-300 bg-slate-800'
              }`}
            >
              Normal ({negativeCount})
            </button>
            <button
              onClick={() => setFilterStatus('critical')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'critical'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400 hover:text-amber-300 bg-slate-800'
              }`}
            >
              Critical ({criticalCount})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-3.5">Patient Details</th>
                <th className="py-3 px-3">Vitals (BP / Chol)</th>
                <th className="py-3 px-3">ECG & Stress (Oldpeak / HR)</th>
                <th className="py-3 px-3">Vessels (ca)</th>
                <th className="py-3 px-3">Diagnostic Verdict</th>
                <th className="py-3 px-3">Probability</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((record) => {
                const isPositive = record.prediction.hasDisease;

                return (
                  <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3.5">
                      <div className="font-semibold text-white">{record.patientName}</div>
                      <div className="text-[11px] text-slate-400">
                        {record.patientSex} • {record.patientAge}y • {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div>
                        BP: <span className={record.inputData.trestbps >= 140 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{record.inputData.trestbps}</span> mmHg
                      </div>
                      <div className="text-[11px]">
                        Chol: <span className={record.inputData.chol >= 240 ? 'text-rose-400 font-bold' : 'text-slate-400'}>{record.inputData.chol}</span> mg/dl
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div>
                        Oldpeak: <span className={record.inputData.oldpeak >= 1.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{record.inputData.oldpeak}</span> mm
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Max HR: {record.inputData.thalach} bpm
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        record.inputData.ca > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {record.inputData.ca} vessels
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPositive
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isPositive ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        <span>{isPositive ? 'Heart Disease Detected' : 'Normal / Healthy'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {record.prediction.probability}%
                    </td>

                    <td className="py-3.5 px-3.5 text-right space-x-1">
                      <button
                        onClick={() => onSelectRecord(record)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        title="Delete patient record"
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching patient records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
