import React, { useState } from 'react';
import { Sliders, RefreshCw, ChevronDown, ChevronUp, Info, Activity } from 'lucide-react';
import { HeartDiseaseInput } from '../../types';
import { DATASET_FEATURES } from '../../services/heartDiseaseModel';

interface ClinicalParameterFormProps {
  inputData: HeartDiseaseInput;
  onChangeInput: (newInput: HeartDiseaseInput) => void;
  onRecalculate: () => void;
  isRecalculating?: boolean;
}

export const ClinicalParameterForm: React.FC<ClinicalParameterFormProps> = ({
  inputData,
  onChangeInput,
  onRecalculate,
  isRecalculating = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNumberChange = (field: keyof HeartDiseaseInput, value: number) => {
    onChangeInput({
      ...inputData,
      [field]: value,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <button
        id="toggle-parameter-adjuster-btn"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:px-6 flex items-center justify-between bg-slate-850 hover:bg-slate-800 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Review or Adjust 13 Clinical Parameters</span>
              <span className="text-[11px] font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Cleveland Heart Dataset
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fine-tune the parameters extracted from your report or test hypothetical scenarios.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>{isExpanded ? 'Hide Parameters' : 'View & Adjust'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-900/60 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Age */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Age (Years)</span>
                <span className="text-slate-400 font-mono">{inputData.age}</span>
              </label>
              <input
                type="range"
                min="25"
                max="85"
                value={inputData.age}
                onChange={(e) => handleNumberChange('age', parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Cleveland range: 29 - 77 yrs</span>
            </div>

            {/* 2. Sex */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Biological Sex
              </label>
              <select
                value={inputData.sex}
                onChange={(e) => handleNumberChange('sex', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={1}>Male (1)</option>
                <option value={0}>Female (0)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Cleveland feature: sex</span>
            </div>

            {/* 3. Chest Pain Type (cp) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Chest Pain Type (cp)
              </label>
              <select
                value={inputData.cp}
                onChange={(e) => handleNumberChange('cp', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0: Typical Angina (Highest CAD risk)</option>
                <option value={1}>1: Atypical Angina</option>
                <option value={2}>2: Non-Anginal Pain</option>
                <option value={3}>3: Asymptomatic (Silent Ischemia)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">High feature importance (92%)</span>
            </div>

            {/* 4. Resting Blood Pressure (trestbps) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Resting Blood Pressure</span>
                <span className="text-slate-400 font-mono">{inputData.trestbps} mm Hg</span>
              </label>
              <input
                type="range"
                min="90"
                max="200"
                value={inputData.trestbps}
                onChange={(e) => handleNumberChange('trestbps', parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Optimal: &lt;120 | Stage 2: &ge;140</span>
            </div>

            {/* 5. Serum Cholesterol (chol) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Serum Cholesterol</span>
                <span className="text-slate-400 font-mono">{inputData.chol} mg/dl</span>
              </label>
              <input
                type="range"
                min="120"
                max="450"
                value={inputData.chol}
                onChange={(e) => handleNumberChange('chol', parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Desirable: &lt;200 | High: &ge;240</span>
            </div>

            {/* 6. Fasting Blood Sugar (fbs) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Fasting Blood Sugar &gt; 120 mg/dl
              </label>
              <select
                value={inputData.fbs}
                onChange={(e) => handleNumberChange('fbs', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0: False (&le; 120 mg/dl - Normal)</option>
                <option value={1}>1: True (&gt; 120 mg/dl - Hyperglycemia)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Diabetic / Pre-diabetic marker</span>
            </div>

            {/* 7. Resting ECG (restecg) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Resting Electrocardiogram
              </label>
              <select
                value={inputData.restecg}
                onChange={(e) => handleNumberChange('restecg', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0: Normal Sinus Rhythm</option>
                <option value={1}>1: ST-T Wave Abnormality</option>
                <option value={2}>2: Left Ventricular Hypertrophy (LVH)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Electrical cardiac conduction</span>
            </div>

            {/* 8. Max Heart Rate (thalach) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Max Heart Rate (thalach)</span>
                <span className="text-slate-400 font-mono">{inputData.thalach} bpm</span>
              </label>
              <input
                type="range"
                min="70"
                max="210"
                value={inputData.thalach}
                onChange={(e) => handleNumberChange('thalach', parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Peak exertion heart rate during stress</span>
            </div>

            {/* 9. Exercise Induced Angina (exang) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Exercise Induced Angina (exang)
              </label>
              <select
                value={inputData.exang}
                onChange={(e) => handleNumberChange('exang', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0: No (No chest pain under exertion)</option>
                <option value={1}>1: Yes (Angina during exercise test)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Hallmark ischemic indicator</span>
            </div>

            {/* 10. ST Depression (oldpeak) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>ST Depression (oldpeak)</span>
                <span className="text-slate-400 font-mono">{inputData.oldpeak} mm</span>
              </label>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={Math.round(inputData.oldpeak * 10)}
                onChange={(e) => handleNumberChange('oldpeak', parseFloat((parseInt(e.target.value, 10) / 10).toFixed(1)))}
                className="w-full mt-2 accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Normal: &lt;1.0 mm | Ischemia: &ge;1.5 mm</span>
            </div>

            {/* 11. Slope */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Slope of Peak ST Segment
              </label>
              <select
                value={inputData.slope}
                onChange={(e) => handleNumberChange('slope', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0: Upsloping (Physiologically Normal)</option>
                <option value={1}>1: Flat (Horizontal ST Depression)</option>
                <option value={2}>2: Downsloping (High Ischemic Specificity)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">ECG treadmill test trajectory</span>
            </div>

            {/* 12. Major Vessels (ca) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Major Vessels Stenosis (ca: 0-3)
              </label>
              <select
                value={inputData.ca}
                onChange={(e) => handleNumberChange('ca', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={0}>0 Major Vessels Colored (Normal)</option>
                <option value={1}>1 Major Vessel (Stenosis Detected)</option>
                <option value={2}>2 Major Vessels (Double Vessel Disease)</option>
                <option value={3}>3 Major Vessels (Triple Vessel Disease)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Strongest Cleveland CAD predictor (94%)</span>
            </div>

            {/* 13. Thallium Scan (thal) */}
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Thallium Stress Defect (thal)
              </label>
              <select
                value={inputData.thal}
                onChange={(e) => handleNumberChange('thal', parseInt(e.target.value, 10))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value={1}>1: Normal Perfusion</option>
                <option value={2}>2: Fixed Defect (Previous Infarct Scar)</option>
                <option value={3}>3: Reversible Defect (Inducible Ischemia)</option>
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">Myocardial perfusion scintigraphy</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="recalculate-prediction-btn"
              type="button"
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center space-x-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>Re-calculate Prediction with Updated Biomarkers</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
