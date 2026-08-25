import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  FileText,
  Calendar,
  Share2,
  TestTube,
  Pill,
  Clock,
  User,
  Users,
  UserPlus,
  Stethoscope,
  Building2,
  BarChart3,
  PackageCheck,
  FileSpreadsheet,
  HelpCircle,
  Bell,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const { t } = useLanguage();

  const getMenuItems = () => {
    if (role === 'citizen') {
      return [
        { path: '/dashboard', label: t('dashboard'), icon: Home },
        { path: '/my-health-record', label: t('my_health_record'), icon: FileText },
        { path: '/appointments', label: t('appointments'), icon: Calendar },
        { path: '/referrals', label: t('referrals'), icon: Share2 },
        { path: '/test-results', label: t('test_results'), icon: TestTube },
        { path: '/medicines', label: t('medicines'), icon: Pill },
        { path: '/follow-ups', label: t('follow_ups'), icon: Clock },
        { path: '/profile', label: t('profile'), icon: User }
      ];
    } else if (role === 'health_worker') {
      return [
        { path: '/dashboard', label: t('dashboard'), icon: Home },
        { path: '/patients', label: t('patients'), icon: Users },
        { path: '/register-patient', label: t('register_patient'), icon: UserPlus, highlight: true },
        { path: '/triage', label: t('triage'), icon: Stethoscope },
        { path: '/appointments', label: t('appointments'), icon: Calendar },
        { path: '/referrals', label: t('referrals'), icon: Share2 },
        { path: '/follow-ups', label: t('follow_ups'), icon: Clock },
        { path: '/services', label: t('services'), icon: Building2 },
        { path: '/profile', label: t('profile'), icon: User }
      ];
    } else {
      return [
        { path: '/dashboard', label: t('dashboard'), icon: BarChart3 },
        { path: '/facilities', label: t('facility_performance'), icon: Building2 },
        { path: '/referrals', label: t('referral_analytics'), icon: Share2 },
        { path: '/high-risk', label: t('high_risk_monitoring'), icon: Activity },
        { path: '/stocks', label: t('medicines'), icon: PackageCheck },
        { path: '/reports', label: t('reports'), icon: FileSpreadsheet },
        { path: '/profile', label: t('profile'), icon: User }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navigation Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
                           (item.path === '/dashboard' && ['/healthworker', '/doctor', '/admin'].includes(location.pathname));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : item.highlight
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 border-t border-slate-100 mt-4 space-y-1">
          <button
            onClick={() => navigate('/help-matrix')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              location.pathname === '/help-matrix'
                ? 'bg-teal-700 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Permission Matrix</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
