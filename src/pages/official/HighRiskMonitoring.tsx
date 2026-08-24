import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Activity,
  AlertOctagon,
  Lock,
  Clock,
  ChevronRight,
  X,
  Building2,
  Heart
} from 'lucide-react';

export const HighRiskMonitoring: React.FC = () => {
  const { patients } = useHealthData();
  const [selectedPatientTimeline, setSelectedPatientTimeline] = useState<any | null>(null);

  const highRiskPatients = patients.filter((p) => p.riskLevel === 'Red' || p.riskLevel === 'Emergency' || p.riskLevel === 'Yellow');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Anonymized High-Risk Monitoring</h1>
            <p className="text-xs text-slate-500">Maternal high-risk ANC, cardiac emergencies, & NCD follow-up gap tracking</p>
          </div>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-[10px] font-bold text-rose-800 uppercase">High-Risk Pregnancies</span>
          <p className="font-extrabold text-rose-700 text-2xl mt-1">1</p>
          <span className="text-[10px] text-rose-800 font-semibold">BP 150/95 Gestational Hypertension</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-[10px] font-bold text-amber-800 uppercase">Overdue Child Immunizations</span>
          <p className="font-extrabold text-amber-800 text-2xl mt-1">1</p>
          <span className="text-[10px] text-amber-700 font-semibold">DPT Booster 1 Due</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs bg-teal-50/20">
          <span className="text-[10px] font-bold text-teal-800 uppercase">Chronic NCD Refills Due</span>
          <p className="font-extrabold text-teal-900 text-2xl mt-1">1</p>
          <span className="text-[10px] text-teal-700 font-semibold">Diabetes & Hypertension</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-xs bg-red-50/20">
          <span className="text-[10px] font-bold text-red-800 uppercase">Emergency Cardiac Referrals</span>
          <p className="font-extrabold text-red-700 text-2xl mt-1">1</p>
          <span className="text-[10px] text-red-800 font-bold">ST Elevation CCU Transfer</span>
        </div>
      </div>

      {/* Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700">Anonymized High-Risk Patient Registry</span>
          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3 text-rose-600" /> Read-Only Administrative View
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-4 font-bold">Masked Patient ID</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Assigned Facility</th>
                <th className="p-4 font-bold">ASHA Worker</th>
                <th className="p-4 font-bold">Next Action Due</th>
                <th className="p-4 font-bold">Risk Level</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {highRiskPatients.map((p) => {
                const maskedId = `${p.id.substring(0, 8)}***`;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-slate-900">{maskedId}</td>
                    <td className="p-4 text-slate-700">{p.isPregnant ? 'Maternal ANC' : 'NCD / Chronic'}</td>
                    <td className="p-4 text-slate-800">{p.facility}</td>
                    <td className="p-4 text-slate-600">{p.assignedWorker}</td>
                    <td className="p-4 font-bold text-teal-800">{p.nextActionDue}</td>
                    <td className="p-4">
                      <StatusBadge type="risk" status={p.riskLevel} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedPatientTimeline(p)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-[11px] flex items-center gap-1 inline-flex"
                      >
                        <span>View Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Timeline Drawer */}
      {selectedPatientTimeline && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedPatientTimeline(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-slate-900 text-base">
              Read-Only Care Timeline: {selectedPatientTimeline.id.substring(0, 8)}***
            </h3>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 font-medium">
              Risk Diagnosis: {selectedPatientTimeline.riskReason}
            </div>

            <div className="space-y-3 border-l-2 border-teal-200 pl-4 text-xs font-medium">
              <div>
                <p className="font-bold text-slate-900">Registration</p>
                <p className="text-slate-500">Enrolled at {selectedPatientTimeline.facility}</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Latest Vitals Record</p>
                <p className="text-slate-500">BP {selectedPatientTimeline.latestVitals.bp} recorded by {selectedPatientTimeline.latestVitals.recordedBy}</p>
              </div>
              <div>
                <p className="font-bold text-teal-800">Current Next Action</p>
                <p className="text-teal-700 font-bold">{selectedPatientTimeline.nextActionDue}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatientTimeline(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Close Care Timeline Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
