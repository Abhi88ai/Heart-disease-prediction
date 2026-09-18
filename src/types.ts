export type UserRole = 'admin' | 'user';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface HeartDiseaseInput {
  age: number; // Age in years (29 - 77)
  sex: number; // 1 = male, 0 = female
  cp: number; // Chest pain type: 0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic
  trestbps: number; // Resting blood pressure (mm Hg)
  chol: number; // Serum cholesterol (mg/dl)
  fbs: number; // Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: number; // Resting ECG results: 0 = normal, 1 = ST-T wave abnormality, 2 = left ventricular hypertrophy
  thalach: number; // Maximum heart rate achieved (bpm)
  exang: number; // Exercise induced angina (1 = yes, 0 = no)
  oldpeak: number; // ST depression induced by exercise relative to rest (0.0 - 6.2)
  slope: number; // Slope of peak exercise ST segment: 0 = upsloping, 1 = flat, 2 = downsloping
  ca: number; // Number of major vessels colored by fluoroscopy (0 - 3)
  thal: number; // Thallium stress test: 1 = normal, 2 = fixed defect, 3 = reversible defect
}

export interface RiskFactor {
  factor: string;
  value: string;
  severity: 'normal' | 'caution' | 'high' | 'critical';
  description: string;
}

export interface PredictionResult {
  hasDisease: boolean;
  probability: number; // 0 - 100%
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidenceScore: number; // e.g. 88%
  keyFactors: RiskFactor[];
  clinicalSummary: string;
  recommendations: string[];
  modelUsed: string;
  algorithmAccuracy: string;
  timestamp: string;
}

export interface PatientRecord {
  id: string;
  patientName: string;
  patientAge: number;
  patientSex: 'Male' | 'Female';
  submittedBy: string;
  userEmail: string;
  inputData: HeartDiseaseInput;
  prediction: PredictionResult;
  reportFileName?: string;
  notes?: string;
  createdAt: string;
}

export interface DatasetFeatureInfo {
  name: string;
  label: string;
  description: string;
  normalRange: string;
  importance: number; // 0 - 100
  unit?: string;
}

export interface SampleReport {
  id: string;
  title: string;
  subtitle: string;
  expectedResult: 'Positive' | 'Negative' | 'Moderate';
  patient: {
    name: string;
    age: number;
    gender: 'Male' | 'Female';
  };
  features: HeartDiseaseInput;
  rawText: string;
}
