import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ReportUploadSection } from './components/UserPortal/ReportUploadSection';
import { PredictionResultCard } from './components/UserPortal/PredictionResultCard';
import { ClinicalParameterForm } from './components/UserPortal/ClinicalParameterForm';
import { UserHistory } from './components/UserPortal/UserHistory';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { DatasetAnalytics } from './components/AdminPortal/DatasetAnalytics';
import { UserSession, UserRole, HeartDiseaseInput, PredictionResult, PatientRecord } from './types';
import { DEFAULT_HEART_INPUT, predictHeartDisease, SAMPLE_REPORTS } from './services/heartDiseaseModel';
import { HeartPulse, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function App() {
  // Session State - Default to patient John Doe with quick Admin toggle
  const [currentSession, setCurrentSession] = useState<UserSession>({
    id: 'usr_default_patient',
    name: 'John Doe',
    email: 'patient@cardioai.com',
    role: 'user',
  });

  const [activeTab, setActiveTab] = useState<'predict' | 'history' | 'admin-dashboard' | 'dataset-info'>('predict');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('user');

  // Diagnostic & Report State
  const [currentInput, setCurrentInput] = useState<HeartDiseaseInput>({ ...SAMPLE_REPORTS[0].features });
  const [patientName, setPatientName] = useState<string>(SAMPLE_REPORTS[0].patient.name);
  const [patientAge, setPatientAge] = useState<number>(SAMPLE_REPORTS[0].patient.age);
  const [patientSex, setPatientSex] = useState<'Male' | 'Female'>(SAMPLE_REPORTS[0].patient.gender);
  const [reportFileName, setReportFileName] = useState<string>('cardiac_diagnostic_report.txt');
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult>(() =>
    predictHeartDisease(SAMPLE_REPORTS[0].features)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSavedCurrent, setIsSavedCurrent] = useState(false);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch initial records from backend
  useEffect(() => {
    fetch('/api/records')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.records) {
          setRecords(data.records);
        }
      })
      .catch((err) => {
        console.warn('Initial records load error:', err);
      });
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch role directly (e.g. from top bar buttons)
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentSession({
        id: 'usr_admin_quick',
        name: 'Dr. Harrison Wells (Cardiologist)',
        email: 'admin@cardioai.com',
        role: 'admin',
      });
      setActiveTab('admin-dashboard');
      showToast('Switched to Administrator Portal (Admin Privileges active)', 'info');
    } else {
      setCurrentSession({
        id: 'usr_patient_quick',
        name: 'John Doe',
        email: 'patient@cardioai.com',
        role: 'user',
      });
      setActiveTab('predict');
      showToast('Switched to User / Patient Portal', 'info');
    }
  };

  // Login handler from AuthModal
  const handleLogin = (session: UserSession) => {
    setCurrentSession(session);
    if (session.role === 'admin') {
      setActiveTab('admin-dashboard');
      showToast(`Welcome back, ${session.name}! Administrator Dashboard loaded.`, 'success');
    } else {
      setActiveTab('predict');
      showToast(`Welcome, ${session.name}! Ready to analyze your heart reports.`, 'success');
    }
  };

  const handleLogout = () => {
    setAuthDefaultRole(currentSession.role === 'admin' ? 'user' : 'admin');
    setIsAuthModalOpen(true);
  };

  // Report analysis handler (supports files, text, or sample reports)
  const handleAnalyzeReport = async ({
    reportText,
    base64Data,
    mimeType,
    fileName,
    prefilledInput,
    patientName: samplePatientName,
  }: {
    reportText: string;
    base64Data?: string;
    mimeType?: string;
    fileName?: string;
    prefilledInput?: HeartDiseaseInput;
    patientName?: string;
  }) => {
    setIsLoading(true);
    setIsSavedCurrent(false);

    try {
      if (prefilledInput) {
        // Quick 1-click sample report path
        setCurrentInput(prefilledInput);
        if (samplePatientName) setPatientName(samplePatientName);
        setPatientAge(prefilledInput.age);
        setPatientSex(prefilledInput.sex === 1 ? 'Male' : 'Female');
        if (fileName) setReportFileName(fileName);

        const prediction = predictHeartDisease(prefilledInput);
        setCurrentPrediction(prediction);
        showToast(`Analyzed ${samplePatientName || 'Sample Patient'}'s report: ${prediction.hasDisease ? 'Disease Detected' : 'Normal / Low Risk'}`, prediction.hasDisease ? 'error' : 'success');
      } else {
        // Real API call to `/api/analyze-report`
        const response = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportText,
            base64Data,
            mimeType,
            fileName,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setCurrentInput(data.extractedInput);
          setPatientName(data.patientName || 'Anonymous Patient');
          setPatientAge(data.patientAge || data.extractedInput.age);
          setPatientSex(data.patientSex || (data.extractedInput.sex === 1 ? 'Male' : 'Female'));
          setReportFileName(data.fileName || fileName || 'uploaded_report.txt');
          setCurrentPrediction(data.prediction);

          showToast(
            `Diagnostic Complete: ${data.prediction.hasDisease ? 'HEART DISEASE DETECTED (Positive)' : 'NO HEART DISEASE DETECTED (Negative)'}`,
            data.prediction.hasDisease ? 'error' : 'success'
          );
        } else {
          throw new Error(data.error || 'Failed to analyze report');
        }
      }
    } catch (err: any) {
      console.error('Report analysis error:', err);
      // Client-side fallback if server had issues
      const fallbackPrediction = predictHeartDisease(currentInput);
      setCurrentPrediction(fallbackPrediction);
      showToast('Calculated prediction using local Cleveland Machine Learning engine', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate prediction when manual parameters are updated
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setIsSavedCurrent(false);
    setTimeout(() => {
      const updated = predictHeartDisease(currentInput);
      setCurrentPrediction(updated);
      setPatientAge(currentInput.age);
      setPatientSex(currentInput.sex === 1 ? 'Male' : 'Female');
      setIsRecalculating(false);
      showToast(`Updated diagnosis: ${updated.hasDisease ? 'Heart Disease Detected' : 'Normal / Healthy'} (${updated.probability}% risk)`, updated.hasDisease ? 'error' : 'success');
    }, 200);
  };

  // Save current diagnostic to records registry
  const handleSaveRecord = async () => {
    try {
      const recordPayload: Omit<PatientRecord, 'id' | 'createdAt'> = {
        patientName,
        patientAge,
        patientSex,
        submittedBy: currentSession.name,
        userEmail: currentSession.email,
        inputData: currentInput,
        prediction: currentPrediction,
        reportFileName,
      };

      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordPayload),
      });

      const data = await response.json();
      if (data.success && data.record) {
        setRecords([data.record, ...records]);
        setIsSavedCurrent(true);
        showToast('Diagnostic report saved to patient records history.', 'success');
      }
    } catch (err: any) {
      console.error('Error saving record:', err);
      showToast('Could not save record to database', 'error');
    }
  };

  // Delete record (Admin function)
  const handleDeleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/records/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setRecords(records.filter((r) => r.id !== id));
        showToast('Patient record deleted successfully.', 'info');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  // Select record to inspect from history or admin table
  const handleSelectRecord = (record: PatientRecord) => {
    setCurrentInput(record.inputData);
    setCurrentPrediction(record.prediction);
    setPatientName(record.patientName);
    setPatientAge(record.patientAge);
    setPatientSex(record.patientSex);
    setReportFileName(record.reportFileName || 'archived_report.txt');
    setIsSavedCurrent(true);
    setActiveTab('predict');
    showToast(`Loaded diagnostic record for ${record.patientName}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentSession={currentSession}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl shadow-slate-950 text-xs sm:text-sm font-medium animate-slide-up">
          {toastMessage.type === 'error' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="text-white">{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Predict & Upload Medical Report */}
        {activeTab === 'predict' && (
          <div className="space-y-6">
            {/* Report Upload Section */}
            <ReportUploadSection onAnalyzeReport={handleAnalyzeReport} isLoading={isLoading} />

            {/* Prediction Result Card (Tells whether person has heart disease or not) */}
            <PredictionResultCard
              prediction={currentPrediction}
              patientName={patientName}
              patientAge={patientAge}
              patientSex={patientSex}
              inputData={currentInput}
              reportFileName={reportFileName}
              onSaveRecord={handleSaveRecord}
              isSaved={isSavedCurrent}
            />

            {/* Parameter Review & Adjuster */}
            <ClinicalParameterForm
              inputData={currentInput}
              onChangeInput={setCurrentInput}
              onRecalculate={handleRecalculate}
              isRecalculating={isRecalculating}
            />
          </div>
        )}

        {/* Tab 2: User Report History */}
        {activeTab === 'history' && (
          <UserHistory
            records={records}
            onSelectRecord={handleSelectRecord}
            onDeleteRecord={handleDeleteRecord}
            isAdmin={currentSession.role === 'admin'}
          />
        )}

        {/* Tab 3: Admin Dashboard */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            records={records}
            onSelectRecord={handleSelectRecord}
            onDeleteRecord={handleDeleteRecord}
            onNewDiagnostic={() => setActiveTab('predict')}
          />
        )}

        {/* Tab 4: Dataset & ML Model Metrics */}
        {activeTab === 'dataset-info' && <DatasetAnalytics />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-400">CardioScan AI Heart Disease Prediction System</span>
          </div>
          <div className="text-slate-500">
            Cleveland Dataset & ML Architecture • Suman Biswas Repository Reference • Dual Admin & User Portals
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        defaultRole={authDefaultRole}
      />
    </div>
  );
}
