import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  FileText,
  Calendar,
  Share2,
  User,
  Users,
  Stethoscope,
  Clock,
  Building2,
  BarChart3,
  PackageCheck,
  FileSpreadsheet
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const { t } = useLanguage();

  const getNavItems = () => {
    if (role === 'citizen') {
      return [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/my-health-record', label: 'Record', icon: FileText },
        { path: '/appointments', label: 'Appts', icon: Calendar },
        { path: '/referrals', label: 'Referrals', icon: Share2 },
        { path: '/profile', label: 'Profile', icon: User }
      ];
    } else if (role === 'health_worker') {
      return [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/patients', label: 'Patients', icon: Users },
        { path: '/triage', label: 'Triage', icon: Stethoscope },
        { path: '/referrals', label: 'Referrals', icon: Share2 },
        { path: '/follow-ups', label: 'Follow-ups', icon: Clock }
      ];
    } else {
      return [
        { path: '/dashboard', label: 'Overview', icon: BarChart3 },
        { path: '/facilities', label: 'Facilities', icon: Building2 },
        { path: '/referrals', label: 'Analytics', icon: Share2 },
        { path: '/stocks', label: 'Stock', icon: PackageCheck },
        { path: '/reports', label: 'Reports', icon: FileSpreadsheet }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center h-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
                           (item.path === '/dashboard' && ['/healthworker', '/doctor', '/admin'].includes(location.pathname));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full py-1 rounded-lg transition-all ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-teal-700' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
