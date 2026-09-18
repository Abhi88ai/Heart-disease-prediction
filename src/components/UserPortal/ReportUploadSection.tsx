import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Sparkles, AlertCircle, RefreshCw, FileUp, Cpu, Stethoscope } from 'lucide-react';
import { SAMPLE_REPORTS } from '../../services/heartDiseaseModel';
import { HeartDiseaseInput, SampleReport } from '../../types';

interface ReportUploadSectionProps {
  onAnalyzeReport: (params: {
    reportText: string;
    base64Data?: string;
    mimeType?: string;
    fileName?: string;
    prefilledInput?: HeartDiseaseInput;
    patientName?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const ReportUploadSection: React.FC<ReportUploadSectionProps> = ({
  onAnalyzeReport,
  isLoading,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'sample' | 'text'>('sample');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customReportText, setCustomReportText] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-high-risk');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();

    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        onAnalyzeReport({
          reportText: `Medical image uploaded: ${file.name}`,
          base64Data,
          mimeType: file.type,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Text, CSV, JSON, or text representation of PDF
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onAnalyzeReport({
          reportText: text,
          fileName: file.name,
          mimeType: file.type || 'text/plain',
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleReport) => {
    setSelectedSampleId(sample.id);
    onAnalyzeReport({
      reportText: sample.rawText,
      fileName: `${sample.patient.name.toLowerCase().replace(/\s+/g, '_')}_cardiac_report.txt`,
      prefilledInput: sample.features,
      patientName: sample.patient.name,
    });
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReportText.trim()) return;
    onAnalyzeReport({
      reportText: customReportText,
      fileName: 'clinical_notes_pasted.txt',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Upload Patient Medical Report
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload lab findings, ECG recordings, lipid profiles, or select a pre-loaded clinical sample report.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
          <button
            id="tab-mode-sample"
            onClick={() => setActiveInputMode('sample')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeInputMode === 'sample'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Reports (1-Click)</span>
          </button>
          <button
            id="tab-mode-upload"
            onClick={() => setActiveInputMode('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeInputMode === 'upload'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            id="tab-mode-text"
            onClick={() => setActiveInputMode('text')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeInputMode === 'text'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* Mode 1: 1-Click Sample Reports */}
      {activeInputMode === 'sample' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Choose any verified clinical patient scenario to test the prediction engine:</span>
            <span className="text-slate-500 hidden sm:inline">Instant extraction & ML scoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SAMPLE_REPORTS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              const isPositive = sample.expectedResult === 'Positive';
              const isModerate = sample.expectedResult === 'Moderate';

              return (
                <div
                  key={sample.id}
                  id={`sample-card-${sample.id}`}
                  onClick={() => handleSampleSelect(sample)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group ${
                    isSelected
                      ? 'bg-slate-800 border-rose-500 ring-2 ring-rose-500/20 shadow-lg'
                      : 'bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isPositive
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : isModerate
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {isPositive ? 'Heart Disease Risk' : isModerate ? 'Moderate Borderline' : 'Normal / Healthy'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {sample.patient.gender}, {sample.patient.age}y
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                    {sample.patient.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {sample.subtitle}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      BP: <strong className="text-slate-200">{sample.features.trestbps}</strong> | Chol: <strong className="text-slate-200">{sample.features.chol}</strong>
                    </span>
                    <span className="font-semibold text-rose-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center space-x-1">
                      <span>Test Scan</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Drag & Drop File Upload */}
      {activeInputMode === 'upload' && (
        <div>
          <div
            id="drag-drop-zone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-rose-500 bg-rose-500/5'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Click to browse or drag and drop your medical report
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: Lab scan images (JPG, PNG), ECG records, Medical reports (PDF, TXT, CSV)
                </p>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OCR & Parameter Extraction</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cleveland ML Model Analysis</span>
                </span>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-3 flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span className="font-medium text-white">{selectedFile.name}</span>
                <span className="text-slate-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => processFile(selectedFile)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-colors"
              >
                Re-scan File
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Paste Text */}
      {activeInputMode === 'text' && (
        <form onSubmit={handleCustomTextSubmit} className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Paste Diagnostic Summary, Discharge Report, or Laboratory Findings:
          </label>
          <textarea
            id="custom-report-textarea"
            rows={5}
            value={customReportText}
            onChange={(e) => setCustomReportText(e.target.value)}
            placeholder="e.g. Patient: John Smith, Age 58, Resting BP: 145/90, Total Cholesterol: 260 mg/dl, Chest pain: typical angina, Max Heart rate: 125 bpm, ST depression: 2.1 mm, Fluoroscopy: 1 vessel stenosis..."
            className="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 font-mono"
          />
          <div className="flex justify-end">
            <button
              id="analyze-pasted-text-btn"
              type="submit"
              disabled={isLoading || !customReportText.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-rose-600/30 transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Parse & Predict from Text</span>
            </button>
          </div>
        </form>
      )}

      {/* Processing State Indicator */}
      {isLoading && (
        <div className="mt-4 p-4 rounded-xl bg-slate-800/90 border border-rose-500/30 flex items-center space-x-3.5 animate-pulse">
          <RefreshCw className="w-5 h-5 text-rose-400 animate-spin shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-white">Analyzing Medical Report with Machine Learning Engine...</div>
            <div className="text-slate-400 mt-0.5">
              Extracting 13 clinical biomarkers • Cross-referencing Cleveland Heart Disease dataset • Computing probability
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
