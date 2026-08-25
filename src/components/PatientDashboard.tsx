import { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle, Bell, FileText, User, ChevronDown, Phone } from 'lucide-react';
import type { UserSession } from '../App';
import { appointments, mockPatientHistory, patients } from '../data/mock';
import { useLanguage } from '../contexts/LanguageContext';
import { VideoCall, generateCallLink } from '../VideoCall';
import { notifyAppointment } from '../sms';

interface Props {
  page: string;
  session: UserSession;
}

function MyHealth({ session, onStartCall }: { session: UserSession; onStartCall: (id: string) => void }) {
  const { t } = useLanguage();
  const patient = patients.find(p => p.id === session.patientId) || patients[0];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-[#1C3A5E] to-[#0891B2] rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={26} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl truncate" style={{ fontFamily: 'Fraunces, serif' }}>{patient.name}</div>
            <div className="text-white/70 text-sm truncate">{patient.condition}</div>
            <div className="text-white/50 text-xs mt-1 font-mono">{patient.id}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-300">
              {patient.riskLevel === 'high' 
                ? t('common.highRisk').split(' ')[0] 
                : patient.riskLevel === 'medium' 
                ? t('common.mediumRisk').split(' ')[0] 
                : t('common.lowRisk').split(' ')[0]}
            </div>
            <div className="text-white/60 text-xs">{t('register.risk')}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{patient.age}</div>
            <div className="text-white/60 text-xs">{t('common.age')} (yrs)</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{patient.bloodGroup}</div>
            <div className="text-white/60 text-xs">{t('common.bloodGroup')}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{patient.bp}</div>
            <div className="text-white/60 text-xs">BP</div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Bell size={17} className="text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-orange-800 text-sm">{t('patient.nextFollowUp')} 26 August 2026</p>
            <p className="text-orange-600 text-xs mt-0.5">Your ASHA worker Anita Jadhav will visit or you can book a teleconsultation. Reminder SMS will be sent to 9876543210.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">{t('appointments.title')}</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Video size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-slate-800 text-sm">{t('appointments.teleconsult')}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} /> 10:00 AM with Dr. Meera Joshi</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-blue-700 text-xs font-medium">{t('appointments.inProgress')}</span>
          </div>
          <button onClick={() => onStartCall('APT-001')} className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <Video size={14} /> {t('common.startCall')}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">{t('dashboard.ashaWorker')}</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-emerald-600" />
            </div>
            <div>
              <div className="font-medium text-slate-800 text-sm">Anita Jadhav</div>
              <div className="text-xs text-slate-400">ASHA Worker &bull; Wada</div>
            </div>
          </div>
          <a href="tel:+919876543000" className="flex items-center justify-center gap-2 w-full border border-emerald-300 text-emerald-700 font-semibold py-2 rounded-lg text-sm hover:bg-emerald-50 transition-colors cursor-pointer">
            <Phone size={14} /> Contact ASHA Worker
          </a>
        </div>
      </div>
    </div>
  );
}

function AppointmentsList({ session, onStartCall }: { session: UserSession; onStartCall: (id: string) => void }) {
  const { t } = useLanguage();
  const [booked, setBooked] = useState(false);
  const [aptType, setAptType] = useState('Teleconsultation');
  const [aptDate, setAptDate] = useState('2026-08-25');
  const [aptReason, setAptReason] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    try {
      const newAptId = `APT-${Date.now().toString().slice(-4)}`;
      const callLink = aptType === 'Teleconsultation' ? generateCallLink(newAptId) : '';
      
      const newApt = {
        id: newAptId,
        patientId: session.patientId || 'MH-2024-001',
        patientName: session.name || 'Sunita Thorat',
        village: 'Wada',
        date: aptDate,
        time: '10:00 AM',
        type: aptType === 'Teleconsultation' ? 'teleconsultation' : 'in-person',
        status: 'scheduled' as any,
        queuePosition: appointments.length,
        doctor: 'Dr. Meera Joshi',
        symptoms: aptReason || 'General checkup',
        callLink: callLink
      };

      appointments.unshift(newApt as any);

      const patientPhone = patients.find(p => p.id === session.patientId)?.phone || '9876543210';
      await notifyAppointment(patientPhone, aptDate, '10:00 AM');

      setBooked(true);
    } catch (e) {
      console.error('Error booking appointment:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{t('patient.myAppointments')}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.filter(a => a.patientId === session.patientId).map(apt => (
            <div key={apt.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                  <Video size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{t('appointments.teleconsult')}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                      {t('appointments.inProgress')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Today at {apt.time} &bull; {apt.doctor}</div>
                </div>
                <button onClick={() => onStartCall(apt.id)} className="flex-shrink-0 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                  <Video size={12} /> {t('common.startCall')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Book New Appointment</h3>
        {booked ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">Appointment booked! SMS confirmation sent to your phone.</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Appointment Type</label>
                <select value={aptType} onChange={e => setAptType(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Teleconsultation</option>
                  <option>In-Person Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Date</label>
                <input type="date" value={aptDate} onChange={e => setAptDate(e.target.value)} min="2026-08-24" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason / Symptoms</label>
              <textarea value={aptReason} onChange={e => setAptReason(e.target.value)} rows={2} placeholder="What is your main concern today?" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <button onClick={handleBook} disabled={loading} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 cursor-pointer">
              <Calendar size={15} /> {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthRecords() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{t('patient.healthRecords')}</h3>
          <p className="text-xs text-slate-400 mt-0.5">All visits, diagnoses, and prescriptions</p>
        </div>
        <div className="divide-y divide-slate-100">
          {mockPatientHistory.map((visit, i) => (
            <div key={i}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-800">{visit.date}</div>
                  <div className="text-xs text-slate-500 truncate">{visit.diagnosis} &bull; {visit.doctor}</div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${expanded === i ? 'rotate-180' : ''}`} />
              </button>
              {expanded === i && (
                <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100">
                  <div className="space-y-2 pt-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</span>
                      <p className="text-sm text-slate-700 mt-0.5 capitalize">{visit.type}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('patient.prescriptions')}</span>
                      <p className="text-sm text-slate-700 mt-0.5">{visit.prescription}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor's Notes</span>
                      <p className="text-sm text-slate-700 mt-0.5">{visit.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeleconsultPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
          <p className="font-semibold text-blue-800 text-sm">Active call in progress with Dr. Meera Joshi</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-hidden">
          <VideoCall callLink={generateCallLink('APT-001')} height="320px" />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Dr. Meera Joshi</div>
              <div className="text-xs text-slate-400">Thane Civil Hospital &bull; General Medicine</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Connected
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Video size={15} /> {t('common.startCall')}
            </button>
            <button className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-lg text-sm transition-colors border border-red-200 cursor-pointer">
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs text-slate-500 text-center">
          No smartphone? Your ASHA worker Anita Jadhav can facilitate the call on your behalf at the PHC or your home. Call her at the number provided.
        </p>
      </div>
    </div>
  );
}

export default function PatientDashboard({ page, session }: Props) {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <div className="p-4 lg:p-6 max-w-2xl space-y-5">
      {activeCall && (
        <div className="bg-[#1C3A5E] text-white rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="font-semibold">Live Teleconsultation Call</span>
            <button onClick={() => setActiveCall(null)} className="ml-auto text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">{t('common.close')}</button>
          </div>
          <div className="rounded-lg overflow-hidden">
            <VideoCall callLink={generateCallLink(activeCall)} height="320px" />
          </div>
        </div>
      )}
      
      <div>
        {page === 'overview' && <MyHealth session={session} onStartCall={() => setActiveCall('APT-001')} />}
        {page === 'appointments' && <AppointmentsList session={session} onStartCall={setActiveCall} />}
        {page === 'teleconsult' && <TeleconsultPage />}
        {page === 'records' && <HealthRecords />}
      </div>
    </div>
  );
}
