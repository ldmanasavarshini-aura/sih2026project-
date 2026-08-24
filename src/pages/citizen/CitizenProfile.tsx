import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useAccessibility, FontSize } from '../../context/AccessibilityContext';
import { useHealthData } from '../../context/HealthDataContext';
import { RoleBadge } from '../../components/common/RoleBadge';
import {
  User,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  Type,
  Lock,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { user, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { highContrast, toggleHighContrast, fontSize, setFontSize } = useAccessibility();
  const { patients } = useHealthData();

  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-extrabold text-lg flex items-center justify-center border border-teal-200">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user.name}</h1>
              <RoleBadge role={role} />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Patient ID: {user.patientId || patient.id} • Village: {patient.village}
            </p>
          </div>
        </div>
      </div>

      {/* 1. App Display & Personal Preferences (EDITABLE) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-700" />
          <span>App Display & Language Preferences (Editable)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Language Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-800">Interface Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* High Contrast Mode */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">{t('high_contrast')}</p>
              <p className="text-[11px] text-slate-500">Enhance text & border visibility</p>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-teal-700' : 'bg-slate-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {/* Font Scaling */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 sm:col-span-2 space-y-2">
            <label className="block font-bold text-slate-800">{t('font_size')} Scaling</label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'lg', 'xl'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${fontSize === size
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {size === 'normal' ? 'Normal (100%)' : size === 'lg' ? 'Large (112.5%)' : 'Extra Large (125%)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Read-Only Personal & Demographics Record */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-700" />
            <span>Government Demographics & Identity (View Only)</span>
          </h2>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" /> Locked for Citizen Role
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Full Name</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.name}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.phone}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Village Sector</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.village}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">ABHA ID</span>
            <p className="font-mono font-bold text-teal-800 mt-0.5">{patient.abhaId || '91-4829-1029-4412'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned ASHA Worker</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.assignedWorker}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Sub-Centre</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.facility}</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          To update your registered phone, address, or demographic information, contact your assigned ASHA worker during sub-centre operational hours.
        </p>
      </div>

      {/* 3. Privacy & Data Sharing Consent History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Policy & Consent History</span>
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Digital Consent Status: Active</p>
              <p className="text-emerald-800 text-[11px]">
                Your health data is encrypted and shared only with authorized public health facilities (Neelambur PHC & Coimbatore Medical College Hospital) under NHM digital standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
