import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Share2,
  Filter,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react';

export const ReferralAnalytics: React.FC = () => {
  const { referrals } = useHealthData();
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = referrals.filter((r) => {
    if (priorityFilter === 'all') return true;
    return r.urgency.toLowerCase() === priorityFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Referral Analytics & Bottleneck Flow</h1>
            <p className="text-xs text-slate-500">District transfer completion rates & stage duration metrics</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-slate-700">Filter Priority:</span>
        {['all', 'Routine', 'Urgent', 'Emergency'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              priorityFilter === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Referral Flow Table with Masked Patient IDs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700">District Referral Registry (Masked Privacy Display)</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-600" /> View Only
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-4 font-bold">Referral ID</th>
                <th className="p-4 font-bold">Masked Patient ID</th>
                <th className="p-4 font-bold">Source → Destination</th>
                <th className="p-4 font-bold">Urgency</th>
                <th className="p-4 font-bold">Transport</th>
                <th className="p-4 font-bold">Current Stage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((ref) => {
                // Mask patient ID for official view (e.g., SS-PT-10***)
                const maskedId = `${ref.patientId.substring(0, 8)}***`;

                return (
                  <tr key={ref.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-teal-800">{ref.id}</td>
                    <td className="p-4 font-mono text-slate-700">{maskedId}</td>
                    <td className="p-4 font-bold text-slate-900">{ref.sourceFacility} → {ref.destinationFacility}</td>
                    <td className="p-4">
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${ref.urgency === 'Emergency' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {ref.urgency}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{ref.transportStatus || 'Self Transport'}</td>
                    <td className="p-4">
                      <StatusBadge type="referral" status={ref.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
