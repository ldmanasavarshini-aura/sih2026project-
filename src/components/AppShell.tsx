import { useState } from 'react';
import {
  LayoutDashboard, UserPlus, Calendar, Bell, Map, LogOut,
  Stethoscope, FileText, ArrowRightLeft, Video, ShieldCheck,
  TrendingUp, Pill, Brain, User, ChevronRight, Menu, X, Heart, Globe
} from 'lucide-react';
import type { UserSession, Role } from '../App';
import HealthWorkerDashboard from './HealthWorkerDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import { useLanguage } from '../contexts/LanguageContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: Role, t: any): NavItem[] {
  switch (role) {
    case 'health-worker': return [
      { id: 'overview', label: t('sidebar.dashboard'), icon: <LayoutDashboard size={18} /> },
      { id: 'register', label: t('sidebar.registerPatient'), icon: <UserPlus size={18} /> },
      { id: 'triage', label: t('sidebar.digitalTriage'), icon: <Stethoscope size={18} /> },
      { id: 'appointments', label: t('sidebar.appointments'), icon: <Calendar size={18} /> },
      { id: 'followups', label: t('sidebar.followUps'), icon: <Bell size={18} /> },
    ];
    case 'doctor': return [
      { id: 'overview', label: t('sidebar.dashboard'), icon: <LayoutDashboard size={18} /> },
      { id: 'queue', label: t('doctor.patientQueue'), icon: <Calendar size={18} /> },
      { id: 'teleconsult', label: t('common.startTeleconsult'), icon: <Video size={18} /> },
      { id: 'records', label: t('sidebar.records'), icon: <FileText size={18} /> },
      { id: 'referrals', label: t('sidebar.referrals'), icon: <ArrowRightLeft size={18} /> },
    ];
    case 'admin': return [
      { id: 'overview', label: t('sidebar.dashboard'), icon: <LayoutDashboard size={18} /> },
      { id: 'risk', label: t('sidebar.riskMap'), icon: <TrendingUp size={18} /> },
      { id: 'clinics', label: t('sidebar.clinicsStock'), icon: <Pill size={18} /> },
      { id: 'ai', label: t('sidebar.aiInsights'), icon: <Brain size={18} /> },
      { id: 'map', label: t('sidebar.clinicMap'), icon: <Map size={18} /> },
    ];
    case 'patient': return [
      { id: 'overview', label: t('sidebar.myHealth'), icon: <Heart size={18} /> },
      { id: 'appointments', label: t('sidebar.appointments'), icon: <Calendar size={18} /> },
      { id: 'teleconsult', label: t('common.startTeleconsult'), icon: <Video size={18} /> },
      { id: 'records', label: t('sidebar.records'), icon: <FileText size={18} /> },
    ];
    default: return [];
  }
}

function getRoleColor(role: Role) {
  switch (role) {
    case 'health-worker': return { accent: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', ring: 'ring-emerald-300' };
    case 'doctor': return { accent: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', ring: 'ring-blue-300' };
    case 'admin': return { accent: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', ring: 'ring-purple-300' };
    case 'patient': return { accent: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', ring: 'ring-orange-300' };
    default: return { accent: 'bg-slate-600', text: 'text-slate-600', light: 'bg-slate-50', ring: 'ring-slate-300' };
  }
}

function getRoleBadge(role: Role, t: any) {
  switch (role) {
    case 'health-worker': return t('login.roles.healthWorker');
    case 'doctor': return t('login.roles.doctor');
    case 'admin': return t('login.roles.admin');
    case 'patient': return t('login.roles.patient');
    default: return '';
  }
}

interface Props {
  session: UserSession;
  onLogout: () => void;
  onRefresh?: () => void;
}

export default function AppShell({ session, onLogout, onRefresh }: Props) {
  const { language, setLanguage, t } = useLanguage();
  const navItems = getNavItems(session.role, t);
  const [activePage, setActivePage] = useState(navItems[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const colors = getRoleColor(session.role);
  const [selectedLocation, setSelectedLocation] = useState<string>('Wada');

  function renderDashboard() {
    switch (session.role) {
      case 'health-worker': return (
        <HealthWorkerDashboard 
          page={activePage} 
          session={session} 
          onRefresh={onRefresh} 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      );
      case 'doctor': return <DoctorDashboard page={activePage} session={session} />;
      case 'admin': return <AdminDashboard page={activePage} session={session} />;
      case 'patient': return <PatientDashboard page={activePage} session={session} />;
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 ${colors.accent} rounded-lg flex items-center justify-center`}>
            <Heart size={16} className="text-white fill-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-none" style={{ fontFamily: 'Fraunces, serif' }}>{t('common.title')}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t('common.govMaharashtra')}</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="p-4 border-b border-slate-100">
        <div className={`${colors.light} rounded-xl p-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${colors.accent} rounded-full flex items-center justify-center flex-shrink-0`}>
              <User size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{session.name}</div>
              <div className={`text-xs font-medium ${colors.text}`}>{getRoleBadge(session.role, t)}</div>
              {session.role === 'health-worker' ? (
                <div className="text-xs text-slate-500 truncate">{selectedLocation}</div>
              ) : (
                session.clinic && <div className="text-xs text-slate-500 truncate">{session.clinic}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
              activePage === item.id
                ? `${colors.light} ${colors.text}`
                : 'text-slate-600 hover:bg-slate-55 hover:text-slate-900'
            }`}
          >
            <span className={activePage === item.id ? colors.text : 'text-slate-400 group-hover:text-slate-600'}>
              {item.icon}
            </span>
            {item.label}
            {activePage === item.id && <ChevronRight size={14} className={`ml-auto ${colors.text}`} />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          {t('common.signOut')}
        </button>
        <div className="mt-3 px-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-slate-400">{t('common.systemOnline')} &bull; SIH26133</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-ground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200 flex-col flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-2xl flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-800 text-base">
              {navItems.find(n => n.id === activePage)?.label}
            </h2>
            <p className="text-xs text-slate-400">
              24 August 2026 &bull; {session.role === 'health-worker' ? selectedLocation : (session.clinic ?? 'SwasthGram Portal')}
            </p>
          </div>

          {/* Inline Language Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full px-2.5 py-1 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition-all select-none">
            <Globe size={12} className="text-slate-400" />
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent border-none text-slate-600 text-[11px] font-semibold focus:outline-none cursor-pointer outline-none [appearance:none] pr-3.5 relative"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', 
                backgroundPosition: 'right center', 
                backgroundRepeat: 'no-repeat', 
                backgroundSize: '1em' 
              }}
            >
              <option value="en">EN</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
            <ShieldCheck size={13} />
            {getRoleBadge(session.role, t)}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}
