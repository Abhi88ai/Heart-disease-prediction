import React, { useState } from 'react';
import { X, ShieldCheck, User, CheckCircle2, Lock, Mail, ArrowRight } from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  defaultRole = 'user',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState(defaultRole === 'admin' ? 'admin@cardioai.com' : 'patient@cardioai.com');
  const [password, setPassword] = useState('password123');
  const [patientName, setPatientName] = useState(defaultRole === 'admin' ? 'Dr. Harrison Wells (Cardiologist)' : 'John Doe');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@cardioai.com');
      setPatientName('Dr. Harrison Wells (Cardiologist)');
      setPassword('admin123');
    } else {
      setEmail('patient@cardioai.com');
      setPatientName('John Doe');
      setPassword('user123');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const session: UserSession = {
      id: 'usr_' + Date.now(),
      name: patientName || (selectedRole === 'admin' ? 'Administrator' : 'Cardio Patient'),
      email: email.trim(),
      role: selectedRole,
    };

    onLogin(session);
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      onLogin({
        id: 'usr_admin_demo',
        name: 'Dr. Harrison Wells (Cardiologist)',
        email: 'admin@cardioai.com',
        role: 'admin',
      });
    } else {
      onLogin({
        id: 'usr_patient_demo',
        name: 'John Doe (Patient)',
        email: 'patient@cardioai.com',
        role: 'user',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-750 shadow-2xl shadow-slate-950/60 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Portal Authentication</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your role to access diagnostic features or records
            </p>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle Tabs */}
        <div className="p-6 pt-4 space-y-5">
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              id="auth-tab-user"
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                selectedRole === 'user'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Login</span>
            </button>
            <button
              id="auth-tab-admin"
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Role Description Banner */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              selectedRole === 'admin'
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            }`}
          >
            {selectedRole === 'admin' ? (
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-white">Administrator Privileges:</strong> View aggregate patient records, download reports, review dataset metrics from the GitHub repository, and inspect model precision.
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-2.5">
                <User className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-white">Patient / User Privileges:</strong> Upload laboratory or ECG reports, receive instant Heart Disease predictions, inspect risk factors, and view past diagnostic scans.
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {selectedRole === 'admin' ? 'Physician / Admin Name' : 'Patient Full Name'}
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
                placeholder={selectedRole === 'admin' ? 'Dr. Harrison Wells' : 'John Doe'}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
                  placeholder="name@cardioai.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30'
              }`}
            >
              <span>Sign In as {selectedRole === 'admin' ? 'Admin' : 'User'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Shortcut */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 text-center mb-2.5">
              Quick 1-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="quick-demo-user-btn"
                onClick={() => handleQuickDemoLogin('user')}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Instant User</span>
              </button>
              <button
                type="button"
                id="quick-demo-admin-btn"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
