import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Lock
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('Aug 2026');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = (format: 'CSV' | 'PDF', reportTitle: string) => {
    setExportMessage(`Generating & Downloading ${reportTitle} (${format})...`);
    setTimeout(() => {
      setExportMessage(null);
    }, 3000);
  };

  const reports = [
    {
      id: 'REP-01',
      title: 'Weekly Facility Performance & Patient Load Report',
      description: 'Consultation counts, staff attendance, queue wait times, and sub-centre turnout.',
      type: 'Performance KPI'
    },
    {
      id: 'REP-02',
      title: 'Maternal & Child Health (MCH) Follow-up Audit Report',
      description: 'ASHA home visit completion rates, gestational hypertension tracking, and DPT immunization coverage.',
      type: 'MCH Audit'
    },
    {
      id: 'REP-03',
      title: '6-Stage Referral Pipeline & Turnaround Analytics',
      description: 'End-to-end referral completion percentage, transport bottleneck delays, and emergency escalation logs.',
      type: 'Referrals'
    },
    {
      id: 'REP-04',
      title: 'Medicine & Diagnostic Stock Availability Matrix',
      description: 'Inventory levels of Metformin, Amlodipine, IFA, Insulin, lab test supplies, and stock-out incidents.',
      type: 'Supply Chain'
    },
    {
      id: 'REP-05',
      title: 'Hospital OPD Queue & Waiting-Time Threshold Summary',
      description: 'Peak hour waiting time averages and queue token throughput for District Hospitals and PHCs.',
      type: 'Operations'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notice */}
      {exportMessage && (
        <div className="fixed top-16 right-4 z-50 bg-teal-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Download className="w-4 h-4 text-teal-300 animate-bounce" />
          <span>{exportMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">District Healthcare Reports & Exports</h1>
            <p className="text-xs text-slate-500">Official government compliance & performance reporting engine</p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Date Filter:</span>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
          >
            <option value="Aug 2026">August 2026 (Current Month)</option>
            <option value="Jul 2026">July 2026</option>
            <option value="Q3 2026">Q3 2026 Aggregate</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Facility Filter:</span>
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
          >
            <option value="all">All District Public Facilities</option>
            <option value="Neelambur PHC">Neelambur PHC</option>
            <option value="CMCH">Coimbatore Medical College Hospital</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  {rep.id}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {rep.type}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{rep.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExport('CSV', rep.title)}
                className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => handleExport('PDF', rep.title)}
                className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
