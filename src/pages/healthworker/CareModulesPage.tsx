import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Baby,
  Heart,
  Activity,
  Calendar,
  AlertTriangle,
  Plus,
  CheckCircle2,
  ChevronRight,
  User,
  ShieldAlert,
  Search,
  Stethoscope
} from 'lucide-react';

export const CareModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useHealthData();
  const [activeTab, setActiveTab] = useState<'maternal' | 'child' | 'chronic'>('maternal');
  const [searchTerm, setSearchTerm] = useState('');

  const maternalPatients = patients.filter((p) => p.isPregnant || p.gender === 'Female');
  const childPatients = patients.filter((p) => p.age <= 12);
  const chronicPatients = patients.filter(
    (p) =>
      p.knownConditions.some((c) =>
        c.toLowerCase().includes('diabetes') ||
        c.toLowerCase().includes('hypertension') ||
        c.toLowerCase().includes('cardiac') ||
        c.toLowerCase().includes('respiratory') ||
        c.toLowerCase().includes('tb')
      )
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-pink-200">
            Specialized Care Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Specialized Health Modules
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Longitudinal care tracking for Maternal, Child, and Chronic Condition management.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('maternal')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'maternal'
              ? 'bg-white text-pink-700 shadow-xs border border-pink-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Maternal Care (ANC/PNC)</span>
        </button>

        <button
          onClick={() => setActiveTab('child')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'child'
              ? 'bg-white text-sky-700 shadow-xs border border-sky-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Baby className="w-4 h-4 text-sky-500" />
          <span>Child Care &amp; Immunization</span>
        </button>

        <button
          onClick={() => setActiveTab('chronic')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'chronic'
              ? 'bg-white text-violet-700 shadow-xs border border-violet-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-violet-500" />
          <span>Chronic NCD Care</span>
        </button>
      </div>

      {/* Tab 1: Maternal Care */}
      {activeTab === 'maternal' && (
        <div className="space-y-4">
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-bold text-pink-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-600" />
              Maternal Health &amp; ANC Screening Protocol
            </h2>
            <p className="text-xs text-pink-800 leading-relaxed">
              Track antenatal care visits, high-risk pregnancy indicators (hypertension, severe anemia, gestational diabetes), tetanus toxoid immunization, IFA supplementation, and referral readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maternalPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-pink-300 transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                    <p className="text-xs text-slate-500">{patient.age}y · {patient.village}</p>
                    <p className="text-[11px] text-teal-700 font-mono font-bold">{patient.id}</p>
                  </div>
                  <StatusBadge type="risk" status={patient.riskLevel} />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Gestational Age:</span>
                    <span className="font-bold text-pink-700">{patient.pregnancyWeeks ?? 24} Weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Latest BP:</span>
                    <span className="font-bold text-slate-900">{patient.latestVitals.bp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Assigned Worker:</span>
                    <span className="font-semibold text-slate-700">{patient.assignedWorker}</span>
                  </div>
                </div>

                {patient.riskReason && (
                  <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 font-semibold">
                    ⚠️ {patient.riskReason}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="flex-1 py-2 px-3 bg-pink-50 hover:bg-pink-100 text-pink-800 font-bold rounded-xl text-xs transition-all border border-pink-200 flex items-center justify-center gap-1"
                  >
                    View ANC Log
                  </button>
                  <button
                    onClick={() => navigate(`/triage`)}
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                  >
                    Update Vitals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Child Care */}
      {activeTab === 'child' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-bold text-sky-900 flex items-center gap-2">
              <Baby className="w-4 h-4 text-sky-600" />
              Child Growth &amp; Immunization Tracking
            </h2>
            <p className="text-xs text-sky-800 leading-relaxed">
              Monitor infant growth parameters (height, weight, SAM/MAM screening), immunizations (BCG, OPV, Pentavalent, DPT, Measles), and acute respiratory infections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                    <p className="text-xs text-slate-500">{patient.age} years · {patient.gender} · {patient.village}</p>
                    <p className="text-[11px] text-teal-700 font-mono font-bold">{patient.id}</p>
                  </div>
                  <StatusBadge type="risk" status={patient.riskLevel} />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Weight:</span>
                    <span className="font-bold text-slate-900">{patient.latestVitals.weight ?? 13.5} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Immunization Due:</span>
                    <span className="font-bold text-sky-700">DPT Booster 1 (Aug 27)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mother/Caregiver Contact:</span>
                    <span className="font-semibold text-slate-700">{patient.emergencyContact}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-xl text-xs transition-all border border-sky-200"
                  >
                    View MCP Card
                  </button>
                  <button
                    onClick={() => navigate(`/follow-ups`)}
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Schedule Vaccination
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Chronic Condition Care */}
      {activeTab === 'chronic' && (
        <div className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-bold text-violet-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-600" />
              Non-Communicable Disease (NCD) &amp; Chronic Care
            </h2>
            <p className="text-xs text-violet-800 leading-relaxed">
              Longitudinal surveillance for Type 2 Diabetes, Hypertension, Asthma, and Cardiac illness. Ensures medication adherence, periodic blood sugar &amp; BP monitoring, and NCD clinic appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chronicPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-violet-300 transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                    <p className="text-xs text-slate-500">{patient.age}y · {patient.gender} · {patient.village}</p>
                    <p className="text-[11px] text-teal-700 font-mono font-bold">{patient.id}</p>
                  </div>
                  <StatusBadge type="risk" status={patient.riskLevel} />
                </div>

                <div className="flex flex-wrap gap-1">
                  {patient.knownConditions.map((c) => (
                    <span key={c} className="bg-violet-100 text-violet-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-violet-200">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Latest Vitals:</span>
                    <span className="font-bold text-slate-900">BP {patient.latestVitals.bp} · Sugar {patient.latestVitals.bloodSugar ?? 140} mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Refill Due:</span>
                    <span className="font-bold text-amber-700">Aug 25, 2026 (Metformin 500mg)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="flex-1 py-2 px-3 bg-violet-50 hover:bg-violet-100 text-violet-800 font-bold rounded-xl text-xs transition-all border border-violet-200"
                  >
                    View NCD History
                  </button>
                  <button
                    onClick={() => navigate(`/appointments/book`)}
                    className="flex-1 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Book NCD Clinic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
