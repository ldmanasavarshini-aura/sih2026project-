import React from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  Share2,
  Pill,
  HeartPulse,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const QUALITY_METRICS = [
  { metric: 'Average Patient Waiting Time', value: '18 mins', target: '< 20 mins', status: 'Optimal', icon: Clock },
  { metric: 'Average Consultation Duration', value: '12 mins', target: '10 - 15 mins', status: 'Optimal', icon: Award },
  { metric: 'Referral Completion Rate', value: '92.4%', target: '> 85%', status: 'Exceeding Target', icon: Share2 },
  { metric: 'High-Risk Patient Response Time', value: '14 mins', target: '< 30 mins', status: 'Optimal', icon: HeartPulse },
  { metric: 'Essential Medicine Stock Availability', value: '94.8%', target: '> 90%', status: 'Optimal', icon: Pill },
  { metric: 'Teleconsultation Success Rate', value: '96.2%', target: '> 90%', status: 'Exceeding Target', icon: CheckCircle2 }
];

export const QualityMonitoringPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
            Public Healthcare Quality &amp; Accountability Monitoring
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Healthcare Service Quality &amp; KPI Metrics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitoring response times, referral completion rates, and care accountability metrics across Coimbatore facilities.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUALITY_METRICS.map((qm) => {
          const Icon = qm.icon;
          return (
            <div key={qm.metric} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold text-slate-700">{qm.metric}</span>
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-slate-900">{qm.value}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {qm.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Target Standard: <strong>{qm.target}</strong></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
