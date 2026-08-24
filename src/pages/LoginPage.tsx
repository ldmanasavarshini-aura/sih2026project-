import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DEMO_USERS } from '../data/mockData';
import { UserRole } from '../types';
import {
  HeartHandshake,
  User,
  Stethoscope,
  Building2,
  Phone,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Mail
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { firebaseLogin } = useAuth();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [step, setStep] = useState<'role' | 'input' | 'otp'>('role');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier('');
    setOtp('');
    setStep('input');
    setError(null);
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setStep('otp');
    setError(null);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError('Please enter your password.');
      return;
    }
    const result = await firebaseLogin(identifier, otp);
    if (result.success && result.role) {
      navigate(`/${result.role}`);
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SwasthyaSetu Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Connected care, closer to every village.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: ROLE CARDS */}
        {step === 'role' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider text-center mb-2">
              Select Your Access Role
            </h2>

            {/* Role 1: Citizen */}
            <div
              onClick={() => handleRoleSelect('citizen')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'citizen'
                  ? 'border-teal-700 bg-teal-50/70 shadow-md ring-2 ring-teal-700/20'
                  : 'border-slate-200 hover:border-teal-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">1. Citizen / Patient</h3>
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                      VIEW ONLY
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Lakshmi Devi (ID: SS-PT-10021)</p>
                  <p className="text-[11px] text-slate-500">Village: Kallipalayam | Access personal health record</p>
                </div>
              </div>
            </div>

            {/* Role 2: Health Worker */}
            <div
              onClick={() => handleRoleSelect('health_worker')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'health_worker'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">2. Health Worker</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      CREATE AND EDIT
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">Meena R (ASHA Worker)</p>
                  <p className="text-[11px] text-slate-500">Facility: Neelambur PHC | Register, triage & refer</p>
                </div>
              </div>
            </div>

            {/* Role 3: Official */}
            <div
              onClick={() => handleRoleSelect('official')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'official'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-600/20'
                  : 'border-slate-200 hover:border-indigo-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">3. Higher Official</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                      VIEW DASHBOARD
                    </span>
                  </div>
                  <p className="text-xs text-indigo-800 font-semibold mt-0.5">Priya Deshmukh (District Health Officer)</p>
                  <p className="text-[11px] text-slate-500">District: Coimbatore | Monitoring & analytics</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EMAIL INPUT */}
        {step === 'input' && (
          <form onSubmit={handleProceedToOtp} className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Selected Role</span>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  {DEMO_USERS[selectedRole].name} ({DEMO_USERS[selectedRole].roleTitle})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('role')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Change Role
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: PASSWORD INPUT */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-base">Enter Password</h3>
            <p className="text-xs text-slate-500">
              Enter password for account <strong className="text-slate-800">{identifier}</strong>
            </p>

            <div className="max-w-xs mx-auto">
              <input
                type="password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter password"
                className="w-full text-center py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none font-semibold text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify & Login to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium block mx-auto mt-2"
            >
              ← Back to email input
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

