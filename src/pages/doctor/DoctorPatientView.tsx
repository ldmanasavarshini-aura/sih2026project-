import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  User,
  HeartPulse,
  Stethoscope,
  Video,
  AlertTriangle,
  Pill,
  Share2,
  Clock,
  TestTube,
  Brain,
  Info,
  Phone,
  MapPin,
  Droplets
} from 'lucide-react';

export const DoctorPatientView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { patients, referrals, appointments, medicines, followUps, testResults } = useHealthData();

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <AlertTriangle className="w-12 h-12 text-rose-400" />
        <p className="text-lg font-bold text-slate-700">Patient not found.</p>
        <button
          onClick={() => navigate('/doctor-patients')}
          className="text-sm text-violet-700 font-bold hover:underline"
        >
          ← Back to Queue
        </button>
      </div>
    );
  }

  const patientReferrals = referrals.filter((r) => r.patientId === patient.id);
  const patientAppts = appointments.filter((a) => a.patientId === patient.id);
  const patientMeds = medicines.filter((m) => m.patientId === patient.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === patient.id);
  const patientTests = testResults.filter((t) => t.patientId === patient.id);

  const aiRiskScore =
    patient.riskLevel === 'Emergency' ? 92 :
    patient.riskLevel === 'Red' ? 78 :
    patient.riskLevel === 'Yellow' ? 45 : 18;

  const aiRiskColor =
    patient.riskLevel === 'Emergency' || patient.riskLevel === 'Red' ? 'rose' :
    patient.riskLevel === 'Yellow' ? 'amber' : 'emerald';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/doctor-patients')}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Queue
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/teleconsultation/${patient.id}`)}
            className="py-2 px-4 bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold rounded-xl text-xs flex items-center gap-2 border border-violet-200 transition-all"
          >
            <Video className="w-4 h-4" />
            Start Teleconsultation
          </button>
          <button
            onClick={() => navigate(`/consultation/${patient.id}`)}
            className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            Start Consultation
          </button>
        </div>
      </div>

      {/* Patient Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-800 font-extrabold text-xl flex items-center justify-center shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-slate-900">{patient.name}</h1>
              <StatusBadge type="risk" status={patient.riskLevel} />
              {patient.isPregnant && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                  Pregnant · {patient.pregnancyWeeks}w
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {patient.age}y · {patient.gender}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {patient.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {patient.village}</span>
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-rose-400" /> {patient.bloodGroup}</span>
              <span className="font-mono text-teal-700 font-bold">{patient.id}</span>
            </div>
            {patient.riskReason && (
              <p className="mt-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                ⚠️ {patient.riskReason}
              </p>
            )}
          </div>
        </div>

        {/* Vitals Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Blood Pressure', value: patient.latestVitals.bp },
            { label: 'Heart Rate', value: `${patient.latestVitals.heartRate} bpm` },
            { label: 'SpO₂', value: `${patient.latestVitals.spO2}%` },
            { label: 'Temperature', value: patient.latestVitals.temp },
            { label: 'Blood Sugar', value: patient.latestVitals.bloodSugar ? `${patient.latestVitals.bloodSugar} mg/dL` : 'N/A' },
          ].map((v) => (
            <div key={v.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{v.label}</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{v.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          Vitals recorded by {patient.latestVitals.recordedBy} at {patient.latestVitals.recordedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Medical Timeline */}
        <div className="lg:col-span-2 space-y-4">

          {/* Known Conditions & Allergies */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" /> Medical Background
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Known Conditions</p>
                {patient.knownConditions.map((c) => (
                  <span key={c} className="block text-xs font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 mb-1">{c}</span>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Allergies</p>
                {patient.allergies.map((a) => (
                  <span key={a} className={`block text-xs font-semibold px-2 py-1 rounded-lg border mb-1 ${a === 'None' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>{a}</span>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Medicines</p>
                {patient.currentMedicines.map((m) => (
                  <span key={m} className="block text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 mb-1">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" /> Medical Timeline
            </h2>

            {/* Test Results */}
            {patientTests.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><TestTube className="w-3 h-3" /> Lab Results</p>
                <div className="space-y-2">
                  {patientTests.map((t) => (
                    <div key={t.id} className={`p-3 rounded-xl border text-xs ${t.isAbnormal ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{t.testName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.isAbnormal ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {t.isAbnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </div>
                      {t.resultSummary && <p className="text-slate-700 mt-1">{t.resultSummary}</p>}
                      <p className="text-slate-400 text-[10px] mt-1">Result: {t.resultDate} · {t.facility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescriptions */}
            {patientMeds.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Pill className="w-3 h-3" /> Active Prescriptions</p>
                <div className="space-y-2">
                  {patientMeds.map((m) => (
                    <div key={m.id} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-900">{m.medicineName}</span>
                      <p className="text-emerald-700 mt-0.5">{m.dosage} · {m.frequency} · {m.duration}</p>
                      <p className="text-slate-400 text-[10px] mt-1">By {m.prescribedBy} on {m.prescribedDate} · Refill due: {m.refillDueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referrals */}
            {patientReferrals.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Share2 className="w-3 h-3" /> Referrals</p>
                <div className="space-y-2">
                  {patientReferrals.map((r) => (
                    <div key={r.id} className={`p-3 rounded-xl border text-xs ${r.urgency === 'Emergency' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">{r.id} — {r.reason.slice(0, 60)}...</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">{r.status}</span>
                      </div>
                      <p className="text-slate-600 mt-1">To: {r.destinationFacility} · Urgency: <strong>{r.urgency}</strong></p>
                      <p className="text-slate-400 text-[10px] mt-1">Created {r.createdAt} by {r.referringWorker}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appointments */}
            {patientAppts.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Appointments</p>
                <div className="space-y-2">
                  {patientAppts.map((a) => (
                    <div key={a.id} className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs">
                      <span className="font-bold text-sky-900">{a.doctorName} — {a.specialty}</span>
                      <p className="text-sky-700 mt-0.5">{a.date} at {a.timeSlot} · Token: {a.queueToken}</p>
                      <p className="text-slate-400 text-[10px] mt-1">{a.facility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-ups */}
            {patientFollowUps.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Follow-up Tasks</p>
                <div className="space-y-2">
                  {patientFollowUps.map((f) => (
                    <div key={f.id} className={`p-3 rounded-xl border text-xs ${f.status === 'Overdue' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                      <span className="font-bold text-slate-900">{f.purpose}</span>
                      <p className="text-slate-600 mt-0.5">Due: {f.dueDate} · {f.category} · <strong>{f.status}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Risk Assessment */}
        <div className="space-y-4">
          <div className={`bg-${aiRiskColor}-50 border-2 border-${aiRiskColor}-200 rounded-2xl p-5 space-y-3`}>
            <div className="flex items-center gap-2">
              <Brain className={`w-5 h-5 text-${aiRiskColor}-600`} />
              <h2 className="text-sm font-bold text-slate-900">AI-Assisted Clinical Decision Support</h2>
            </div>

            <div className={`flex items-center gap-3 p-3 bg-${aiRiskColor}-100 rounded-xl border border-${aiRiskColor}-200`}>
              <div className={`text-3xl font-extrabold text-${aiRiskColor}-700`}>{aiRiskScore}</div>
              <div>
                <p className={`text-xs font-bold text-${aiRiskColor}-900`}>Risk Score / 100</p>
                <StatusBadge type="risk" status={patient.riskLevel} />
              </div>
            </div>

            <div className={`p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs`}>
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 font-medium">
                This is an AI-assisted risk estimate to support clinical decision-making. It is <strong>not</strong> a confirmed diagnosis. Final clinical judgement rests with the attending doctor.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Indicators</p>
              <div className="space-y-1.5">
                {patient.knownConditions.map((c) => (
                  <div key={c} className={`flex items-center gap-2 text-xs font-semibold text-${aiRiskColor}-900 bg-${aiRiskColor}-50 px-2 py-1 rounded-lg border border-${aiRiskColor}-200`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {patient.riskReason && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Warning Signs Detected</p>
                <p className={`text-xs font-semibold text-${aiRiskColor}-800 bg-${aiRiskColor}-100 p-2 rounded-lg`}>
                  {patient.riskReason}
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Recommended Priority</p>
              <p className={`text-sm font-bold text-${aiRiskColor}-900`}>
                {patient.riskLevel === 'Emergency' ? '🚨 Emergency — Immediate intervention required' :
                 patient.riskLevel === 'Red' ? '🔴 High Priority — Urgent specialist consultation' :
                 patient.riskLevel === 'Yellow' ? '🟡 Medium — Routine review within 24–48 hours' :
                 '🟢 Low — Regular monitoring schedule'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Doctor Actions</h3>
            <button
              onClick={() => navigate(`/consultation/${patient.id}`)}
              className="w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Stethoscope className="w-4 h-4" />
              Start Consultation
            </button>
            <button
              onClick={() => navigate(`/teleconsultation/${patient.id}`)}
              className="w-full py-2.5 px-3 bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all"
            >
              <Video className="w-4 h-4" />
              Start Teleconsultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
