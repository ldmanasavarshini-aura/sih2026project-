import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Building2,
  Lock,
  Activity,
  CheckCircle2,
  Clock,
  AlertOctagon,
  PackageX,
  Filter,
  Siren,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  MapPin
} from 'lucide-react';

export const OfficialDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { facilities, referrals, stocks } = useHealthData();

  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState('all');

  // Chart Mock Datasets
  const referralTrendData = [
    { day: 'Mon', created: 24, completed: 21 },
    { day: 'Tue', created: 30, completed: 28 },
    { day: 'Wed', created: 45, completed: 40 },
    { day: 'Thu', created: 38, completed: 35 },
    { day: 'Fri', created: 52, completed: 48 },
    { day: 'Sat', created: 28, completed: 26 },
    { day: 'Sun', created: 18, completed: 17 }
  ];

  const facilityVolumeData = [
    { name: 'Kallipalayam Sub-Centre', consultations: 142 },
    { name: 'Neelambur PHC', consultations: 420 },
    { name: 'Annur GH', consultations: 680 },
    { name: 'CMCH Hospital', consultations: 1250 }
  ];

  const highRiskDonutData = [
    { name: 'High-Risk Pregnancy (ANC)', value: 45, color: '#0F766E' },
    { name: 'Cardiac / Emergency', value: 20, color: '#DC2626' },
    { name: 'Uncontrolled Diabetes', value: 25, color: '#F59E0B' },
    { name: 'TB & Respiratory', value: 10, color: '#0284C7' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Official View-Only Banner */}
      <div className="bg-indigo-900 text-indigo-50 p-4 rounded-2xl border border-indigo-800 shadow-sm flex items-start gap-3">
        <Lock className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-white mb-0.5">Higher Official Analytics Mode (View Only)</p>
          <p className="text-indigo-100 leading-relaxed">
            {t('official_view_banner')}
          </p>
        </div>
      </div>

      {/* Header Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
              District Health Officer Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">DHO-CBE-001</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            District Health Overview — {selectedDistrict}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time public health monitoring across 4 facilities & 12 sub-centres
          </p>
        </div>

        {/* View Filters & Map Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => navigate('/healthcare-map')}
            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <MapPin className="w-4 h-4 text-indigo-200" />
            <span>Maharashtra Map Monitoring</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={selectedFacilityFilter}
              onChange={(e) => setSelectedFacilityFilter(e.target.value)}
              className="p-1.5 bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All District Facilities</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 7 Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Consultations</span>
          <p className="font-extrabold text-slate-900 text-xl mt-0.5">2,492</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12% vs last week
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-teal-200 shadow-xs text-center bg-teal-50/20">
          <span className="text-[10px] font-bold text-teal-800 uppercase">Referral Completion</span>
          <p className="font-extrabold text-teal-900 text-xl mt-0.5">88%</p>
          <span className="text-[10px] text-teal-700 font-semibold">Target: 85%</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Turnaround</span>
          <p className="font-extrabold text-slate-900 text-xl mt-0.5">4.2 hrs</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Sub-centre to Hospital</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs text-center bg-amber-50/20">
          <span className="text-[10px] font-bold text-amber-800 uppercase">Overdue Follow-ups</span>
          <p className="font-extrabold text-amber-800 text-xl mt-0.5">12</p>
          <span className="text-[10px] text-amber-700 font-bold">ASHA Home Visits</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs text-center bg-rose-50/20">
          <span className="text-[10px] font-bold text-rose-800 uppercase">Open High Risk</span>
          <p className="font-extrabold text-rose-700 text-xl mt-0.5">18</p>
          <span className="text-[10px] text-rose-700 font-bold">Maternal / Cardiac</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-red-200 shadow-xs text-center bg-red-50/20">
          <span className="text-[10px] font-bold text-red-800 uppercase">Stock-outs</span>
          <p className="font-extrabold text-red-700 text-xl mt-0.5">2</p>
          <span className="text-[10px] text-red-800 font-bold">Insulin @ Neelambur</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-xs text-center bg-indigo-50/20">
          <span className="text-[10px] font-bold text-indigo-800 uppercase">Diagnostic Gaps</span>
          <p className="font-extrabold text-indigo-900 text-xl mt-0.5">1</p>
          <span className="text-[10px] text-indigo-700 font-semibold">X-Ray Film Stock</span>
        </div>
      </div>

      {/* Recharts Graphical Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Referral Completion Trend Line */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">7-Day Referral Pipeline Completion Trend</h3>
            <span className="text-[10px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded-full">
              Live Flow
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={referralTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="created" name="Referrals Created" stroke="#0284C7" strokeWidth={2.5} />
                <Line type="monotone" dataKey="completed" name="Completed Consultations" stroke="#0F766E" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Consultation Volume by Facility Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Weekly Patient OPD Volume by Facility</h3>
            <span className="text-[10px] text-indigo-800 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
              Load Monitoring
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="consultations" name="Consultations" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row Charts: High-Risk Category Donut & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Risk Category Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Active High-Risk Case Distribution</h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={highRiskDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {highRiskDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {highRiskDonutData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Action-Required Operational Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>District Action Required Alerts (View Only)</span>
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              4 Bottlenecks
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-red-900 text-sm">Insulin Stock-Out Alert</span>
                <p className="text-red-800 mt-0.5">
                  Neelambur PHC reports 0 vials of Human Insulin. Emergency requisition order sent to District Drug Store.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-md shrink-0">
                CRITICAL
              </span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-rose-900 text-sm">Emergency Referral Delay</span>
                <p className="text-rose-800 mt-0.5">
                  Murugan (Annur GH → CMCH) 108 ambulance transfer pending arrival confirmation (ETA 15 mins).
                </p>
              </div>
              <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-md shrink-0">
                URGENT
              </span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-amber-900 text-sm">High Queue Threshold at CMCH OPD</span>
                <p className="text-amber-800 mt-0.5">
                  Coimbatore Medical College Hospital active OPD queue exceeded 140 patients. Avg wait time 55 mins.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-md shrink-0">
                MONITOR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
