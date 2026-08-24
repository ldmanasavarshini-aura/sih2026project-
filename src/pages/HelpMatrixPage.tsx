import React from 'react';
import { ShieldCheck, Check, X, Eye } from 'lucide-react';

export const HelpMatrixPage: React.FC = () => {
  const matrix = [
    { feature: 'View own patient record', citizen: 'Yes', worker: 'Yes', official: 'Aggregated / authorized view' },
    { feature: 'Edit patient details', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'Register patient', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'Record vitals', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'Perform triage', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'Book appointment', citizen: 'View only', worker: 'Yes', official: 'View only' },
    { feature: 'Create referral', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'Update referral', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'View referral status', citizen: 'Yes', worker: 'Yes', official: 'Yes' },
    { feature: 'View medicines and diagnostics', citizen: 'Yes', worker: 'Yes', official: 'Yes' },
    { feature: 'Record follow-up', citizen: 'No', worker: 'Yes', official: 'No' },
    { feature: 'View analytics', citizen: 'No', worker: 'Limited', official: 'Yes' },
    { feature: 'Export reports', citizen: 'No', worker: 'Limited', official: 'Yes' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Role-Based Permission Matrix</h1>
            <p className="text-xs text-slate-500">Official security governance & access control specification</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-4 font-bold">Feature / Action</th>
                <th className="p-4 font-bold text-teal-900 bg-teal-50/70 border-x border-teal-200">Citizen / Patient</th>
                <th className="p-4 font-bold text-emerald-900 bg-emerald-50/70 border-r border-emerald-200">Health Worker</th>
                <th className="p-4 font-bold text-indigo-900 bg-indigo-50/70">Higher Official</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{row.feature}</td>
                  <td className="p-4 border-x border-slate-100 bg-teal-50/30 font-semibold">
                    {row.citizen === 'Yes' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Yes
                      </span>
                    ) : row.citizen === 'No' ? (
                      <span className="text-rose-600 flex items-center gap-1">
                        <X className="w-4 h-4" /> No
                      </span>
                    ) : (
                      <span className="text-teal-700 flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {row.citizen}
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-r border-slate-100 bg-emerald-50/30 font-semibold">
                    {row.worker === 'Yes' ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" /> Yes (Create + Edit)
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        {row.worker}
                      </span>
                    )}
                  </td>
                  <td className="p-4 bg-indigo-50/30 font-semibold">
                    {row.official === 'Yes' ? (
                      <span className="text-indigo-700 flex items-center gap-1">
                        <Check className="w-4 h-4 text-indigo-600" /> Yes
                      </span>
                    ) : row.official === 'No' ? (
                      <span className="text-rose-600 flex items-center gap-1">
                        <X className="w-4 h-4" /> No (View Only)
                      </span>
                    ) : (
                      <span className="text-indigo-800 flex items-center gap-1">
                        <Eye className="w-4 h-4 text-indigo-600" /> {row.official}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
