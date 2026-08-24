import React from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileText,
  User,
  ShieldCheck,
  Heart,
  Activity,
  AlertCircle,
  Clock,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const MyHealthRecord: React.FC = () => {
  const { patients, auditLogs } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];

  const consentLogs = auditLogs.filter((a) => a.patientId === patient.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Personal Health Record</h1>
              <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-teal-600" /> Read Only
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Digital ABHA Care Record • {patient.id}</p>
          </div>
        </div>
      </div>

      {/* 1. Demographics & Identity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-700" />
          <span>Patient Demographics & Identification</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{patient.name}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Age & Gender</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{patient.age} Years • {patient.gender}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ABHA Digital ID</span>
            <p className="font-mono font-bold text-teal-800 text-xs mt-0.5">{patient.abhaId || '91-4829-1029-4412'}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Village & Address</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.village}</p>
            <p className="text-[11px] text-slate-500">{patient.address}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
            <p className="font-extrabold text-rose-700 text-sm mt-0.5">{patient.bloodGroup}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact</span>
            <p className="font-bold text-slate-900 mt-0.5">{patient.emergencyContact}</p>
          </div>
        </div>
      </div>

      {/* 2. Clinical Conditions, Allergies & Pregnancy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-600" />
          <span>Clinical Conditions & Risk Assessment</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <span className="text-[10px] font-bold text-rose-800 uppercase">Assessed Risk Level</span>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge type="risk" status={patient.riskLevel} />
            </div>
            <p className="text-[11px] text-rose-800 mt-2 leading-relaxed">{patient.riskReason}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Known Conditions</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patient.knownConditions.map((c, i) => (
                <span key={i} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Known Allergies</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patient.allergies.map((a, i) => (
                <span key={i} className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-700" /> {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vitals Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <span>Latest Recorded Vitals</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">BP</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.bp}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">Temperature</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.temp}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">Heart Rate</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.heartRate} bpm</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">SpO2</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.spO2}%</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold">Blood Sugar</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.bloodSugar || 110} mg/dL</p>
          </div>
        </div>
      </div>

      {/* 4. Care Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-700" />
          <span>Patient Care Journey Timeline</span>
        </h2>

        <div className="space-y-4 relative pl-6 border-l-2 border-teal-200 text-xs">
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white" />
            <p className="font-bold text-slate-900">1. Sub-Centre Registration</p>
            <p className="text-slate-500">Registered by Meena R at Kallipalayam Sub-Centre</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white" />
            <p className="font-bold text-slate-900">2. Smart Triage Screening</p>
            <p className="text-slate-500">Gestational hypertension detected (BP 150/95). Classified as Red High-Risk.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white" />
            <p className="font-bold text-teal-900 font-extrabold">3. Tertiary Hospital Referral</p>
            <p className="text-teal-800 font-medium">Referral REF-8831 sent & accepted by Coimbatore Medical College Hospital.</p>
          </div>

          <div className="relative opacity-60">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
            <p className="font-bold text-slate-700">4. Upcoming Consultation</p>
            <p className="text-slate-500">Scheduled for Aug 26 at CMCH High-Risk ANC Clinic.</p>
          </div>

          <div className="relative opacity-60">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
            <p className="font-bold text-slate-700">5. Home Follow-up</p>
            <p className="text-slate-500">ASHA worker visit scheduled post-consultation.</p>
          </div>
        </div>
      </div>

      {/* 5. Data Shared With Consent Activity Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data Shared with Consent Activity List</span>
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {consentLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900">{log.action}</p>
                <p className="text-slate-500 text-[11px]">{log.details}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Consented
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
