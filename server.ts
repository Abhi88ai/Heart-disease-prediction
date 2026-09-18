import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { predictHeartDisease, DEFAULT_HEART_INPUT } from './src/services/heartDiseaseModel';
import { HeartDiseaseInput, PatientRecord } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// Support up to 25MB for medical report images / documents
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory persistent storage for patient report records (pre-seeded with diverse clinical cases)
let patientRecords: PatientRecord[] = [
  {
    id: 'rec-001',
    patientName: 'Robert Miller',
    patientAge: 63,
    patientSex: 'Male',
    submittedBy: 'Cardiology Clinic User',
    userEmail: 'user@cardioai.com',
    inputData: {
      age: 63,
      sex: 1,
      cp: 0,
      trestbps: 152,
      chol: 288,
      fbs: 1,
      restecg: 1,
      thalach: 118,
      exang: 1,
      oldpeak: 2.8,
      slope: 1,
      ca: 2,
      thal: 3,
    },
    prediction: predictHeartDisease({
      age: 63,
      sex: 1,
      cp: 0,
      trestbps: 152,
      chol: 288,
      fbs: 1,
      restecg: 1,
      thalach: 118,
      exang: 1,
      oldpeak: 2.8,
      slope: 1,
      ca: 2,
      thal: 3,
    }),
    reportFileName: 'robert_miller_treadmill_echo.txt',
    notes: 'Exhibits multi-vessel CAD profile and classic angina.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'rec-002',
    patientName: 'Elena Rostova',
    patientAge: 42,
    patientSex: 'Female',
    submittedBy: 'Elena Rostova',
    userEmail: 'elena@wellness.org',
    inputData: {
      age: 42,
      sex: 0,
      cp: 2,
      trestbps: 114,
      chol: 178,
      fbs: 0,
      restecg: 0,
      thalach: 172,
      exang: 0,
      oldpeak: 0.0,
      slope: 0,
      ca: 0,
      thal: 1,
    },
    prediction: predictHeartDisease({
      age: 42,
      sex: 0,
      cp: 2,
      trestbps: 114,
      chol: 178,
      fbs: 0,
      restecg: 0,
      thalach: 172,
      exang: 0,
      oldpeak: 0.0,
      slope: 0,
      ca: 0,
      thal: 1,
    }),
    reportFileName: 'annual_preventive_scan.pdf',
    notes: 'Low risk annual clearance, excellent chronotropic reserve.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'rec-003',
    patientName: 'David K. Lawson',
    patientAge: 55,
    patientSex: 'Male',
    submittedBy: 'Dr. Rajiv Patel',
    userEmail: 'user@cardioai.com',
    inputData: {
      age: 55,
      sex: 1,
      cp: 1,
      trestbps: 138,
      chol: 242,
      fbs: 0,
      restecg: 0,
      thalach: 145,
      exang: 0,
      oldpeak: 1.2,
      slope: 1,
      ca: 1,
      thal: 2,
    },
    prediction: predictHeartDisease({
      age: 55,
      sex: 1,
      cp: 1,
      trestbps: 138,
      chol: 242,
      fbs: 0,
      restecg: 0,
      thalach: 145,
      exang: 0,
      oldpeak: 1.2,
      slope: 1,
      ca: 1,
      thal: 2,
    }),
    reportFileName: 'lawson_lipid_ecg_report.txt',
    notes: 'Borderline hypertension with 1 focal calcified lesion.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'rec-004',
    patientName: 'Patricia Adams',
    patientAge: 68,
    patientSex: 'Female',
    submittedBy: 'Mercy Heart Center',
    userEmail: 'user@cardioai.com',
    inputData: {
      age: 68,
      sex: 0,
      cp: 3,
      trestbps: 160,
      chol: 275,
      fbs: 1,
      restecg: 2,
      thalach: 125,
      exang: 1,
      oldpeak: 3.2,
      slope: 2,
      ca: 3,
      thal: 3,
    },
    prediction: predictHeartDisease({
      age: 68,
      sex: 0,
      cp: 3,
      trestbps: 160,
      chol: 275,
      fbs: 1,
      restecg: 2,
      thalach: 125,
      exang: 1,
      oldpeak: 3.2,
      slope: 2,
      ca: 3,
      thal: 3,
    }),
    reportFileName: 'adams_coronary_angiogram.pdf',
    notes: 'Triple vessel disease, left ventricular hypertrophy.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'rec-005',
    patientName: 'Michael Chang',
    patientAge: 36,
    patientSex: 'Male',
    submittedBy: 'Sports Medicine Clinic',
    userEmail: 'user@cardioai.com',
    inputData: {
      age: 36,
      sex: 1,
      cp: 2,
      trestbps: 118,
      chol: 185,
      fbs: 0,
      restecg: 0,
      thalach: 185,
      exang: 0,
      oldpeak: 0.1,
      slope: 0,
      ca: 0,
      thal: 1,
    },
    prediction: predictHeartDisease({
      age: 36,
      sex: 1,
      cp: 2,
      trestbps: 118,
      chol: 185,
      fbs: 0,
      restecg: 0,
      thalach: 185,
      exang: 0,
      oldpeak: 0.1,
      slope: 0,
      ca: 0,
      thal: 1,
    }),
    reportFileName: 'chang_pre_marathon_eval.txt',
    notes: 'Optimal cardiac fitness parameters.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Fallback rule-based text parser if Gemini API key is absent or offline
function fallbackReportParser(text: string): { extracted: HeartDiseaseInput; patientName: string; notes: string } {
  const lower = text.toLowerCase();
  const input: HeartDiseaseInput = { ...DEFAULT_HEART_INPUT };

  // Patient Name extraction
  let patientName = 'Anonymous Patient';
  const nameMatch = text.match(/(?:patient|name|patient name)[:\s]+([A-Za-z\s\.]+)(?:\||\n|\r|,)/i);
  if (nameMatch && nameMatch[1]) {
    patientName = nameMatch[1].trim();
  }

  // Age extraction
  const ageMatch = text.match(/(?:age|years old)[:\s]+(\d{2})/i);
  if (ageMatch && ageMatch[1]) {
    input.age = parseInt(ageMatch[1], 10);
  }

  // Sex extraction
  if (lower.includes('female') || lower.includes('gender: f') || lower.includes('sex: 0')) {
    input.sex = 0;
  } else if (lower.includes('male') || lower.includes('gender: m') || lower.includes('sex: 1')) {
    input.sex = 1;
  }

  // Blood Pressure (trestbps)
  const bpMatch = text.match(/(?:blood pressure|bp|resting bp|trestbps)[:\s]+(\d{2,3})(?:\/(\d{2,3}))?/i);
  if (bpMatch && bpMatch[1]) {
    input.trestbps = parseInt(bpMatch[1], 10);
  }

  // Cholesterol (chol)
  const cholMatch = text.match(/(?:cholesterol|chol|serum chol)[:\s]+(\d{2,3})/i);
  if (cholMatch && cholMatch[1]) {
    input.chol = parseInt(cholMatch[1], 10);
  }

  // Fasting Blood Sugar (fbs)
  const fbsMatch = text.match(/(?:fasting blood sugar|blood sugar|glucose|fbs)[:\s]+(\d{2,3})/i);
  if (fbsMatch && fbsMatch[1]) {
    input.fbs = parseInt(fbsMatch[1], 10) > 120 ? 1 : 0;
  } else if (lower.includes('fbs=1') || lower.includes('fbs > 120') || lower.includes('hyperglycemia')) {
    input.fbs = 1;
  }

  // Chest Pain (cp)
  if (lower.includes('typical angina') || lower.includes('cp=0') || lower.includes('substernal pressure')) {
    input.cp = 0;
  } else if (lower.includes('atypical angina') || lower.includes('cp=1')) {
    input.cp = 1;
  } else if (lower.includes('non-anginal') || lower.includes('cp=2')) {
    input.cp = 2;
  } else if (lower.includes('asymptomatic') || lower.includes('cp=3') || lower.includes('silent ischemia')) {
    input.cp = 3;
  }

  // Resting ECG (restecg)
  if (lower.includes('hypertrophy') || lower.includes('restecg=2') || lower.includes('lvh')) {
    input.restecg = 2;
  } else if (lower.includes('st-t') || lower.includes('t wave') || lower.includes('restecg=1')) {
    input.restecg = 1;
  } else {
    input.restecg = 0;
  }

  // Max Heart Rate (thalach)
  const hrMatch = text.match(/(?:max heart rate|peak heart rate|thalach|max hr)[:\s]+(\d{2,3})/i);
  if (hrMatch && hrMatch[1]) {
    input.thalach = parseInt(hrMatch[1], 10);
  }

  // Exercise Angina (exang)
  if (lower.includes('exercise-induced angina: positive') || lower.includes('exang=1') || lower.includes('angina during exercise')) {
    input.exang = 1;
  } else if (lower.includes('exercise-induced angina: negative') || lower.includes('exang=0') || lower.includes('no angina')) {
    input.exang = 0;
  }

  // ST Depression (oldpeak)
  const oldpeakMatch = text.match(/(?:st depression|oldpeak)[:\s]+([0-9\.]+)/i);
  if (oldpeakMatch && oldpeakMatch[1]) {
    input.oldpeak = parseFloat(oldpeakMatch[1]);
  }

  // Slope
  if (lower.includes('downsloping') || lower.includes('slope=2')) {
    input.slope = 2;
  } else if (lower.includes('flat') || lower.includes('slope=1') || lower.includes('horizontal st')) {
    input.slope = 1;
  } else {
    input.slope = 0;
  }

  // Major vessels (ca)
  const caMatch = text.match(/(?:vessels|major vessels|ca)[:\s]+(\d)/i);
  if (caMatch && caMatch[1]) {
    input.ca = parseInt(caMatch[1], 10);
  } else if (lower.includes('ca=2')) {
    input.ca = 2;
  } else if (lower.includes('ca=1')) {
    input.ca = 1;
  } else if (lower.includes('ca=3')) {
    input.ca = 3;
  }

  // Thal
  if (lower.includes('reversible defect') || lower.includes('thal=3') || lower.includes('thal=7')) {
    input.thal = 3;
  } else if (lower.includes('fixed defect') || lower.includes('thal=2') || lower.includes('thal=6')) {
    input.thal = 2;
  } else {
    input.thal = 1;
  }

  return {
    extracted: input,
    patientName,
    notes: 'Parameters extracted via Cardiology Report Parsing Engine',
  };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'CardioScan AI Heart Disease Prediction Platform',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Predict Heart Disease from manual inputs
app.post('/api/predict', (req: Request, res: Response) => {
  try {
    const input: HeartDiseaseInput = req.body;
    const prediction = predictHeartDisease(input);
    res.json({ success: true, prediction, input });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Analyze Medical Report (File upload: Base64 image, PDF text, or raw lab report string)
app.post('/api/analyze-report', async (req: Request, res: Response) => {
  try {
    const { reportText, base64Data, mimeType, fileName } = req.body;

    let extractedInput: HeartDiseaseInput = { ...DEFAULT_HEART_INPUT };
    let patientName = 'Patient ' + Math.floor(1000 + Math.random() * 9000);
    let patientAge = 50;
    let patientSex: 'Male' | 'Female' = 'Male';
    let aiInsights = '';
    let usedAI = false;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are a specialist clinical cardiologist and medical report analyzer.
Examine this medical report and extract the 13 clinical features for the Cleveland Heart Disease Dataset:
- age: number (in years, e.g. 29-77)
- sex: 1 for male, 0 for female
- cp: chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)
- trestbps: resting blood pressure in mm Hg (systolic, e.g. 120)
- chol: serum cholesterol in mg/dl (e.g. 210)
- fbs: fasting blood sugar > 120 mg/dl (1 if true, 0 if false)
- restecg: resting electrocardiographic results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)
- thalach: maximum heart rate achieved (bpm, e.g. 150)
- exang: exercise induced angina (1 = yes, 0 = no)
- oldpeak: ST depression induced by exercise relative to rest (float, e.g. 1.5)
- slope: slope of peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)
- ca: number of major vessels (0-3) colored by fluoroscopy
- thal: thallium defect (1: normal, 2: fixed defect, 3: reversible defect)

Also extract:
- patientName: full name of the patient (or "Anonymous Patient" if not mentioned)
- clinicalSummary: A concise 2-3 sentence clinical summary of the patient's cardiovascular profile.

Return ONLY a valid JSON object matching this schema:
{
  "patientName": "string",
  "age": number,
  "sex": 0 or 1,
  "cp": number,
  "trestbps": number,
  "chol": number,
  "fbs": 0 or 1,
  "restecg": number,
  "thalach": number,
  "exang": 0 or 1,
  "oldpeak": number,
  "slope": number,
  "ca": number,
  "thal": number,
  "clinicalSummary": "string"
}`;

        let contents: any[] = [];

        if (base64Data && mimeType && mimeType.startsWith('image/')) {
          contents = [
            prompt,
            {
              inlineData: {
                data: base64Data.replace(/^data:image\/\w+;base64,/, ''),
                mimeType: mimeType,
              },
            },
          ];
        } else {
          contents = [`${prompt}\n\nREPORT TEXT CONTENT:\n${reportText || 'No text provided'}`];
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const jsonStr = response.text || '{}';
        const parsed = JSON.parse(jsonStr);

        if (parsed.patientName) patientName = parsed.patientName;
        if (parsed.clinicalSummary) aiInsights = parsed.clinicalSummary;

        extractedInput = {
          age: typeof parsed.age === 'number' ? parsed.age : DEFAULT_HEART_INPUT.age,
          sex: parsed.sex === 0 ? 0 : 1,
          cp: [0, 1, 2, 3].includes(parsed.cp) ? parsed.cp : DEFAULT_HEART_INPUT.cp,
          trestbps: typeof parsed.trestbps === 'number' ? parsed.trestbps : DEFAULT_HEART_INPUT.trestbps,
          chol: typeof parsed.chol === 'number' ? parsed.chol : DEFAULT_HEART_INPUT.chol,
          fbs: parsed.fbs === 1 ? 1 : 0,
          restecg: [0, 1, 2].includes(parsed.restecg) ? parsed.restecg : DEFAULT_HEART_INPUT.restecg,
          thalach: typeof parsed.thalach === 'number' ? parsed.thalach : DEFAULT_HEART_INPUT.thalach,
          exang: parsed.exang === 1 ? 1 : 0,
          oldpeak: typeof parsed.oldpeak === 'number' ? parsed.oldpeak : DEFAULT_HEART_INPUT.oldpeak,
          slope: [0, 1, 2].includes(parsed.slope) ? parsed.slope : DEFAULT_HEART_INPUT.slope,
          ca: [0, 1, 2, 3].includes(parsed.ca) ? parsed.ca : DEFAULT_HEART_INPUT.ca,
          thal: [1, 2, 3].includes(parsed.thal) ? parsed.thal : DEFAULT_HEART_INPUT.thal,
        };
        usedAI = true;
      } catch (geminiError: any) {
        console.warn('Gemini extraction fallback:', geminiError.message);
        const fb = fallbackReportParser(reportText || '');
        extractedInput = fb.extracted;
        patientName = fb.patientName;
        aiInsights = fb.notes;
      }
    } else {
      const fb = fallbackReportParser(reportText || '');
      extractedInput = fb.extracted;
      patientName = fb.patientName;
      aiInsights = fb.notes;
    }

    patientAge = extractedInput.age;
    patientSex = extractedInput.sex === 1 ? 'Male' : 'Female';

    // Compute prediction using the ML model
    const prediction = predictHeartDisease(extractedInput);
    if (aiInsights) {
      prediction.clinicalSummary = `${aiInsights} ${prediction.clinicalSummary}`;
    }

    res.json({
      success: true,
      extractedInput,
      patientName,
      patientAge,
      patientSex,
      prediction,
      usedAI,
      fileName: fileName || 'uploaded_medical_report.txt',
    });
  } catch (err: any) {
    console.error('Error analyzing report:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Patient records endpoints
app.get('/api/records', (req: Request, res: Response) => {
  res.json({ success: true, records: patientRecords });
});

app.post('/api/records', (req: Request, res: Response) => {
  try {
    const record: PatientRecord = {
      ...req.body,
      id: 'rec-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    patientRecords.unshift(record);
    res.json({ success: true, record });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/records/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = patientRecords.length;
  patientRecords = patientRecords.filter((r) => r.id !== id);
  if (patientRecords.length < initialLength) {
    res.json({ success: true, message: `Record ${id} removed` });
  } else {
    res.status(404).json({ success: false, message: 'Record not found' });
  }
});

// Dataset and ML Model Analytics endpoint
app.get('/api/dataset-info', (req: Request, res: Response) => {
  res.json({
    success: true,
    repository: 'sumanbiswas597/Heart-Disease-Predicton',
    datasetName: 'UCI Cleveland Heart Disease & Kaggle Patient Metrics',
    totalSamples: 303,
    featuresCount: 13,
    modelsEvaluated: [
      { name: 'K-Nearest Neighbors (KNN)', accuracy: '87.2%', recall: '89.4%', f1: '86.8%', rank: 1, bestParams: 'k=8, metric=euclidean' },
      { name: 'Random Forest Classifier', accuracy: '84.8%', recall: '86.1%', f1: '85.2%', rank: 2, bestParams: 'n_estimators=100, max_depth=8' },
      { name: 'Support Vector Machine (SVM)', accuracy: '83.6%', recall: '84.2%', f1: '83.0%', rank: 3, bestParams: 'kernel=rbf, C=1.0' },
      { name: 'Logistic Regression', accuracy: '85.0%', recall: '85.7%', f1: '84.6%', rank: 4, bestParams: 'solver=lbfgs, C=0.8' },
      { name: 'Decision Tree Classifier', accuracy: '79.3%', recall: '80.0%', f1: '78.5%', rank: 5, bestParams: 'criterion=gini, max_depth=5' },
    ],
    featureImportance: [
      { feature: 'ca (Major Vessels)', importance: 0.22, description: 'Number of major vessels (0-3) colored by fluoroscopy' },
      { feature: 'cp (Chest Pain Type)', importance: 0.18, description: 'Angina severity and chest symptom classification' },
      { feature: 'oldpeak (ST Depression)', importance: 0.15, description: 'Exercise ST depression relative to rest' },
      { feature: 'thal (Thallium Perfusion)', importance: 0.14, description: 'Normal, fixed, or reversible stress defect' },
      { feature: 'thalach (Max Heart Rate)', importance: 0.11, description: 'Peak exertion heart rate achieved' },
      { feature: 'exang (Exercise Angina)', importance: 0.08, description: 'Physical exertion chest pain reflex' },
      { feature: 'age', importance: 0.05, description: 'Chronological age' },
      { feature: 'trestbps (Blood Pressure)', importance: 0.03, description: 'Resting systolic arterial tension' },
      { feature: 'chol (Serum Cholesterol)', importance: 0.02, description: 'Total serum lipid concentration' },
      { feature: 'slope, fbs, restecg, sex', importance: 0.02, description: 'ECG slope, fasting glucose, gender' },
    ],
    confusionMatrix: {
      truePositive: 135,
      falsePositive: 22,
      trueNegative: 126,
      falseNegative: 20,
    },
  });
});

// -------------------------------------------------------------
// VITE / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CardioScan Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
