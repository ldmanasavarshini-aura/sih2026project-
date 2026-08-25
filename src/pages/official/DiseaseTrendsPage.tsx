import React from 'react';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Building2,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

const DISEASE_TRENDS = [
  { id: 'DT-01', disease: 'Gestational Hypertension / High-Risk ANC', cases: 142, trend: '+12% this week', riskStatus: 'Increasing', district: 'Coimbatore', primarySubCentre: 'Kallipalayam & Annur Sector' },
  { id: 'DT-02', disease: 'Type 2 Diabetes Mellitus (NCD Surveillance)', cases: 384, trend: '+4% this week', riskStatus: 'Normal', district: 'Coimbatore', primarySubCentre: 'Neelambur PHC' },
  { id: 'DT-03', disease: 'Acute Respiratory Infections / TB Screenings', cases: 98, trend: '+18% this week', riskStatus: 'High Alert', district: 'Coimbatore', primarySubCentre: 'Neelambur PHC' },
  { id: 'DT-04', disease: 'Ischemic Heart Disease / Acute Cardiac', cases: 46, trend: '-2% this week', riskStatus: 'Normal', district: 'Coimbatore', primarySubCentre: 'Annur Government Hospital' }
];

export const DiseaseTrendsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
            District Disease Surveillance &amp; Epidemiological Trends
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Disease Trends &amp; Outbreak Surveillance
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Aggregated non-identifying health indicators for public health officers and district planning.
          </p>
        </div>
      </div>

      {/* Disease Surveillance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISEASE_TRENDS.map((dt) => (
          <div key={dt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{dt.disease}</span>
                <p className="text-xs text-slate-500 mt-0.5">{dt.district} District · {dt.primarySubCentre}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                dt.riskStatus === 'High Alert' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                dt.riskStatus === 'Increasing' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {dt.riskStatus === 'High Alert' ? '🔴 High Alert' : dt.riskStatus === 'Increasing' ? '🟡 Increasing' : '🟢 Normal'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Active Reported Cases</span>
                <span className="text-xl font-extrabold text-slate-900">{dt.cases}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Weekly Delta</span>
                <span className={`font-bold flex items-center gap-1 ${
                  dt.trend.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" /> {dt.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
