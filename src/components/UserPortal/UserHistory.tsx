import React from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle2, ChevronRight, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { PatientRecord } from '../../types';

interface UserHistoryProps {
  records: PatientRecord[];
  onSelectRecord: (record: PatientRecord) => void;
  onDeleteRecord?: (id: string) => void;
  isAdmin?: boolean;
}

export const UserHistory: React.FC<UserHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  isAdmin = false,
}) => {
  if (records.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No Diagnostic Reports Stored</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Upload a medical report or test a sample scenario to generate and save your clinical cardiac predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isAdmin ? 'System Diagnostic Records' : 'My Clinical Report History'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {records.length} report {records.length === 1 ? 'assessment' : 'assessments'} recorded in database
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Saved Scans
        </span>
      </div>

      <div className="space-y-3">
        {records.map((record) => {
          const isPositive = record.prediction.hasDisease;

          return (
            <div
              key={record.id}
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 hover:border-slate-650 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isPositive
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isPositive ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm group-hover:text-rose-300 transition-colors">
                      {record.patientName}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPositive ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isPositive ? 'Disease Detected' : 'Normal / Low Risk'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      {record.patientSex}, {record.patientAge} yrs
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    {record.reportFileName && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-slate-400 text-[11px] truncate max-w-[160px]">
                          {record.reportFileName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side stats & action */}
              <div className="flex items-center space-x-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-sm font-bold text-white font-mono">{record.prediction.probability}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {record.prediction.riskLevel} Risk
                  </div>
                </div>

                <button
                  id={`view-record-btn-${record.id}`}
                  onClick={() => onSelectRecord(record)}
                  className="px-3 py-1.5 bg-slate-700/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {isAdmin && onDeleteRecord && (
                  <button
                    id={`delete-record-btn-${record.id}`}
                    onClick={() => onDeleteRecord(record.id)}
                    title="Delete Record"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
