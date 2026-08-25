import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Brain, Zap, Package, Users } from 'lucide-react';
import type { UserSession } from '../App';
import { villageRisks, clinics } from '../data/mock';
import type { StockLevel } from '../data/mock';
import { useLanguage } from '../contexts/LanguageContext';
import { ClinicMap as GoogleClinicMap } from '../ClinicMap';
import { getRecommendedActions } from '../recommendedActions';

interface Props {
  page: string;
  session: UserSession;
}

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-start">
      {icon && <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>{icon}</div>}
      <div>
        <div className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 70) return <span className="font-mono font-bold text-red-600">{score}</span>;
  if (score >= 50) return <span className="font-mono font-bold text-amber-600">{score}</span>;
  return <span className="font-mono font-bold text-emerald-600">{score}</span>;
}

function Overview({ session }: { session: UserSession }) {
  const { t } = useLanguage();
  const highRisk = villageRisks.filter(v => v.score >= 70).length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.patientsToday')} value="2,847" sub={t('admin.districtInfo')} color="text-blue-600" icon={<Users size={18} className="text-blue-600" />} />
        <StatCard label={t('admin.criticalSubcenters')} value={highRisk} sub={t('register.priority')} color="text-red-600" icon={<AlertTriangle size={18} className="text-red-600" />} />
        <StatCard label={t('dashboard.referralsMade')} value={14} sub={t('common.urgent')} color="text-purple-600" icon={<TrendingUp size={18} className="text-purple-600" />} />
        <StatCard label={t('admin.medicineStock')} value={6} sub={t('common.urgent')} color="text-amber-600" icon={<Package size={18} className="text-amber-600" />} />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Critical: Titwala risk score spiked to 79 (+12 this week)</p>
            <p className="text-red-600 text-xs mt-0.5">Water contamination detected + malaria cases rising. AI recommends immediate water testing camp and malaria screening. See AI Insights for full analysis.</p>
          </div>
          <button className="ml-auto flex-shrink-0 text-xs bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">{t('common.urgent')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">{t('admin.riskHeatmap')}</h3>
          </div>
          <div className="p-4 space-y-2">
            {villageRisks.map(v => (
              <div key={v.village} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 w-20 flex-shrink-0">{v.village}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${v.score >= 70 ? 'bg-red-500' : v.score >= 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${v.score}%` }}
                  />
                </div>
                <ScoreBadge score={v.score} />
                {v.trend === 'up' ? <TrendingUp size={13} className="text-red-500 flex-shrink-0" /> : v.trend === 'down' ? <TrendingDown size={13} className="text-emerald-500 flex-shrink-0" /> : <Minus size={13} className="text-slate-400 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">{t('admin.totalClinics')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {clinics.map(clinic => (
              <div key={clinic.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${clinic.status === 'operational' ? 'bg-emerald-400' : clinic.status === 'understaffed' ? 'bg-amber-400' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800">{clinic.name}</div>
                  <div className="text-xs text-slate-400">{clinic.location} &bull; {clinic.doctors} doctor{clinic.doctors > 1 ? 's' : ''}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${clinic.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : clinic.status === 'understaffed' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {clinic.status === 'operational' ? t('admin.stockOperational') : clinic.status === 'understaffed' ? t('admin.stockUnderstaffed') : t('admin.stockCritical')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskMap() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{t('admin.riskHeatmap')}</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> {t('common.highRisk')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> {t('common.mediumRisk')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> {t('common.lowRisk')}</span>
          </div>
        </div>

        {/* Visual heatmap grid */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {villageRisks.map(v => (
              <div key={v.village} className={`rounded-xl p-4 border-2 ${v.score >= 70 ? 'bg-red-50 border-red-300' : v.score >= 50 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800 text-sm">{v.village}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${v.trend === 'up' ? 'bg-red-100' : v.trend === 'down' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {v.trend === 'up' ? <TrendingUp size={12} className="text-red-600" /> : v.trend === 'down' ? <TrendingDown size={12} className="text-emerald-600" /> : <Minus size={12} className="text-slate-400" />}
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-1 ${v.score >= 70 ? 'text-red-600' : v.score >= 50 ? 'text-amber-600' : 'text-emerald-600'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {v.score}
                </div>
                <div className="text-xs text-slate-500 mb-2">{v.activeCases} active cases &bull; Pop. {v.population.toLocaleString()}</div>
                <div className="text-xs text-slate-600 leading-snug">{v.primaryRisk}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 text-white rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Google Maps integration shows clinic locations + risk overlays</p>
            <p className="text-xs text-slate-500">Maps API: green pins = operational PHC, amber = understaffed, red = critical stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockPill({ level }: { level: StockLevel }) {
  const { t } = useLanguage();
  if (level === 'high') return <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold">{t('common.highRisk').split(' ')[0]}</span>;
  if (level === 'medium') return <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">{t('common.mediumRisk').split(' ')[0]}</span>;
  if (level === 'low') return <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-semibold">{t('common.lowRisk').split(' ')[0]}</span>;
  return <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">Out</span>;
}

function ClinicsStock() {
  const { t } = useLanguage();
  const medicineNames: Record<string, string> = {
    paracetamol: 'Paracetamol',
    amoxicillin: 'Amoxicillin',
    metformin: 'Metformin',
    iron_folic: 'Iron-Folic Acid',
    ors: 'ORS Packets',
    amlodipine: 'Amlodipine',
  };

  return (
    <div className="space-y-4">
      {clinics.map(clinic => (
        <div key={clinic.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className={`px-5 py-3.5 border-b flex items-center gap-3 ${clinic.status === 'critical' ? 'bg-red-50 border-red-200' : clinic.status === 'understaffed' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${clinic.status === 'operational' ? 'bg-emerald-500' : clinic.status === 'understaffed' ? 'bg-amber-500' : 'bg-red-500'}`} />
            <h3 className="font-semibold text-slate-800">{clinic.name}</h3>
            <span className="text-sm text-slate-500">{clinic.location}</span>
            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${clinic.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : clinic.status === 'understaffed' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {clinic.status === 'operational' ? t('admin.stockOperational') : clinic.status === 'understaffed' ? t('admin.stockUnderstaffed') : t('admin.stockCritical')}
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('admin.medicineStock')}</h4>
              <div className="space-y-1.5">
                {Object.entries(clinic.medicines).map(([key, level]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{medicineNames[key]}</span>
                    <StockPill level={level as StockLevel} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('common.vitals')}</h4>
              <div className="space-y-1.5">
                {Object.entries(clinic.tests).map(([key, available]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                    {available ? <CheckCircle size={15} className="text-emerald-500" /> : <span className="text-xs text-red-500 font-medium">Unavailable</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AIInsights() {
  const { t } = useLanguage();
  const [acted, setActed] = useState<Set<number>>(new Set());

  const insights = [
    {
      village: 'Titwala',
      score: 79,
      explanation: 'Risk score increased from 67 to 79 over 7 days. Primary drivers: (1) 3 new malaria RDT-positive cases reported at Titwala PHC on 21–22 Aug. (2) Water quality complaint logged for Sector 4 borewell — E.coli contamination likely. (3) 4 fever cluster cases in 2 adjacent households. (4) Last medicine resupply was 18 days ago — ORS and antimalarial stock depleted.',
      actions: [
        ...getRecommendedActions('High'),
        'Deploy water testing team to Sector 4 borewell — within 24 hours',
        'Organise malaria RDT screening camp — target 500 households',
        'Emergency medicine resupply — ORS, Chloroquine, Paracetamol',
        'Alert district CMHO with situation report'
      ],
      color: 'red',
    },
    {
      village: 'Wada',
      score: 72,
      explanation: 'Score rose from 65 driven by a cluster of high-risk maternal cases. 4 patients in their third trimester have not received ANC visits in the last 30+ days. Sunita Thorat (MH-2024-001) shows pre-eclampsia indicators — BP 130/88. Iron-Folic Acid supply remains adequate, but 2 high-risk mothers lack phone access for teleconsultation.',
      actions: [
        ...getRecommendedActions('High'),
        'ASHA worker home visit for all 4 third-trimester mothers — within 48 hours',
        'Facilitate Sunita Thorat referral to Thane Civil Hospital — already initiated',
        'Organise ANC camp at village panchayat',
        'Verify Wada PHC iron-folic stock adequate for next 60 days'
      ],
      color: 'red',
    },
    {
      village: 'Bhiwandi',
      score: 61,
      explanation: 'Stable score driven by chronic disease burden — 52 active chronic patients (hypertension, diabetes) in a population of 8,900. Critical concern: Metformin and Amlodipine both out of stock at Bhiwandi PHC for 9 days. 3 patients have missed doses. Blood sugar testing also unavailable.',
      actions: [
        ...getRecommendedActions('Medium'),
        'Emergency medicine resupply for Bhiwandi PHC — Metformin, Amlodipine, Amoxicillin',
        'Arrange blood sugar testing via mobile health unit',
        'Follow up with 3 patients who missed chronic medication doses'
      ],
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-[#1C3A5E] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain size={20} />
          <h3 className="font-semibold">{t('admin.aiInsightsTitle')}</h3>
        </div>
        <p className="text-white/60 text-sm">{t('admin.aiInsightsDesc')}</p>
      </div>

      {insights.map((insight, i) => (
        <div key={insight.village} className={`bg-white rounded-xl border-2 overflow-hidden ${insight.color === 'red' ? 'border-red-200' : 'border-amber-200'}`}>
          <div className={`px-5 py-3.5 flex items-center gap-3 ${insight.color === 'red' ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle size={17} className={insight.color === 'red' ? 'text-red-600' : 'text-amber-600'} />
            <h3 className="font-semibold text-slate-800">{insight.village}</h3>
            <span className={`font-mono font-bold text-lg ${insight.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{insight.score}/100</span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Brain size={12} /> AI Explanation
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{insight.explanation}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap size={12} /> Recommended Actions
              </h4>
              <div className="space-y-2">
                {insight.actions.map((action, j) => {
                  const key = i * 10 + j;
                  const isDone = acted.has(key);
                  return (
                    <div key={j} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                      <button
                        onClick={() => setActed(prev => { const n = new Set(prev); isDone ? n.delete(key) : n.add(key); return n; })}
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-slate-500'}`}
                      >
                        {isDone && <CheckCircle size={12} className="text-white" />}
                      </button>
                      <span className={`text-sm ${isDone ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{action}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface MapClinic {
  name: string;
  location: string;
  coords: [number, number];
  status: 'operational' | 'understaffed' | 'critical';
  doctors: number;
  medAlerts: string;
}

const mapClinics: MapClinic[] = [
  {
    name: 'Wada PHC',
    location: 'Wada, Palghar District',
    coords: [19.6548, 73.1378],
    status: 'operational',
    doctors: 2,
    medAlerts: 'Normal'
  },
  {
    name: 'Bhiwandi PHC',
    location: 'Bhiwandi, Thane District',
    coords: [19.2952, 73.0482],
    status: 'understaffed',
    doctors: 1,
    medAlerts: 'Metformin, Amlodipine Out'
  },
  {
    name: 'Murbad PHC',
    location: 'Murbad, Thane District',
    coords: [19.2612, 73.3980],
    status: 'operational',
    doctors: 2,
    medAlerts: 'Normal'
  },
  {
    name: 'Shahpur PHC',
    location: 'Shahpur, Thane District',
    coords: [19.4526, 73.3278],
    status: 'critical',
    doctors: 1,
    medAlerts: 'Iron-Folic Acid Out'
  },
  {
    name: 'Titwala PHC',
    location: 'Titwala, Thane District',
    coords: [19.3005, 73.2081],
    status: 'critical',
    doctors: 1,
    medAlerts: 'ORS & Antimalarial Out'
  },
  {
    name: 'Asangaon PHC',
    location: 'Asangaon, Thane District',
    coords: [19.4394, 73.2982],
    status: 'operational',
    doctors: 2,
    medAlerts: 'Normal'
  }
];

function ClinicMap() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{t('admin.clinicMap')}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Live Google Maps network — interact to zoom and inspect clinic details</p>
        </div>
        
        {/* Real Google Maps Container */}
        <div className="relative bg-slate-50 z-0 border-b border-slate-200">
          <GoogleClinicMap height="450px" />
        </div>
        
        <div className="p-4 flex items-center gap-5 text-xs flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> {t('admin.stockOperational')}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> {t('admin.stockUnderstaffed')}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> {t('admin.stockCritical')}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ page, session }: Props) {
  return (
    <div className="p-4 lg:p-6">
      {page === 'overview' && <Overview session={session} />}
      {page === 'risk' && <RiskMap />}
      {page === 'clinics' && <ClinicsStock />}
      {page === 'ai' && <AIInsights />}
      {page === 'map' && <ClinicMap />}
    </div>
  );
}
