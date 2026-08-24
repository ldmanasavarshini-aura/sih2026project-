import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  UserPlus,
  Stethoscope,
  Calendar,
  Share2,
  Clock,
  Building2,
  WifiOff,
  RefreshCw,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Siren,
  Plus
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    patients,
    appointments,
    referrals,
    followUps,
    auditLogs,
    pendingSyncCount,
    syncOfflineRecords
  } = useHealthData();

  const highRiskCount = patients.filter((p) => p.riskLevel === 'Red' || p.riskLevel === 'Emergency').length;
  const followUpsDueCount = followUps.filter((f) => f.status === 'Pending' || f.status === 'Overdue').length;
  const pendingReferralCount = referrals.filter((r) => r.status === 'Sent' || r.status === 'Accepted').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Greeting */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Health Worker Portal (Create & Edit)
            </span>
            <span className="text-xs text-slate-400 font-medium">{user.facility}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Good morning, {user.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            ASHA Sector: Kallipalayam & Neelambur Sub-Centres
          </p>
        </div>

        <button
          onClick={() => navigate('/register-patient')}
          className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div
          onClick={() => navigate('/patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase">Total Patients</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Village sector active</span>
        </div>

        <div
          onClick={() => navigate('/patients?filter=high_risk')}
          className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-500 cursor-pointer transition-all bg-rose-50/20"
        >
          <div className="flex justify-between items-center text-rose-700 mb-2">
            <span className="text-[11px] font-bold uppercase">High-Risk Cases</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700">{highRiskCount}</p>
          <span className="text-[10px] text-rose-800 font-bold">Needs Urgent ANC / Cardiac Care</span>
        </div>

        <div
          onClick={() => navigate('/follow-ups')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Follow-ups Due</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-800">{followUpsDueCount}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Home visits pending</span>
        </div>

        <div
          onClick={() => navigate('/referrals')}
          className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs hover:border-teal-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-teal-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Active Referrals</span>
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-900">{pendingReferralCount}</p>
          <span className="text-[10px] text-teal-700 font-semibold">Hospital pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs col-span-2 lg:col-span-1 bg-blue-50/20">
          <div className="flex justify-between items-center text-blue-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Offline Buffer</span>
            <WifiOff className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-900">{pendingSyncCount}</p>
          <span className="text-[10px] text-blue-700 font-semibold">
            {pendingSyncCount > 0 ? `${pendingSyncCount} saved locally` : 'Synced with server'}
          </span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quick Operational Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => navigate('/register-patient')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-5 h-5 text-emerald-700" />
            <span>Register Patient</span>
          </button>

          <button
            onClick={() => navigate('/triage')}
            className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>Start Triage</span>
          </button>

          <button
            onClick={() => navigate('/appointments/book')}
            className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <Calendar className="w-5 h-5 text-sky-700" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => navigate('/referrals/create')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <Share2 className="w-5 h-5 text-indigo-700" />
            <span>Create Referral</span>
          </button>

          <button
            onClick={() => navigate('/follow-ups')}
            className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <Clock className="w-5 h-5 text-amber-700" />
            <span>Record Follow-up</span>
          </button>

          <button
            onClick={() => navigate('/services')}
            className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <Building2 className="w-5 h-5 text-purple-700" />
            <span>Check Medicine Stock</span>
          </button>
        </div>
      </div>

      {/* Priority Action Items & Offline Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Attention List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Priority Action Items for Today</span>
            </h2>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              4 Urgent Tasks
            </span>
          </div>

          <div className="space-y-3">
            {/* Priority Item 1 */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-900 text-sm">Lakshmi Devi (28y, Kallipalayam)</span>
                  <StatusBadge type="risk" status="Red" />
                </div>
                <p className="text-rose-800 mt-1 font-semibold">
                  Gestational Hypertension (BP 150/95). CMCH Referral scheduled for Aug 26. Check transport pre-booking.
                </p>
              </div>
              <button
                onClick={() => navigate('/patients/SS-PT-10021')}
                className="py-1.5 px-3 bg-rose-600 text-white font-bold rounded-lg text-[11px] shrink-0 hover:bg-rose-700"
              >
                View Patient
              </button>
            </div>

            {/* Priority Item 2 */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-900 text-sm">Murugan (67y, Annur)</span>
                  <StatusBadge type="risk" status="Emergency" />
                </div>
                <p className="text-amber-800 mt-1 font-semibold">
                  Acute Chest Pain emergency referral (REF-8832) sent to CMCH CCU. Awaiting arrival confirmation.
                </p>
              </div>
              <button
                onClick={() => navigate('/referrals')}
                className="py-1.5 px-3 bg-amber-600 text-white font-bold rounded-lg text-[11px] shrink-0 hover:bg-amber-700"
              >
                Track Referral
              </button>
            </div>

            {/* Priority Item 3 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Ramesh Kumar (57y, Kallipalayam)</span>
                  <StatusBadge type="risk" status="Yellow" />
                </div>
                <p className="text-slate-600 mt-1">
                  Metformin & Amlodipine refill due tomorrow (Aug 25). Confirm stock at Neelambur PHC.
                </p>
              </div>
              <button
                onClick={() => navigate('/follow-ups')}
                className="py-1.5 px-3 bg-slate-800 text-white font-bold rounded-lg text-[11px] shrink-0 hover:bg-slate-900"
              >
                Record Visit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Offline Status Card & Audit Logs */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-900 to-teal-800 text-white rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Offline-First Buffer</h3>
              </div>
              <span className="bg-teal-700 text-teal-100 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {pendingSyncCount} Items Pending
              </span>
            </div>

            <p className="text-xs text-teal-100 leading-relaxed">
              Records saved while visiting remote sub-centres are stored securely in local storage until internet connectivity is restored.
            </p>

            <button
              onClick={() => syncOfflineRecords()}
              disabled={pendingSyncCount === 0}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                pendingSyncCount > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md'
                  : 'bg-teal-800 text-teal-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>{pendingSyncCount > 0 ? 'Sync 3 Pending Records Now' : 'All Data Synced'}</span>
            </button>
          </div>

          {/* Recent Audit Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Recent Action Audit Trail
            </h3>
            <div className="space-y-2 text-[11px]">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-slate-500 text-[10px]">{log.details}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-1">
                    By {log.updatedBy} at {log.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
