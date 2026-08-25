import React from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, Eye, Edit3, ShieldAlert, Stethoscope } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  compact?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, compact = false }) => {
  const getBadgeStyle = () => {
    switch (role) {
      case 'citizen':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          icon: <Eye className="w-4 h-4 text-teal-600 shrink-0" />,
          label: 'Citizen — View Only'
        };
      case 'health_worker':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold',
          icon: <Edit3 className="w-4 h-4 text-emerald-600 shrink-0" />,
          label: 'Health Worker — Editor'
        };
      case 'doctor':
        return {
          bg: 'bg-violet-50 border-violet-300 text-violet-800 font-semibold',
          icon: <Stethoscope className="w-4 h-4 text-violet-600 shrink-0" />,
          label: 'Doctor — Consult & Update Care'
        };
      case 'official':
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
          icon: <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />,
          label: 'Higher Official — View Only'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700',
          icon: <ShieldAlert className="w-4 h-4 text-slate-500" />,
          label: 'Guest'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border shadow-xs transition-all ${style.bg}`}
      title={`Role: ${style.label}`}
    >
      {style.icon}
      <span className={compact ? 'hidden sm:inline font-medium' : 'font-semibold'}>{style.label}</span>
    </div>
  );
};
