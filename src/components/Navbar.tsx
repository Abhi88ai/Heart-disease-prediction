import React from 'react';
import { Activity, ShieldCheck, User, LogOut, HeartPulse, Database, FileText } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentSession: UserSession;
  activeTab: 'predict' | 'history' | 'admin-dashboard' | 'dataset-info';
  setActiveTab: (tab: 'predict' | 'history' | 'admin-dashboard' | 'dataset-info') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'admin' | 'user') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onSwitchRole,
}) => {
  const isAdmin = currentSession.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(isAdmin ? 'admin-dashboard' : 'predict')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 shadow-lg shadow-rose-500/20">
            <HeartPulse className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CardioScan
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                AI Diagnostics
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Cleveland Heart Disease ML & Clinical Report Analysis
            </p>
          </div>
        </div>

        {/* Navigation Tabs based on role */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {!isAdmin ? (
            <>
              <button
                id="nav-tab-upload-report"
                onClick={() => setActiveTab('predict')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'predict'
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Upload Report & Predict</span>
              </button>
              <button
                id="nav-tab-my-history"
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>My Reports History</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-tab-admin-dash"
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Patient Records & Logs</span>
              </button>
              <button
                id="nav-tab-dataset-info"
                onClick={() => setActiveTab('dataset-info')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'dataset-info'
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Dataset & ML Metrics</span>
              </button>
              <button
                id="nav-tab-admin-test-predict"
                onClick={() => setActiveTab('predict')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'predict'
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Run Diagnostic</span>
              </button>
            </>
          )}
        </nav>

        {/* User Session & Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Quick 1-click Role Toggle for testing user and admin */}
          <div className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              id="switch-to-user-role-btn"
              onClick={() => onSwitchRole('user')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                !isAdmin
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Mode</span>
            </button>
            <button
              id="switch-to-admin-role-btn"
              onClick={() => onSwitchRole('admin')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isAdmin
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
            </button>
          </div>

          {/* Current User Badge & Modal */}
          <div className="flex items-center space-x-2">
            <button
              id="user-profile-badge-btn"
              onClick={onOpenAuth}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors text-left"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isAdmin ? 'bg-indigo-600 text-indigo-100' : 'bg-rose-600 text-rose-100'
                }`}
              >
                {isAdmin ? 'AD' : 'US'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {currentSession.name}
                </div>
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {currentSession.role} Login
                </div>
              </div>
            </button>

            <button
              id="logout-button"
              onClick={onLogout}
              title="Switch user / Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
