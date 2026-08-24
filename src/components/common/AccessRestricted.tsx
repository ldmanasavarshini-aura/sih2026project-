import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { RoleBadge } from './RoleBadge';

export const AccessRestricted: React.FC = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center animate-fade-in relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-teal-600" />

        {/* Lock Icon */}
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{t('access_restricted')}</h1>

        <div className="my-3 flex justify-center">
          <RoleBadge role={role} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4 text-left flex gap-3 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">View-Only Role Access Guard</p>
            <p className="text-amber-800 leading-relaxed">
              {t('access_restricted_msg')}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.roleTitle}).
          If you believe this is an error or require creation rights, please switch to a Health Worker demo profile.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('return_to_dashboard')}</span>
        </button>
      </div>
    </div>
  );
};
