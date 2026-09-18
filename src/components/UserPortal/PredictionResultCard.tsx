import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  Activity,
  Download,
  Share2,
  Calendar,
  User,
  FileCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  BookmarkPlus,
  Stethoscope,
} from 'lucide-react';
import { PredictionResult, HeartDiseaseInput } from '../../types';

interface PredictionResultCardProps {
  prediction: PredictionResult;
  patientName: string;
  patientAge: number;
  patientSex: 'Male' | 'Female';
  inputData: HeartDiseaseInput;
  reportFileName?: string;
  onSaveRecord?: () => void;
  isSaved?: boolean;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  patientName,
  patientAge,
  patientSex,
  inputData,
  reportFileName,
  onSaveRecord,
  isSaved = false,
}) => {
  const isPositive = prediction.hasDisease;
  const isCritical = prediction.riskLevel === 'Critical';
  const isModerate = prediction.riskLevel === 'Moderate';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="prediction-result-container"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background status glow */}
      <div
        className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isPositive ? 'bg-rose-600/15' : 'bg-emerald-500/15'
        }`}
      />

      {/* Top Patient Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
            {patientName ? patientName.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{patientName}</div>
            <div className="text-slate-400">
              {patientSex} • {patientAge} Years Old • Report: {reportFileName || 'Clinical Diagnostic'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Model:</span>
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700/60">
            K-NN & RF Ensemble (87.4% Recall)
          </span>
          <button
            onClick={handlePrint}
            title="Print Clinical Summary"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors ml-2"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Diagnosis Verdict Banner */}
      <div
        id="diagnosis-verdict-banner"
        className={`rounded-2xl p-6 sm:p-8 border-2 transition-all shadow-xl relative overflow-hidden ${
          isPositive
            ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/40 border-rose-500 shadow-rose-950/50'
            : 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/40 border-emerald-500 shadow-emerald-950/50'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span
                className={`p-2 rounded-xl flex items-center justify-center ${
                  isPositive ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isPositive ? <AlertTriangle className="w-6 h-6 animate-bounce" /> : <CheckCircle2 className="w-6 h-6" />}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  isPositive
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                Official Diagnostic Verdict
              </span>
            </div>

            <div className="pt-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {isPositive ? (
                  <span className="text-rose-400">HEART DISEASE DETECTED: YES</span>
                ) : (
                  <span className="text-emerald-400">HEART DISEASE DETECTED: NO</span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
                {isPositive
                  ? 'Based on uploaded diagnostic report biomarkers, the clinical ensemble classifier detects strong pathological indicators of coronary artery disease.'
                  : 'Based on uploaded diagnostic report biomarkers, cardiovascular metrics fall within healthy normal parameters. Low cardiac disease probability.'}
              </p>
            </div>
          </div>

          {/* Probability & Risk Level Gauge */}
          <div className="flex items-center space-x-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-750 shrink-0">
            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isPositive ? 'text-rose-500' : 'text-emerald-400'}
                  strokeDasharray={`${prediction.probability}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white">{prediction.probability}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Risk</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-400">Risk Assessment</div>
              <div
                className={`text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded text-center ${
                  isCritical
                    ? 'bg-rose-600 text-white'
                    : isPositive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isModerate
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {prediction.riskLevel} Risk
              </div>
              <div className="text-[10px] text-slate-400">Confidence: {prediction.confidenceScore}%</div>
            </div>
          </div>
        </div>

        {/* Action button inside banner */}
        {onSaveRecord && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diagnostic calculated and verified by Cleveland Heart Disease ML rules</span>
            </span>
            <button
              id="save-to-records-btn"
              onClick={onSaveRecord}
              disabled={isSaved}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                isSaved
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 shadow-md'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to Patient History' : 'Save Diagnostic to Records'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid: Contributing Biomarkers & Key Clinical Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Key Risk Factors Identified */}
        <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Key Clinical Factors Evaluated</span>
            </h3>
            <span className="text-[11px] text-slate-400">13 Cleveland Predictors</span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {prediction.keyFactors.map((kf, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-800 border border-slate-700/60 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{kf.factor}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{kf.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-medium text-white">{kf.value}</div>
                  <span
                    className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 ${
                      kf.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : kf.severity === 'high'
                        ? 'bg-rose-500/10 text-rose-300'
                        : kf.severity === 'caution'
                        ? 'bg-amber-500/10 text-amber-300'
                        : 'bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {kf.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Summary & Recommendations */}
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-2">
              <Stethoscope className="w-4 h-4 text-indigo-400" />
              <span>Cardiology Clinical Interpretation</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              {prediction.clinicalSummary}
            </p>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Actionable Next Steps & Medical Recommendations</span>
            </h3>
            <ul className="space-y-2">
              {prediction.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Patient Biomarkers Benchmark Matrix */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
          <span>Biomarkers Matrix: Extracted vs Clinical Benchmark</span>
          <span className="text-xs font-normal text-slate-400">Parameters derived from report</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Resting BP</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{inputData.trestbps} <span className="text-[10px] text-slate-400 font-sans">mmHg</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Normal: &lt;120</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Cholesterol</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{inputData.chol} <span className="text-[10px] text-slate-400 font-sans">mg/dl</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Normal: &lt;200</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Heart Rate</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{inputData.thalach} <span className="text-[10px] text-slate-400 font-sans">bpm</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Target: 130-180</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">ST Depression</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{inputData.oldpeak} <span className="text-[10px] text-slate-400 font-sans">mm</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Normal: &lt;1.0</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Major Vessels</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{inputData.ca} <span className="text-[10px] text-slate-400 font-sans">vessels</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Normal: 0</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Thal Defect</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {inputData.thal === 1 ? 'Normal' : inputData.thal === 2 ? 'Fixed' : 'Reversible'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Code: {inputData.thal}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
