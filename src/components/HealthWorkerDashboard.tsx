import { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Plus, Send, User, Phone, MapPin, Calendar, UserPlus, Stethoscope,
  Wind, Heart, Brain, Droplet, Thermometer, ShieldAlert, AlertOctagon, Check, RefreshCw, Eye, Activity
} from 'lucide-react';
import type { UserSession } from '../App';
import { patients, appointments, followUps, referrals, triageSymptoms } from '../data/mock';
import { useLanguage } from '../contexts/LanguageContext';
import { checkUrgency } from '../triage';
import { calculateRiskScore } from '../aiRisk';
import { addFollowUp } from '../followups';
import { notifyFollowUp } from '../sms';
import { generateCallLink } from '../VideoCall';

interface Props {
  page: string;
  session: UserSession;
  onRefresh?: () => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const { t } = useLanguage();
  if (level === 'high') return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{t('common.highRisk')}</span>;
  if (level === 'medium') return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">{t('common.mediumRisk')}</span>;
  return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">{t('common.lowRisk')}</span>;
}

function getGroupNameTranslation(name: string, t: any) {
  if (name === 'Cardiorespiratory') return t('symptoms.groups.cardiorespiratory');
  if (name === 'Maternal / Obstetric') return t('symptoms.groups.maternal');
  if (name === 'Neurological / Systemic') return t('symptoms.groups.neurological');
  if (name === 'Gastrointestinal') return t('symptoms.groups.gastrointestinal');
  if (name === 'General / Infectious') return t('symptoms.groups.general');
  return name;
}

function getSymptomTranslation(sym: string, t: any) {
  const keyMap: Record<string, string> = {
    'Chest Pain': 'symptoms.chestPain',
    'Breathlessness': 'symptoms.breathlessness',
    'Cough': 'symptoms.cough',
    'Reduced Foetal Movement': 'symptoms.reducedFoetalMovement',
    'Bleeding': 'symptoms.bleeding',
    'Swelling': 'symptoms.swelling',
    'Headache': 'symptoms.headache',
    'Dizziness': 'symptoms.dizziness',
    'Weakness': 'symptoms.weakness',
    'Abdominal Pain': 'symptoms.abdominalPain',
    'Vomiting': 'symptoms.vomiting',
    'Diarrhoea': 'symptoms.diarrhoea',
    'Fever': 'symptoms.fever',
    'Rash': 'symptoms.rash',
    'Jaundice': 'symptoms.jaundice'
  };
  return keyMap[sym] ? t(keyMap[sym]) : sym;
}

function Overview({ selectedLocation }: { selectedLocation: string }) {
  const { t } = useLanguage();
  const patientsCount = patients.length;
  const highRiskCount = patients.filter(p => p.riskLevel === 'high').length;

  const teleconsultsCount = appointments.filter(apt => apt.type === 'teleconsultation').length;
  const completedCount = appointments.filter(apt => apt.type === 'teleconsultation' && apt.status === 'completed').length || 2;

  const followUpsCount = followUps.length;
  const overdueCount = followUps.filter(fu => fu.daysOverdue > 0).length;

  const referralsCount = referrals.length;
  const urgentCount = referrals.filter(ref => ref.urgency === 'urgent').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.patientsToday')} value={patientsCount} sub={t('dashboard.highRiskCount', { count: highRiskCount })} color="text-navy" />
        <StatCard label={t('dashboard.teleconsults')} value={teleconsultsCount} sub={t('dashboard.completedCount', { count: completedCount })} color="text-blue-600" />
        <StatCard label={t('dashboard.followUpsDue')} value={followUpsCount} sub={t('dashboard.overdueCount', { count: overdueCount })} color="text-amber-600" />
        <StatCard label={t('dashboard.referralsMade')} value={referralsCount} sub={t('dashboard.urgentCount', { count: urgentCount })} color="text-purple-600" />
      </div>

      {overdueCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">{t('dashboard.followupsAlert', { count: overdueCount })}</p>
              <p className="text-amber-600 text-xs mt-0.5">
                {followUps.filter(fu => fu.daysOverdue > 0).map(fu => `${fu.patientName} (${fu.daysOverdue}d)`).join(', ')}. {t('dashboard.followupsAlertDesc')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{t('dashboard.todaysPatients')}</h3>
          <span className="text-xs text-slate-400">24 Aug 2026</span>
        </div>
        <div className="divide-y divide-slate-100">
          {patients.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-400">{t('dashboard.noPatients', { location: selectedLocation })}</div>
          ) : (
            patients.slice(0, 5).map(p => (
              <div key={p.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.age}y &bull; {p.village} &bull; {p.condition}</div>
                </div>
                <RiskBadge level={p.riskLevel} />
                <span className="text-xs font-mono text-slate-400 hidden sm:block">{p.id}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const symptomGroups = [
  {
    name: "Cardiorespiratory",
    icon: <Wind size={14} className="text-red-500" />,
    colorClass: "hover:bg-red-50 hover:text-red-700 border-red-100",
    selectedClass: "bg-red-600 border-red-600 text-white shadow-red-100 shadow-md",
    symptoms: ["Chest Pain", "Breathlessness", "Cough"]
  },
  {
    name: "Maternal / Obstetric",
    icon: <Heart size={14} className="text-pink-500" />,
    colorClass: "hover:bg-pink-50 hover:text-pink-700 border-pink-100",
    selectedClass: "bg-pink-600 border-pink-600 text-white shadow-pink-100 shadow-md",
    symptoms: ["Reduced Foetal Movement", "Bleeding", "Swelling"]
  },
  {
    name: "Neurological / Systemic",
    icon: <Brain size={14} className="text-purple-500" />,
    colorClass: "hover:bg-purple-50 hover:text-purple-700 border-purple-100",
    selectedClass: "bg-purple-600 border-purple-600 text-white shadow-purple-100 shadow-md",
    symptoms: ["Headache", "Dizziness", "Weakness"]
  },
  {
    name: "Gastrointestinal",
    icon: <Droplet size={14} className="text-blue-500" />,
    colorClass: "hover:bg-blue-50 hover:text-blue-700 border-blue-100",
    selectedClass: "bg-blue-600 border-blue-600 text-white shadow-blue-100 shadow-md",
    symptoms: ["Abdominal Pain", "Vomiting", "Diarrhoea"]
  },
  {
    name: "General / Infectious",
    icon: <Thermometer size={14} className="text-amber-500" />,
    colorClass: "hover:bg-amber-50 hover:text-amber-700 border-amber-100",
    selectedClass: "bg-amber-600 border-amber-600 text-white shadow-amber-100 shadow-md",
    symptoms: ["Fever", "Rash", "Jaundice"]
  }
];

function RegisterPatient({ onRefresh }: { onRefresh?: () => void }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ 
    name: '', 
    age: '', 
    gender: '', 
    village: '', 
    phone: '', 
    type: 'general', 
    notes: '',
    bloodGroup: 'O+',
    weight: '',
    bp: ''
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<any | null>(null);
  const [assessing, setAssessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  const [autoBookAppointment, setAutoBookAppointment] = useState(true);

  function toggleSymptom(sym: string) {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
    setTriageResult(null);
  }

  async function assess() {
    if (selectedSymptoms.length === 0) return;
    setAssessing(true);
    try {
      const urgencyResult = checkUrgency(selectedSymptoms);
      const levelMapped = urgencyResult === 'Emergency' ? 'urgent' : urgencyResult === 'Soon' ? 'soon' : 'routine';
      const riskLevelMapped = urgencyResult === 'Emergency' ? 'high' : urgencyResult === 'Soon' ? 'medium' : 'low';

      // Perform AI Risk score calculation using existing Gemini API logic
      const tempId = `PAT-TEMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const aiResult = await calculateRiskScore({
        patientId: tempId,
        symptoms: selectedSymptoms,
        village: form.village || 'Wada',
        waterQuality: 'Fair',
        referralStatus: levelMapped === 'urgent' ? 'Sent' : 'None'
      });

      const finalRisk: 'high' | 'medium' | 'low' = 
        aiResult.riskLevel === 'High' ? 'high' : 
        aiResult.riskLevel === 'Medium' ? 'medium' : 'low';

      setTriageResult({
        level: levelMapped,
        riskLevel: finalRisk,
        color: finalRisk === 'high' ? 'red' : finalRisk === 'medium' ? 'amber' : 'emerald',
        bg: finalRisk === 'high' ? 'bg-red-50 border-red-200 text-red-800' : finalRisk === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800',
        textColor: finalRisk === 'high' ? 'text-red-700' : finalRisk === 'medium' ? 'text-amber-700' : 'text-emerald-700',
        progressColor: finalRisk === 'high' ? 'bg-red-600' : finalRisk === 'medium' ? 'bg-amber-500' : 'bg-emerald-600',
        badgeColor: finalRisk === 'high' ? 'bg-red-500 text-white' : finalRisk === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white',
        progress: finalRisk === 'high' ? 95 : finalRisk === 'medium' ? 60 : 20,
        title: levelMapped === 'urgent' ? t('triage.urgentTitle') : levelMapped === 'soon' ? t('triage.soonTitle') : t('triage.routineTitle'),
        description: aiResult.reason,
        score: finalRisk === 'high' ? 90 : finalRisk === 'medium' ? 55 : 15
      });
    } catch (err) {
      console.error('Triage AI evaluation failed, using rule-based fallback:', err);
      const urgentSymptoms = ['Chest Pain', 'Breathlessness', 'Reduced Foetal Movement', 'Bleeding'];
      const isUrgent = selectedSymptoms.some(s => urgentSymptoms.includes(s));
      const isSoon = selectedSymptoms.some(s => ['Headache', 'Abdominal Pain', 'Vomiting', 'Diarrhoea', 'Swelling'].includes(s)) || selectedSymptoms.length >= 3;
      const fallbackLevel = isUrgent ? 'urgent' : isSoon ? 'soon' : 'routine';
      const fallbackRisk = isUrgent ? 'high' : isSoon ? 'medium' : 'low';

      setTriageResult({
        level: fallbackLevel,
        riskLevel: fallbackRisk,
        color: fallbackRisk === 'high' ? 'red' : fallbackRisk === 'medium' ? 'amber' : 'emerald',
        bg: fallbackRisk === 'high' ? 'bg-red-50 border-red-200 text-red-800' : fallbackRisk === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800',
        textColor: fallbackRisk === 'high' ? 'text-red-700' : fallbackRisk === 'medium' ? 'text-amber-700' : 'text-emerald-700',
        progressColor: fallbackRisk === 'high' ? 'bg-red-600' : fallbackRisk === 'medium' ? 'bg-amber-500' : 'bg-emerald-600',
        badgeColor: fallbackRisk === 'high' ? 'bg-red-500 text-white' : fallbackRisk === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white',
        progress: fallbackRisk === 'high' ? 95 : fallbackRisk === 'medium' ? 60 : 20,
        title: fallbackLevel === 'urgent' ? t('triage.urgentTitle') : fallbackLevel === 'soon' ? t('triage.soonTitle') : t('triage.routineTitle'),
        description: isUrgent ? t('triage.urgentDesc') : isSoon ? t('triage.soonDesc') : t('triage.routineDesc'),
        score: fallbackRisk === 'high' ? 85 : fallbackRisk === 'medium' ? 45 : 10
      });
    } finally {
      setAssessing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    let calculatedRisk: 'high' | 'medium' | 'low' = 'low';
    let finalTriageLevel: 'urgent' | 'soon' | 'routine' = 'routine';
    
    // Evaluate urgency using checkUrgency
    const urgency = checkUrgency(selectedSymptoms.length > 0 ? selectedSymptoms : ['general']);
    finalTriageLevel = urgency === 'Emergency' ? 'urgent' : urgency === 'Soon' ? 'soon' : 'routine';
    calculatedRisk = urgency === 'Emergency' ? 'high' : urgency === 'Soon' ? 'medium' : 'low';

    const newId = `MH-2026-${String(patients.length + 1).padStart(3, '0')}`;
    
    // Call calculateRiskScore to save the score record in Firestore and compute final AI risk level
    try {
      const aiResult = await calculateRiskScore({
        patientId: newId,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Routine Checkup'],
        village: form.village || 'Wada',
        waterQuality: 'Fair',
        referralStatus: finalTriageLevel === 'urgent' ? 'Sent' : 'None'
      });
      calculatedRisk = aiResult.riskLevel === 'High' ? 'high' : aiResult.riskLevel === 'Medium' ? 'medium' : 'low';
    } catch (err) {
      console.error('AI Risk Score calculation on submit failed:', err);
    }

    const newPatient = {
      id: newId,
      name: form.name,
      age: parseInt(form.age) || 30,
      gender: form.gender || 'Female',
      village: form.village,
      phone: form.phone || undefined,
      condition: selectedSymptoms.join(', ') || 'Routine Checkup',
      riskLevel: calculatedRisk,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    (patients as any[]).push(newPatient);

    // Call addFollowUp from followups.ts if they register a chronic/maternal patient
    if (form.type === 'maternal' || form.type === 'chronic') {
      const nextVisitDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]; // in 7 days
      try {
        await addFollowUp(newId, form.type as any, nextVisitDate);
        // Also push it to local followUps list to update the ASHA list!
        followUps.unshift({
          id: `FU-${String(followUps.length + 1).padStart(3, '0')}`,
          patientId: newId,
          patientName: form.name,
          type: form.type as any,
          village: form.village,
          phone: form.phone || null,
          nextVisit: nextVisitDate,
          reminderSent: false,
          daysOverdue: 0,
          healthWorker: 'Anita Jadhav'
        });
      } catch (err) {
        console.error('Failed to create follow-up reminder in Firestore:', err);
      }
    }

    if (autoBookAppointment && selectedSymptoms.length > 0) {
      const timeSlots = ["10:15 AM", "11:00 AM", "11:30 AM", "12:15 PM", "02:00 PM", "03:15 PM"];
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const callLink = generateCallLink(newId);
      
      const newApt = {
        id: `APT-${String(appointments.length + 1).padStart(3, '0')}`,
        patientId: newId,
        patientName: form.name,
        time: randomTime,
        village: form.village,
        type: calculatedRisk === 'high' ? 'teleconsultation' as const : 'in-person' as const,
        status: calculatedRisk === 'high' ? 'in-progress' as const : 'waiting' as const,
        doctor: calculatedRisk === 'high' ? 'Dr. Meera Joshi' : 'PHC Clinical Staff',
        symptoms: selectedSymptoms.slice(0, 2).join(', '),
        callLink: callLink
      };
      (appointments as any[]).unshift(newApt);
    }

    setRegisteredId(newId);
    setSubmitted(true);
    if (onRefresh) onRefresh();
  }

  function handleReset() {
    setForm({
      name: '',
      age: '',
      gender: '',
      village: '',
      phone: '',
      type: 'general',
      notes: '',
      bloodGroup: 'O+',
      weight: '',
      bp: ''
    });
    setSelectedSymptoms([]);
    setTriageResult(null);
    setSubmitted(false);
  }

  const initials = form.name.trim() 
    ? form.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'P';

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
          <CheckCircle size={36} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{t('register.successTitle')}</h3>
          <p className="text-slate-500 text-sm mt-1">Patient records created and updated in health database</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="font-semibold text-slate-800 text-base">{form.name}</span>
            <span className="text-xs bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">{t('register.assignedID')}: {registeredId}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div><strong>{t('common.age')}:</strong> {form.age} yrs</div>
            <div><strong>{t('common.gender')}:</strong> {form.gender || '—'}</div>
            <div><strong>{t('common.village')}:</strong> {form.village}</div>
            <div><strong>{t('common.phone')}:</strong> {form.phone || 'None'}</div>
            <div><strong>{t('common.vitals')}:</strong> {form.weight ? `${form.weight} kg` : '—'} | {form.bp || '—'}</div>
            <div><strong>{t('common.bloodGroup')}:</strong> {form.bloodGroup}</div>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">TRIAGE OUTCOME:</span>
            {triageResult ? (
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${triageResult.level === 'urgent' ? 'bg-red-500' : triageResult.level === 'soon' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="font-bold text-sm uppercase text-slate-800">{triageResult.title}</span>
              </div>
            ) : (
              <span className="text-xs italic text-slate-500">Not Assessed (Routine)</span>
            )}
          </div>
          {selectedSymptoms.length > 0 && (
            <div className="text-xs">
              <strong>{t('common.condition')}:</strong> {selectedSymptoms.map(s => getSymptomTranslation(s, t)).join(', ')}
            </div>
          )}
        </div>

        {triageResult && triageResult.level === 'urgent' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-left max-w-md mx-auto">
            <AlertOctagon className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-red-800 text-xs uppercase">{t('register.immediateAction')}</h4>
              <p className="text-red-600 text-xs mt-0.5">Patient has high-risk conditions. A doctor teleconsultation call has been queued. Direct the patient to wait near the monitor room.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto pt-4">
          {triageResult && triageResult.level === 'urgent' ? (
            <button 
              onClick={() => {
                alert("Opening Doctor Teleconsultation interface...");
              }} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Activity size={15} /> {t('common.startTeleconsult')}
            </button>
          ) : (
            <button 
              onClick={() => {
                alert("Routing to Patient Appointments queue...");
              }}
              className="flex-1 bg-[#1C3A5E] hover:bg-[#132845] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar size={15} /> {t('common.viewQueue')}
            </button>
          )}
          <button 
            onClick={handleReset} 
            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors cursor-pointer"
          >
            {t('common.registerAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Registration & Triage Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 bg-emerald-50/50 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{t('register.title')}</h3>
                <p className="text-xs text-slate-500">Register patient and run digital triage assessment</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Part 1: Demographics */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <User size={13} className="text-slate-400" />
                  1. {t('register.demographics')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.fullName')} *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('register.placeholderName')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.ageYears')} *</label>
                    <input required type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder={t('register.placeholderAge')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.selectGender')} *</label>
                    <select required value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                      <option value="">{t('register.selectGender')}</option>
                      <option value="Female">{t('register.female')}</option>
                      <option value="Male">{t('register.male')}</option>
                      <option value="Other">{t('register.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('common.village')} *</label>
                    <input required value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} placeholder="e.g. Wada, Shahpur" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.contactNumber')}</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={t('register.placeholderContact')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.patientCategory')} *</label>
                    <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450 bg-white">
                      <option value="general">{t('register.categoryGeneral')}</option>
                      <option value="maternal">{t('register.categoryMaternal')}</option>
                      <option value="child">{t('register.categoryPediatric')}</option>
                      <option value="chronic">{t('register.categoryChronic')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Part 2: Clinical Vitals */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Activity size={13} className="text-slate-400" />
                  2. {t('register.vitalsOptional')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('common.bloodGroup')}</label>
                    <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450 bg-white">
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('register.weightKg')}</label>
                    <input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder={t('register.placeholderWeight')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('common.vitals')} (BP)</label>
                    <input value={form.bp} onChange={e => setForm({ ...form, bp: e.target.value })} placeholder={t('register.bpPlaceholder')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450" />
                  </div>
                </div>
              </div>

              {/* Part 3: Digital Triage Symptoms Selector */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope size={13} className="text-slate-400" />
                    3. {t('register.symptomPills')}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{t('triage.symptomsSelected', { count: selectedSymptoms.length })}</span>
                </div>
                
                <p className="text-xs text-slate-500 -mt-2 leading-relaxed">
                  Select all symptoms presented by the patient below. Pill-shape selections are categorized for rapid scanning.
                </p>

                <div className="space-y-4">
                  {symptomGroups.map(group => (
                    <div key={group.name} className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        {group.icon}
                        <span className="text-xs font-semibold text-slate-700">{getGroupNameTranslation(group.name, t)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.symptoms.map(sym => {
                          const isSelected = selectedSymptoms.includes(sym);
                          return (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => toggleSymptom(sym)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none ${
                                isSelected 
                                  ? group.selectedClass
                                  : `bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-100/70`
                              }`}
                            >
                              {isSelected && <Check size={11} className="stroke-[3]" />}
                              <span>{getSymptomTranslation(sym, t)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={assess}
                    disabled={selectedSymptoms.length === 0 || assessing}
                    className="relative bg-[#1C3A5E] hover:bg-[#132845] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 group cursor-pointer active:scale-98"
                  >
                    {assessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity size={14} className="group-hover:animate-pulse" />
                        {t('register.assessUrgency')}
                      </>
                    )}
                  </button>
                  {selectedSymptoms.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setSelectedSymptoms([]); setTriageResult(null); }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-600 px-3 py-1 hover:bg-slate-55 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Part 4: Clinical Notes */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Plus size={13} className="text-slate-400" />
                  4. {t('register.ashaNotes')}
                </h4>
                <div>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder={t('register.placeholderNotes')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-450 resize-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer active:scale-98"
                >
                  <Plus size={16} /> {t('register.completeReg')}
                </button>
                <button 
                  type="button" 
                  onClick={handleReset} 
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Clear Fields
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Sticky Live Preview & Diagnostic Card */}
        <div className="space-y-6 lg:sticky lg:top-4">
          
          {/* Card 1: Diagnostic Result */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert size={16} className="text-slate-550" />
              {t('triage.title')}
            </h4>
            
            {triageResult ? (
              <div className={`rounded-xl border p-4 space-y-3.5 transition-all ${triageResult.bg}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${triageResult.badgeColor}`}>
                    {triageResult.level === 'urgent' ? t('common.urgent') : triageResult.level === 'soon' ? t('common.soon') : t('common.routine')}
                  </span>
                  <span className="text-xs font-bold font-mono">Score: {triageResult.score}/100</span>
                </div>
                
                <div>
                  <h5 className="font-extrabold text-sm leading-tight uppercase">
                    {triageResult.level === 'urgent' ? t('triage.urgentTitle') : triageResult.level === 'soon' ? t('triage.soonTitle') : t('triage.routineTitle')}
                  </h5>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {triageResult.level === 'urgent' ? t('triage.urgentDesc') : triageResult.level === 'soon' ? t('triage.soonDesc') : t('triage.routineDesc')}
                  </p>
                </div>

                {/* Risk Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold opacity-80">
                    <span>{t('register.risk')}</span>
                    <span>{triageResult.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      triageResult.level === 'urgent' ? 'bg-red-500' :
                      triageResult.level === 'soon' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`} style={{ width: `${triageResult.progress}%` }} />
                  </div>
                </div>

                {/* Queue option */}
                <div className="pt-2 border-t border-slate-200/40">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={autoBookAppointment} 
                      onChange={e => setAutoBookAppointment(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-400 w-3.5 h-3.5" 
                    />
                    {t('register.autoBook')}
                  </label>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 space-y-2">
                <Activity size={24} className="mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-medium">Await Triage Assessment</p>
                <p className="text-[10px] leading-normal px-2 text-slate-400">Select symptoms and click "Assess Urgency" to calculate danger score and clinical priority.</p>
              </div>
            )}
          </div>

          {/* Card 2: Live EHR Card Preview */}
          <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-5 text-white relative">
            <div className="absolute top-[-30%] right-[-30%] w-48 h-48 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />
            <div className="absolute bottom-[-30%] left-[-30%] w-48 h-48 rounded-full bg-cyan-500/10 blur-[40px] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                {t('register.livePreview')}
              </span>
              <span className="text-[10px] font-mono text-white/40">EHR ID: MH-2026-TBD</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase flex-shrink-0 shadow-inner">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-white text-base truncate">{form.name || "Patient Full Name"}</h5>
                <p className="text-xs text-white/60 mt-0.5">
                  {form.age ? `${form.age} yrs` : "— yrs"} &bull; {form.gender || "Gender"} &bull; {form.village || "Village"}
                </p>
                <p className="text-[10px] text-white/40 mt-1 font-mono">
                  {form.phone ? `Mob: +91 ${form.phone}` : "No Mobile Access"}
                </p>
              </div>
            </div>

            {/* Health Info Block */}
            <div className="grid grid-cols-3 gap-2 mt-4 py-2 px-3 bg-white/5 rounded-xl text-center border border-white/5 text-[10px]">
              <div>
                <span className="text-white/40 block">{t('register.patientCategory')}</span>
                <span className="font-semibold capitalize text-emerald-300">{form.type}</span>
              </div>
              <div>
                <span className="text-white/40 block">{t('common.vitals')}</span>
                <span className="font-semibold text-sky-300 truncate block">
                  {form.weight ? `${form.weight}kg` : "—"} / {form.bp || "—"}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">{t('common.bloodGroup')}</span>
                <span className="font-semibold text-pink-300">{form.bloodGroup}</span>
              </div>
            </div>

            {/* Symptoms Tags */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[9px] font-bold text-white/40 tracking-wider uppercase block">{t('common.condition')}</span>
              {selectedSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedSymptoms.map(sym => (
                    <span key={sym} className="text-[9px] bg-white/10 border border-white/10 text-white/80 px-2 py-0.5 rounded-full font-medium">
                      {getSymptomTranslation(sym, t)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] italic text-white/30">No symptoms selected</span>
              )}
            </div>

            {/* Risk Indicator badge */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[9px] font-bold text-white/40 tracking-wider uppercase">{t('register.risk')}</span>
              {triageResult ? (
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  triageResult.level === 'urgent' ? 'bg-red-500/25 text-red-300 border border-red-500/30' :
                  triageResult.level === 'soon' ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {triageResult.riskLevel === 'high' ? t('common.highRisk') : triageResult.riskLevel === 'medium' ? t('common.mediumRisk') : t('common.lowRisk')}
                </span>
              ) : (
                <span className="text-[10px] text-white/30">Not Evaluated</span>
              )}
            </div>

            {/* Simulated Barcode */}
            <div className="mt-4 flex flex-col items-center opacity-30 select-none">
              <div className="h-6 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px,transparent_4px,transparent_8px,#fff_8px,#fff_10px)]" />
              <span className="text-[7px] font-mono tracking-widest mt-1 text-white/85 font-semibold font-semibold">SWASTHGRAM-EHR-2026</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function TriageTool() {
  const { t } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<'urgent' | 'soon' | 'routine' | null>(null);

  function toggleSymptom(sym: string) {
    setSelectedSymptoms(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
    setResult(null);
  }

  function assess() {
    const urgency = checkUrgency(selectedSymptoms);
    setResult(urgency === 'Emergency' ? 'urgent' : urgency === 'Soon' ? 'soon' : 'routine');
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-1">{t('triage.title')}</h3>
        <p className="text-sm text-slate-500 mb-4">{t('triage.assessDetails')}</p>
        <div className="flex flex-wrap gap-2">
          {triageSymptoms.map(sym => (
            <button
              key={sym}
              onClick={() => toggleSymptom(sym)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                selectedSymptoms.includes(sym)
                  ? 'bg-navy text-white border-navy'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {getSymptomTranslation(sym, t)}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={assess}
            disabled={selectedSymptoms.length === 0}
            className="bg-[#1C3A5E] hover:bg-[#132845] disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer"
          >
            {t('register.assessUrgency')}
          </button>
          <span className="text-xs text-slate-400">{t('triage.symptomsSelected', { count: selectedSymptoms.length })}</span>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl border-2 p-5 ${
          result === 'urgent' ? 'bg-red-50 border-red-300' :
          result === 'soon' ? 'bg-amber-50 border-amber-300' :
          'bg-emerald-50 border-emerald-300'
        }`}>
          <div className="flex items-start gap-3">
            {result === 'urgent' && <AlertTriangle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />}
            {result === 'soon' && <Clock size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />}
            {result === 'routine' && <CheckCircle size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
            <div>
              <div className={`font-bold text-lg ${result === 'urgent' ? 'text-red-700' : result === 'soon' ? 'text-amber-700' : 'text-emerald-700'}`}>
                {result === 'urgent' ? t('triage.urgentTitle') : result === 'soon' ? t('triage.soonTitle') : t('triage.routineTitle')}
              </div>
              <p className={`text-sm mt-1 ${result === 'urgent' ? 'text-red-600' : result === 'soon' ? 'text-amber-600' : 'text-emerald-650'}`}>
                {result === 'urgent' ? t('triage.urgentDesc') :
                 result === 'soon' ? t('triage.soonDesc') :
                 t('triage.routineDesc')}
              </p>
              <div className="mt-3 flex gap-2">
                <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${result === 'urgent' ? 'bg-red-600 text-white' : result === 'soon' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {result === 'urgent' ? t('triage.startTeleconsult') : t('triage.bookAppointment')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Appointments({ selectedLocation }: { selectedLocation: string }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{t('appointments.title')}</h3>
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{t('appointments.scheduled', { count: appointments.length })}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-400">{t('appointments.noAppointments')}</div>
          ) : (
            appointments.map((apt, i) => (
              <div key={apt.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    apt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    apt.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-800">{apt.patientName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        apt.type === 'teleconsultation' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>{apt.type === 'teleconsultation' ? t('appointments.teleconsult') : t('appointments.inPerson')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        apt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>{apt.status === 'in-progress' ? t('appointments.inProgress') : apt.status === 'waiting' ? t('appointments.waiting') : t('appointments.scheduled')}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock size={11} /> {apt.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {apt.village}</span>
                      <span>{apt.doctor}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 italic">"{apt.symptoms}"</div>
                  </div>
                  {apt.type === 'teleconsultation' && (
                    <button className="flex-shrink-0 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                      {t('common.startCall')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FollowUps({ selectedLocation }: { selectedLocation: string }) {
  const { t } = useLanguage();
  const [sent, setSent] = useState<Set<string>>(new Set());

  function sendReminder(id: string, phone: string | null) {
    setSent(prev => new Set([...prev, id]));
    if (phone) {
      notifyFollowUp(phone).catch(e => console.error('SMS notification error:', e));
    }
  }

  const overdueCount = followUps.filter(fu => fu.daysOverdue > 0).length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{t('followups.title')}</h3>
          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">{t('dashboard.overdueCount', { count: overdueCount })}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {followUps.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-400">{t('followups.noFollowUps')}</div>
          ) : (
            followUps.map(fu => {
              const isOverdue = fu.daysOverdue > 0;
              const hasSent = sent.has(fu.id) || fu.reminderSent;
              return (
                <div key={fu.id} className={`px-5 py-4 ${isOverdue ? 'bg-red-50/40' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isOverdue ? 'bg-red-500' : 'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800">{fu.patientName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          fu.type === 'maternal' ? 'bg-pink-100 text-pink-700' :
                          fu.type === 'child' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{fu.type === 'maternal' ? t('register.categoryMaternal') : fu.type === 'child' ? t('register.categoryPediatric') : t('register.categoryGeneral')}</span>
                        {isOverdue && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">{fu.daysOverdue}d {t('common.overdue')}</span>}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {fu.village}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> Due: {fu.nextVisit}</span>
                        {fu.phone && <span className="flex items-center gap-1"><Phone size={11} /> {fu.phone}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => sendReminder(fu.id, fu.phone)}
                      disabled={hasSent}
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        hasSent ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' : 'bg-[#1C3A5E] hover:bg-[#132845] text-white'
                      }`}
                    >
                      {hasSent ? <><CheckCircle size={12} /> {t('followups.reminderSent')}</> : <><Send size={12} /> {t('followups.sendSms')}</>}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function HealthWorkerDashboard({ page, session, onRefresh, selectedLocation, setSelectedLocation }: Props) {
  const { t } = useLanguage();
  return (
    <div className="p-4 lg:p-6 space-y-6">
      
      {/* ASHA Worker Header & Location Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{t('dashboard.ashaWorker')}: {session.name}</h2>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <span>{t('dashboard.currentLocation')}</span>
              <span className="font-semibold text-emerald-700">{selectedLocation}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0">
            <MapPin size={13} className="text-slate-400" /> {t('common.selectLocation')}
          </label>
          <select 
            value={selectedLocation} 
            onChange={e => setSelectedLocation(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all bg-white"
          >
            <option value="Titwala">Titwala</option>
            <option value="Wada">Wada</option>
            <option value="Bhiwandi">Bhiwandi</option>
            <option value="Murbad">Murbad</option>
            <option value="Shahpur">Shahpur</option>
            <option value="Asangaon">Asangaon</option>
          </select>
        </div>
      </div>

      <div>
        {page === 'overview' && <Overview selectedLocation={selectedLocation} />}
        {page === 'register' && <RegisterPatient onRefresh={onRefresh} />}
        {page === 'triage' && <TriageTool />}
        {page === 'appointments' && <Appointments selectedLocation={selectedLocation} />}
        {page === 'followups' && <FollowUps selectedLocation={selectedLocation} />}
      </div>
    </div>
  );
}
