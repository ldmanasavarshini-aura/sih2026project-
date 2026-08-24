import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Siren, 
  Clock, 
  PackageCheck, 
  PackageX, 
  PackageSearch,
  FileCheck,
  Send,
  Building2,
  Stethoscope,
  XCircle,
  UserCheck
} from 'lucide-react';

interface StatusBadgeProps {
  type: 'risk' | 'stock' | 'referral' | 'appointment' | 'followup';
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, className = '' }) => {
  const renderConfig = () => {
    switch (type) {
      case 'risk':
        switch (status) {
          case 'Green':
            return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Routine Risk' };
          case 'Yellow':
            return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: <AlertTriangle className="w-3.5 h-3.5" />, text: 'Medium Risk' };
          case 'Red':
            return { bg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold', icon: <AlertOctagon className="w-3.5 h-3.5" />, text: 'High Risk' };
          case 'Emergency':
            return { bg: 'bg-red-600 text-white border-red-700 animate-pulse font-bold', icon: <Siren className="w-3.5 h-3.5 text-white" />, text: 'EMERGENCY Escalation' };
          default:
            return { bg: 'bg-slate-100 text-slate-700', icon: <Clock className="w-3.5 h-3.5" />, text: status };
        }

      case 'stock':
        switch (status) {
          case 'Available':
            return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <PackageCheck className="w-3.5 h-3.5" />, text: 'Available' };
          case 'Low Stock':
            return { bg: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold', icon: <PackageSearch className="w-3.5 h-3.5" />, text: 'Low Stock Alert' };
          case 'Unavailable':
          case 'Stock-out':
            return { bg: 'bg-red-100 text-red-800 border-red-300 font-bold', icon: <PackageX className="w-3.5 h-3.5" />, text: 'Stock-Out (Unavailable)' };
          case 'Limited':
            return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Clock className="w-3.5 h-3.5" />, text: 'Limited Diagnostics' };
          default:
            return { bg: 'bg-slate-100 text-slate-700', icon: <PackageCheck className="w-3.5 h-3.5" />, text: status };
        }

      case 'referral':
        switch (status) {
          case 'Created':
          case 'Draft':
            return { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: <Clock className="w-3.5 h-3.5" />, text: 'Draft Referral' };
          case 'Sent':
            return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Send className="w-3.5 h-3.5" />, text: 'Sent to Facility' };
          case 'Accepted':
            return { bg: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold', icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Accepted by Facility' };
          case 'Facility Visit':
          case 'Patient Arrived':
            return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: <Building2 className="w-3.5 h-3.5" />, text: 'Patient at Facility' };
          case 'Consultation Complete':
            return { bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Stethoscope className="w-3.5 h-3.5" />, text: 'Consultation Complete' };
          case 'Follow-up':
          case 'Completed':
            return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold', icon: <FileCheck className="w-3.5 h-3.5" />, text: 'Follow-up Completed' };
          case 'Delayed':
            return { bg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold', icon: <AlertTriangle className="w-3.5 h-3.5" />, text: 'Referral Delayed' };
          default:
            return { bg: 'bg-slate-100 text-slate-700', icon: <Clock className="w-3.5 h-3.5" />, text: status };
        }

      case 'appointment':
        switch (status) {
          case 'Booked':
            return { bg: 'bg-sky-100 text-sky-800 border-sky-300 font-medium', icon: <Clock className="w-3.5 h-3.5" />, text: 'Appointment Booked' };
          case 'Checked In':
            return { bg: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold', icon: <UserCheck className="w-3.5 h-3.5" />, text: 'Checked In' };
          case 'Completed':
            return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Completed' };
          case 'Cancelled':
            return { bg: 'bg-rose-100 text-rose-800 border-rose-300', icon: <XCircle className="w-3.5 h-3.5" />, text: 'Cancelled' };
          default:
            return { bg: 'bg-slate-100 text-slate-700', icon: <Clock className="w-3.5 h-3.5" />, text: status };
        }

      case 'followup':
        switch (status) {
          case 'Pending':
            return { bg: 'bg-amber-100 text-amber-800 border-amber-300 font-medium', icon: <Clock className="w-3.5 h-3.5" />, text: 'Follow-up Pending' };
          case 'Completed':
            return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium', icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Visit Completed' };
          case 'Overdue':
            return { bg: 'bg-rose-100 text-rose-800 border-rose-400 font-bold animate-pulse', icon: <AlertOctagon className="w-3.5 h-3.5" />, text: 'OVERDUE Follow-up' };
          default:
            return { bg: 'bg-slate-100 text-slate-700', icon: <Clock className="w-3.5 h-3.5" />, text: status };
        }

      default:
        return { bg: 'bg-slate-100 text-slate-700', icon: <Clock className="w-3.5 h-3.5" />, text: status };
    }
  };

  const config = renderConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};
