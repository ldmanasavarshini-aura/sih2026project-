import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  Users,
  Clock,
  Share2,
  Lock,
  ChevronRight,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const FacilityPerformance: React.FC = () => {
  const { facilities } = useHealthData();
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Public Facility Performance</h1>
            <p className="text-xs text-slate-500">District hospital, PHC, & sub-centre operational monitoring</p>
          </div>
        </div>
      </div>

      {/* Facility Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-4 font-bold">Facility Name</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Doctors / Staff</th>
                <th className="p-4 font-bold">Active Queue</th>
                <th className="p-4 font-bold">Patient Load</th>
                <th className="p-4 font-bold">Referral Completion</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{fac.name}</td>
                  <td className="p-4">
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {fac.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{fac.doctorsAvailable} Doctors / {fac.staffCount} Staff</td>
                  <td className="p-4 text-slate-800 font-mono font-bold">{fac.activeQueueCount} Patients</td>
                  <td className="p-4">
                    <span className={`font-bold ${fac.patientLoad === 'Overloaded' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {fac.patientLoad}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-700 h-full" style={{ width: `${fac.referralCompletionRate}%` }} />
                      </div>
                      <span className="font-extrabold text-teal-900">{fac.referralCompletionRate}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedFacility(fac)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-[11px] flex items-center gap-1 inline-flex"
                    >
                      <span>View Drawer</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility Detail Drawer Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedFacility(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-700" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedFacility.name}</h3>
                <p className="text-xs text-slate-500">{selectedFacility.type} • {selectedFacility.villageOrTaluk}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Active Queue Count:</span>
                <strong className="text-slate-900">{selectedFacility.activeQueueCount} Patients</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Average Wait Time:</span>
                <strong className="text-slate-900">{selectedFacility.avgWaitMinutes} Minutes</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Referral Completion Rate:</span>
                <strong className="text-teal-800 font-extrabold">{selectedFacility.referralCompletionRate}%</strong>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Official Monitoring View: Records cannot be mutated from administrator accounts.</span>
            </div>

            <button
              onClick={() => setSelectedFacility(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
            >
              Close Performance Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
