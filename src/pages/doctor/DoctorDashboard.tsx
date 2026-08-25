import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Stethoscope,
  AlertOctagon,
  Share2,
  Clock,
  ArrowRight,
  Siren,
  Activity,
  HeartPulse,
  Video,
  CalendarCheck,
  ClipboardList,
  MapPin
} from 'lucide-react';

const riskOrder: Record<string, number> = {
  Emergency: 0,
  Red: 1,
  Yellow: 2,
  Green: 3,
};

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, referrals, followUps, appointments } = useHealthData();

  const sortedPatients = [...patients].sort(
    (a, b) => (riskOrder[a.riskLevel] ?? 4) - (riskOrder[b.riskLevel] ?? 4)
  );

  const highRiskCount = patients.filter(
    (p) => p.riskLevel === 'Red' || p.riskLevel === 'Emergency'
  ).length;
  const pendingReferralCount = referrals.filter(
    (r) => r.status === 'Sent' || r.status === 'Accepted'
  ).length;
  const followUpsDueCount = followUps.filter(
    (f) => f.status === 'Pending' || f.status === 'Overdue'
  ).length;
  const todayAppointments = appointments.filter(
    (a) => a.status === 'Booked' || a.status === 'Checked In'
  ).length;

  const emergencyPatients = sortedPatients.filter(
    (p) => p.riskLevel === 'Emergency' || p.riskLevel === 'Red'
  );

  const getRiskDot = (risk: string) => {
    if (risk === 'Emergency' || risk === 'Red') return '🔴';
    if (risk === 'Yellow') return '🟡';
    return '🟢';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 text-violet-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-violet-200">
              Doctor Portal — Consult &amp; Update Care
            </span>
            <span className="text-xs text-slate-400 font-medium">{user.facility}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Good morning, {user.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {(user as { specialty?: string }).specialty ?? 'Medical Officer'} · {user.facility} · {user.district} District
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/healthcare-map')}
            className="py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>Find Hospital (Map)</span>
          </button>

          <button
            onClick={() => navigate('/consultations')}
            className="py-3 px-5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Start New Consultation</span>
          </button>
        </div>
      </div>

      {/* High-Risk Alert Banner */}
      {emergencyPatients.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <Siren className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-extrabold text-rose-900 text-sm">
                ⚠️ {emergencyPatients.length} High-Risk Patient{emergencyPatients.length > 1 ? 's' : ''} Require{emergencyPatients.length === 1 ? 's' : ''} Priority Review
              </p>
              {emergencyPatients.map((p) => (
                <div key={p.id} className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-rose-800 font-medium">
                  <span>{p.name} · {p.id}</span>
                  <span>Risk: <strong>{p.riskLevel}</strong></span>
                  <span>BP: {p.latestVitals.bp}</span>
                  <span>SpO₂: {p.latestVitals.spO2}%</span>
                  {p.riskReason && <span className="text-rose-700">{p.riskReason}</span>}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/doctor-patients')}
            className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            Review Now
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div
          onClick={() => navigate('/doctor-patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-violet-400 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase">Today's Patients</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length}</p>
          <span className="text-[10px] text-violet-600 font-semibold">Assigned &amp; referred</span>
        </div>

        <div
          onClick={() => navigate('/consultations')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-violet-400 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-violet-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Pending Consults</span>
            <Stethoscope className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-extrabold text-violet-900">{todayAppointments}</p>
          <span className="text-[10px] text-violet-700 font-semibold">Awaiting review</span>
        </div>

        <div
          onClick={() => navigate('/doctor-patients')}
          className="bg-rose-50/20 p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-rose-700 mb-2">
            <span className="text-[11px] font-bold uppercase">High-Risk</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700">{highRiskCount}</p>
          <span className="text-[10px] text-rose-800 font-bold">Needs urgent review</span>
        </div>

        <div
          onClick={() => navigate('/referrals')}
          className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs hover:border-teal-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center text-teal-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Pending Referrals</span>
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-900">{pendingReferralCount}</p>
          <span className="text-[10px] text-teal-700 font-semibold">Awaiting decision</span>
        </div>

        <div
          onClick={() => navigate('/follow-ups')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-500 cursor-pointer transition-all col-span-2 lg:col-span-1"
        >
          <div className="flex justify-between items-center text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase">Follow-ups Due</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-800">{followUpsDueCount}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Scheduled today</span>
        </div>
      </div>

      {/* Priority Patient Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-600" />
            Priority Patient Queue
          </h2>
          <span className="text-xs text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
            {patients.length} Patients — Sorted by Clinical Priority
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedPatients.map((patient) => {
            const patientReferral = referrals.find((r) => r.patientId === patient.id);
            const patientAppt = appointments.find(
              (a) => a.patientId === patient.id && a.status !== 'Completed'
            );

            return (
              <div
                key={patient.id}
                className={`p-4 sm:p-5 hover:bg-slate-50 transition-all ${
                  patient.riskLevel === 'Emergency' || patient.riskLevel === 'Red'
                    ? 'bg-rose-50/30 border-l-4 border-l-rose-400'
                    : patient.riskLevel === 'Yellow'
                    ? 'border-l-4 border-l-amber-300'
                    : 'border-l-4 border-l-emerald-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{getRiskDot(patient.riskLevel)}</span>
                      <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                      <span className="text-xs text-slate-500">{patient.age}y · {patient.gender}</span>
                      <span className="text-[10px] font-mono text-slate-400">{patient.id}</span>
                      <StatusBadge type="risk" status={patient.riskLevel} />
                    </div>

                    {patient.riskReason && (
                      <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{patient.riskReason}</p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-rose-500" />
                        BP: <strong>{patient.latestVitals.bp}</strong>
                      </span>
                      <span>HR: <strong>{patient.latestVitals.heartRate}</strong> bpm</span>
                      <span>SpO₂: <strong>{patient.latestVitals.spO2}%</strong></span>
                      {patient.latestVitals.bloodSugar && (
                        <span>Sugar: <strong>{patient.latestVitals.bloodSugar} mg/dL</strong></span>
                      )}
                      <span className="text-slate-400">Recorded: {patient.latestVitals.recordedAt}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {patientReferral && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          patientReferral.urgency === 'Emergency'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : patientReferral.urgency === 'Urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-teal-100 text-teal-800 border border-teal-300'
                        }`}>
                          Referral {patientReferral.urgency}: {patientReferral.status}
                        </span>
                      )}
                      {patientAppt && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          <CalendarCheck className="w-3 h-3" />
                          Appt: {patientAppt.timeSlot}
                        </span>
                      )}
                      {patient.isPregnant && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                          Pregnant · {patient.pregnancyWeeks}w
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/doctor-patients/${patient.id}`)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Patient
                    </button>
                    <button
                      onClick={() => navigate(`/consultation/${patient.id}`)}
                      className="py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Start Consultation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {patients.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No patients assigned for today.
            </div>
          )}
        </div>
      </div>

      {/* Teleconsultation Quick Access */}
      <div className="bg-gradient-to-br from-violet-900 to-violet-800 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-violet-300" />
            <h3 className="font-bold text-sm">Teleconsultation Queue</h3>
          </div>
          <span className="bg-violet-700 text-violet-100 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            Available Now
          </span>
        </div>
        <p className="text-xs text-violet-200 leading-relaxed mb-3">
          Start a remote video consultation for patients referred by their ASHA worker who cannot visit the facility in person.
        </p>
        <button
          onClick={() => navigate('/teleconsultation/SS-PT-10021')}
          className="w-full py-2.5 px-4 bg-violet-500 hover:bg-violet-400 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
        >
          <Video className="w-4 h-4" />
          <span>Start Teleconsultation for High-Risk Patient</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
