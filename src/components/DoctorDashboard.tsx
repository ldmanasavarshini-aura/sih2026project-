import { useState } from 'react';
import { Video, Clock, User, FileText, CheckCircle, Plus, AlertCircle, ChevronDown, ExternalLink } from 'lucide-react';
import type { UserSession } from '../App';
import { appointments, patients, referrals, mockPatientHistory } from '../data/mock';
import { useLanguage } from '../contexts/LanguageContext';
import { createReferral } from '../referrals';
import { VideoCall, generateCallLink } from '../VideoCall';

interface Props {
  page: string;
  session: UserSession;
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

function Overview({ session }: { session: UserSession }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('appointments.title')} value={appointments.length} sub={t('dashboard.teleconsults')} color="text-blue-600" />
        <StatCard label={t('appointments.inProgress')} value={1} sub="Sunita Thorat" color="text-emerald-600" />
        <StatCard label={t('sidebar.referrals')} value={3} sub={t('common.urgent')} color="text-red-600" />
        <StatCard label={t('dashboard.completedCount', { count: 23 })} value={23} sub="+4" color="text-purple-600" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <p className="font-semibold text-blue-800 text-sm">{t('doctor.activeConsult')} — Sunita Thorat (MH-2024-001)</p>
          <button className="ml-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            <Video size={13} /> {t('common.startCall')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">{t('doctor.patientQueue')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.slice(1, 4).map(apt => (
              <div key={apt.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-800">{apt.patientName}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock size={11} /> {apt.time}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${apt.type === 'teleconsultation' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {apt.type === 'teleconsultation' ? t('appointments.teleconsult') : t('appointments.inPerson')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">{t('sidebar.referrals')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {referrals.slice(0, 3).map(ref => (
              <div key={ref.id} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-800">{ref.patientName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${ref.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ref.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {ref.status === 'completed' ? t('common.completed') : ref.urgency === 'urgent' ? t('common.urgent') : t('appointments.waiting')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">→ {ref.to}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Queue() {
  const { t } = useLanguage();
  const [activeCall, setActiveCall] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {activeCall && (
        <div className="bg-[#1C3A5E] text-white rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="font-semibold">{t('doctor.activeConsult')} — {appointments.find(a => a.id === activeCall)?.patientName}</span>
            <button onClick={() => setActiveCall(null)} className="ml-auto text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">{t('common.close')}</button>
          </div>
          <div className="rounded-lg overflow-hidden">
            <VideoCall callLink={generateCallLink(activeCall)} height="320px" />
          </div>
          <p className="text-white/60 text-xs mt-2">Powered by Jitsi Meet &bull; End-to-end encrypted &bull; No smartphone required for patient</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{t('doctor.patientQueue')}</h3>
          <span className="text-xs text-slate-400 font-mono">24 Aug 2026</span>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.map((apt, i) => {
            const patient = patients.find(p => p.id === apt.patientId);
            return (
              <div key={apt.id} className={`px-5 py-4 ${apt.status === 'in-progress' ? 'bg-blue-50/60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${apt.status === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{apt.patientName}</span>
                      {patient?.riskLevel === 'high' && <AlertCircle size={14} className="text-red-500" />}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${apt.type === 'teleconsultation' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {apt.type === 'teleconsultation' ? t('appointments.teleconsult') : t('appointments.inPerson')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{apt.time} &bull; {apt.village} &bull; {patient?.condition}</div>
                    <div className="text-xs text-slate-400 mt-0.5 italic">"{apt.symptoms}"</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                      {t('sidebar.records')}
                    </button>
                    {apt.type === 'teleconsultation' && (
                      <button
                        onClick={() => setActiveCall(apt.id)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Video size={12} /> {t('common.startCall')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PatientRecords() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(patients[0]);
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">{t('doctor.noActivePatient')}</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto scrollbar-hide">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${selected.id === p.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="font-medium text-sm text-slate-800">{p.name}</div>
              <div className="text-xs text-slate-400">{p.age}y &bull; {p.village}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-lg">{selected.name}</h3>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{selected.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selected.riskLevel === 'high' ? 'bg-red-100 text-red-700' : selected.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {selected.riskLevel === 'high' ? t('common.highRisk') : selected.riskLevel === 'medium' ? t('common.mediumRisk') : t('common.lowRisk')}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{selected.condition}</div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">{t('common.age')}</div>
                  <div className="font-semibold text-slate-700 text-sm">{selected.age} yrs</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">{t('common.bloodGroup')}</div>
                  <div className="font-semibold text-slate-700 text-sm">{selected.bloodGroup}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">BP</div>
                  <div className="font-semibold text-slate-700 text-sm">{selected.bp}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">{t('common.history')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {mockPatientHistory.map((visit, i) => (
              <div key={i} className="overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-800">{visit.date} — {visit.diagnosis}</div>
                    <div className="text-xs text-slate-400">{visit.doctor} &bull; {visit.type}</div>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded === i ? 'rotate-180' : ''}`} />
                </button>
                {expanded === i && (
                  <div className="px-5 pb-4 bg-slate-50">
                    <div className="text-sm">
                      <div className="mb-2"><span className="font-medium text-slate-600">{t('patient.prescriptions')}:</span> <span className="text-slate-700">{visit.prescription}</span></div>
                      <div><span className="font-medium text-slate-600">Notes:</span> <span className="text-slate-700">{visit.notes}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Referrals({ session }: { session: UserSession }) {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient: '', hospital: '', reason: '', urgency: 'routine' });
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const patientName = patients.find(p => p.id === form.patient)?.name || 'Unknown Patient';
      const newRefId = await createReferral(form.patient, form.hospital, form.reason);
      
      referrals.unshift({
        id: newRefId,
        patientId: form.patient,
        patientName: patientName,
        from: 'PHC Clinic',
        to: form.hospital,
        reason: form.reason,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        doctor: session.name || 'Doctor',
        urgency: form.urgency
      });

      setSubmitted(true);
      setShowForm(false);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ patient: '', hospital: '', reason: '', urgency: 'routine' });
    } catch (err) {
      console.error('Error creating referral:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-emerald-600" />
          <span className="text-emerald-700 text-sm font-medium">Referral created and SMS sent to patient. REF-{Date.now().toString().slice(-4)}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{t('sidebar.referrals')}</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#1C3A5E] hover:bg-[#132845] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer">
          <Plus size={15} /> {t('doctor.referToSpecialist')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-semibold text-slate-800 mb-4">{t('doctor.referToSpecialist')}</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('doctor.patientDetails')}</label>
                <select required value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('doctor.referralHospital')}</label>
                <select required value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select hospital</option>
                  <option>Thane Civil Hospital — Obstetrics</option>
                  <option>Thane Civil Hospital — Cardiology</option>
                  <option>Thane Civil Hospital — Endocrinology</option>
                  <option>Kalyan District Hospital — NRC</option>
                  <option>Mumbai General Hospital — Oncology</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('doctor.referralReason')}</label>
              <textarea required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.action')}</label>
              <div className="flex gap-3">
                {['routine', 'urgent', 'emergency'].map(u => (
                  <label key={u} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={u} checked={form.urgency === u} onChange={() => setForm({ ...form, urgency: u })} />
                    <span className="text-sm capitalize text-slate-700">{u}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                {loading ? 'Creating...' : t('doctor.referToSpecialist')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {referrals.map(ref => (
            <div key={ref.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ref.status === 'completed' ? 'bg-emerald-500' : ref.urgency === 'urgent' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{ref.patientName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ref.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ref.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ref.status === 'completed' ? t('common.completed') : ref.urgency === 'urgent' ? t('common.urgent') : t('appointments.waiting')}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{ref.id}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{ref.from} → {ref.to}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">{ref.reason}</div>
                  <div className="text-xs text-slate-400 mt-1">Created {ref.date} by {ref.doctor}</div>
                </div>
                <button className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
                  <ExternalLink size={12} /> {t('common.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeleconsultPage() {
  const { t } = useLanguage();
  const teleconsults = appointments.filter(a => a.type === 'teleconsultation');

  return (
    <div className="space-y-4">
      <div className="bg-[#1C3A5E] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Video size={20} />
          <h3 className="font-semibold">{t('doctor.clinicInfo')}</h3>
        </div>
        <p className="text-white/60 text-sm">Powered by Jitsi Meet — free, embeddable, works on low-bandwidth connections. Patients without smartphones are assisted by the on-site ASHA worker.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teleconsults.map(apt => (
          <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${apt.status === 'in-progress' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <User size={18} className={apt.status === 'in-progress' ? 'text-blue-600' : 'text-slate-500'} />
              </div>
              <div>
                <div className="font-semibold text-slate-800">{apt.patientName}</div>
                <div className="text-xs text-slate-400">{apt.time} &bull; {apt.village}</div>
              </div>
              {apt.status === 'in-progress' && (
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-3 italic">"{apt.symptoms}"</p>
            <button className={`w-full text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${apt.status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
              <Video size={14} />
              {t('common.startCall')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DoctorDashboard({ page, session }: Props) {
  return (
    <div className="p-4 lg:p-6">
      {page === 'overview' && <Overview session={session} />}
      {page === 'queue' && <Queue />}
      {page === 'teleconsult' && <TeleconsultPage />}
      {page === 'records' && <PatientRecords />}
      {page === 'referrals' && <Referrals session={session} />}
    </div>
  );
}
