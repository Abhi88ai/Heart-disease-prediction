import React from 'react';
import { ExternalLink, Database, GitBranch, Award, BarChart2, CheckCircle, Info, Cpu, Layers } from 'lucide-react';
import { DATASET_FEATURES } from '../../services/heartDiseaseModel';

export const DatasetAnalytics: React.FC = () => {
  const models = [
    {
      name: 'K-Nearest Neighbors (KNN)',
      accuracy: '87.2%',
      recall: '89.4%',
      f1Score: '86.8%',
      notes: 'Best performing model in repository evaluation pipeline with high clinical recall for disease detection.',
      badge: 'Highest Recall',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      name: 'Random Forest Classifier',
      accuracy: '84.8%',
      recall: '86.1%',
      f1Score: '85.2%',
      notes: '100 estimators, max depth 8. Exceptional generalization with minimal overfitting across cross-validation folds.',
      badge: 'Ensemble Baseline',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      name: 'Logistic Regression',
      accuracy: '85.0%',
      recall: '85.7%',
      f1Score: '84.6%',
      notes: 'L-BFGS solver with balanced class weighting. Provides calibrated log-odds risk scoring.',
      badge: 'Risk Scoring',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      name: 'Support Vector Machine (SVM)',
      accuracy: '83.6%',
      recall: '84.2%',
      f1Score: '83.0%',
      notes: 'RBF kernel with standardized feature scaling for non-linear decision boundary separation.',
      badge: 'Non-Linear Kernel',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      name: 'Decision Tree Classifier',
      accuracy: '79.3%',
      recall: '80.0%',
      f1Score: '78.5%',
      notes: 'Gini impurity criterion, depth pruned to 5 levels to avoid single-branch variance.',
      badge: 'Interpretable Tree',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Repository Citation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GitBranch className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white">
                Dataset & ML Pipeline Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Trained and validated on the Cleveland Heart Disease Dataset from the research repository{' '}
              <span className="font-mono text-slate-200 font-medium">sumanbiswas597/Heart-Disease-Predicton</span>.
            </p>
          </div>

          <a
            href="https://github.com/sumanbiswas597/Heart-Disease-Predicton"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors shadow-sm shrink-0"
          >
            <span>View GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Dataset Size</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">303 Clinical Patients</div>
            <div className="text-[10px] text-slate-500">UCI Cleveland & Kaggle</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Features Extracted</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">13 Predictors</div>
            <div className="text-[10px] text-slate-500">Demographic & ECG & Vitals</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Top Model Recall</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">89.4% Recall</div>
            <div className="text-[10px] text-slate-500">High Sensitivity Priority</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Classification Target</div>
            <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">Binary (0 vs 1)</div>
            <div className="text-[10px] text-slate-500">Heart Disease: No vs Yes</div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Performance Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Machine Learning Algorithms Evaluated</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across test sets based on exploratory data analysis and model training in the repository.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-750 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{m.accuracy} Acc</span>
                </div>
                <h4 className="text-sm font-bold text-white">{m.name}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{m.notes}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-750">
                  <div className="text-[10px] text-slate-400 uppercase">Recall</div>
                  <div className="font-mono font-bold text-emerald-400">{m.recall}</div>
                </div>
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-750">
                  <div className="text-[10px] text-slate-400 uppercase">F1-Score</div>
                  <div className="font-mono font-bold text-indigo-300">{m.f1Score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Clinical Dictionary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Cleveland 13 Feature Importance & Diagnostic Weights</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked clinical impact extracted during model cross-validation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DATASET_FEATURES.sort((a, b) => b.importance - a.importance).map((feat, i) => (
            <div
              key={feat.name}
              className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-750 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-white text-xs truncate">{feat.label}</span>
                  <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    {feat.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{feat.description}</p>
              </div>

              {/* Importance Bar */}
              <div className="w-24 shrink-0 text-right">
                <div className="text-xs font-mono font-bold text-white">{feat.importance}%</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${feat.importance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
