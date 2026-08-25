import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  MessageSquare,
  Stethoscope,
  HeartPulse,
  User,
  Clock,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Subtitles,
  Settings,
  X,
  ShieldCheck,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  Pill,
  Calendar,
  AlertOctagon,
  Maximize2
} from 'lucide-react';

type CallMode = 'video' | 'voice';
type CallState = 'pre' | 'connecting' | 'connected' | 'reconnecting' | 'ended';
type CaptionSize = 'small' | 'medium' | 'large';
type CaptionLanguage = 'en' | 'mr' | 'hi' | 'ta';

interface ChatMessage {
  id: string;
  sender: 'Doctor' | 'Health Worker' | 'Patient';
  text: string;
  time: string;
}

const SAMPLE_CAPTIONS: Record<CaptionLanguage, { doctor: string; patient: string }[]> = {
  en: [
    { doctor: "Hello Lakshmi Devi, how are you feeling today?", patient: "Doctor, I have had a severe headache and mild dizziness since morning." },
    { doctor: "Let me review your latest vitals recorded by Meena ASHA.", patient: "Yes doctor, my blood pressure was 150/95 mmHg when she checked." },
    { doctor: "I see the elevated BP reading. We will start Labetalol 100mg twice daily and initiate a specialist review.", patient: "Thank you doctor, will I need to visit the District Hospital?" }
  ],
  mr: [
    { doctor: "नमस्कार लक्ष्मी देवी, आज तुम्हाला कसे वाटत आहे?", patient: "डॉक्टर, मला आज सकाळपासून खूप डोकेदुखी आणि चक्कर येत आहे." },
    { doctor: "मी तुमच्या आशा सेविका मीना यांनी घेतलेली लक्षणे तपासतो.", patient: "हो डॉक्टर, त्यांनी तपासले तेव्हा माझे रक्तदाब १५०/९५ होते." },
    { doctor: "तुमचे रक्तदाब वाढलेले दिसत आहे. आपण लॅबेटालोल १०० मिग्रॅ सुरू करूया.", patient: "धन्यवाद डॉक्टर, मला जिल्हा रुग्णालयात जावे लागेल का?" }
  ],
  hi: [
    { doctor: "नमस्ते लक्ष्मी देवी, आज आपकी तबियत कैसी है?", patient: "डॉक्टर साहब, मुझे सुबह से सिरदर्द और चक्कर आ रहे हैं।" },
    { doctor: "मैं आपकी आशा कार्यकर्ता मीना द्वारा दर्ज वाइटल्स देख रहा हूँ।", patient: "जी डॉक्टर साहब, मेरा बीपी 150/95 आया था।" },
    { doctor: "आपका बीपी बढ़ा हुआ है। हम लेबैटालोल 100mg शुरू कर रहे हैं।", patient: "धन्यवाद डॉक्टर साहब, क्या मुझे बड़े अस्पताल जाना पड़ेगा?" }
  ],
  ta: [
    { doctor: "வணக்கம் லட்சுமி தேவி, இன்று உங்களுக்கு எப்படி இருக்கிறது?", patient: "டாக்டர், காலை முதல் கடுமையான தலைவலியும் தலைச்சுற்றலும் இருக்கிறது." },
    { doctor: "ஆஷா பணியாளர் மீனா பதிவுசெய்த விவரங்களைப் பார்க்கிறேன்.", patient: "ஆம் டாக்டர், இரத்த அழுத்தம் 150/95 ஆக இருந்தது." },
    { doctor: "இரத்த அழுத்தம் அதிகமாக உள்ளது. லேபெட்டலோல் 100mg தொடங்குகிறோம்.", patient: "நன்றி டாக்டர், நான் மாவட்ட மருத்துவமனைக்கு செல்ல வேண்டுமா?" }
  ]
};

export const TeleconsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const { patients, referrals, medicines, facilities, createReferral, bookAppointment } = useHealthData();

  const patient = patients.find((p) => p.id === patientId) || patients[0];
  const patientReferral = referrals.find((r) => r.patientId === patient?.id);

  // Call State Management
  const [callMode, setCallMode] = useState<CallMode>('video');
  const [callState, setCallState] = useState<CallState>('pre');
  const [micOn, setMicOn] = useState<boolean>(true);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [speakerOn, setSpeakerOn] = useState<boolean>(true);
  
  // Closed Captions (CC)
  const [ccEnabled, setCcEnabled] = useState<boolean>(true);
  const [ccLanguage, setCcLanguage] = useState<CaptionLanguage>('en');
  const [ccSize, setCcSize] = useState<CaptionSize>('medium');
  const [captionIndex, setCaptionIndex] = useState<number>(0);

  // UI Drawer & Modal State
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showEndConfirmModal, setShowEndConfirmModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showHistoryTimeline, setShowHistoryTimeline] = useState<boolean>(false);
  const [simulatedNetwork, setSimulatedNetwork] = useState<'good' | 'poor'>('good');

  // Timer & Notes
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [notesSaved, setNotesSaved] = useState<boolean>(false);

  // Prescription Form State
  const [rxMedicine, setRxMedicine] = useState<string>('Labetalol 100mg');
  const [rxDosage, setRxDosage] = useState<string>('1 tablet twice daily after meals');
  const [rxDuration, setRxDuration] = useState<string>('14 Days');
  const [rxSaved, setRxSaved] = useState<boolean>(false);

  // Referral Form State
  const [refFacility, setRefFacility] = useState<string>('Coimbatore Medical College Hospital');
  const [refReason, setRefReason] = useState<string>('Gestational Hypertension & Doppler Ultrasound Review');
  const [refPriority, setRefPriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');
  const [refCreated, setRefCreated] = useState<boolean>(false);

  // Follow-up Form State
  const [followUpDate, setFollowUpDate] = useState<string>('2026-08-28');
  const [followUpNotes, setFollowUpNotes] = useState<string>('Check BP and proteinuria status post-medication.');
  const [followUpSaved, setFollowUpSaved] = useState<boolean>(false);

  // Live In-call Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Health Worker', text: 'Doctor, Lakshmi Devi is with me at the Kallipalayam Sub-Centre tele-room.', time: '10:00 AM' },
    { id: '2', sender: 'Doctor', text: 'Thank you Meena. I am reviewing her vitals now.', time: '10:01 AM' }
  ]);
  const [newMsgText, setNewMsgText] = useState<string>('');

  // Active Tab in Right Drawer
  const [activeRightTab, setActiveRightTab] = useState<'info' | 'notes' | 'prescription' | 'referral' | 'followup'>('info');

  // Call timer & caption auto-cycle simulation
  useEffect(() => {
    let timer: any = null;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setDurationSeconds((d) => d + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  useEffect(() => {
    let captionTimer: any = null;
    if (callState === 'connected' && ccEnabled) {
      captionTimer = setInterval(() => {
        setCaptionIndex((idx) => (idx + 1) % SAMPLE_CAPTIONS[ccLanguage].length);
      }, 7000);
    }
    return () => {
      if (captionTimer) clearInterval(captionTimer);
    };
  }, [callState, ccEnabled, ccLanguage]);

  const handleStartCall = (mode: CallMode) => {
    setCallMode(mode);
    setCameraOn(mode === 'video');
    setCallState('connecting');
    setTimeout(() => {
      setCallState('connected');
    }, 1500);
  };

  const handleEndCallConfirmed = () => {
    setShowEndConfirmModal(false);
    setCallState('ended');
    setShowSummaryModal(true);
  };

  const handleSendMessage = () => {
    if (!newMsgText.trim()) return;
    const msg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: user.role === 'doctor' ? 'Doctor' : 'Health Worker',
      text: newMsgText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMsgText('');
  };

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const handleSavePrescription = () => {
    setRxSaved(true);
    setTimeout(() => setRxSaved(false), 3000);
  };

  const handleCreateReferralForm = () => {
    createReferral(
      {
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        patientVillage: patient.village,
        patientAge: patient.age,
        reason: refReason,
        urgency: refPriority,
        sourceFacility: user.facility || 'Kallipalayam Sub-Centre',
        destinationFacility: refFacility,
        clinicalNotes: clinicalNotes || 'Escalated via teleconsultation session.'
      },
      user.name
    );
    setRefCreated(true);
    setTimeout(() => setRefCreated(false), 3000);
  };

  const handleScheduleFollowUpForm = () => {
    setFollowUpSaved(true);
    setTimeout(() => setFollowUpSaved(false), 3000);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const currentCaptions = SAMPLE_CAPTIONS[ccLanguage][captionIndex] || SAMPLE_CAPTIONS.en[0];

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => navigate(`/doctor-patients/${patient.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-1 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Patient Profile</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-violet-600" />
            <span>Teleconsultation Room — {patient.name}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Doctor: Dr. {user.name} ({user.facility}) · Patient ID: {patient.id}
          </p>
        </div>

        {/* Status Indicators & Call Mode */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>🔒 Private Consultation</span>
          </div>

          {callState === 'connected' && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl font-extrabold text-rose-800 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>LIVE · {formatDuration(durationSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Low Connectivity Alert Banner for Rural Environments (SIH26133 Requirement) */}
      {simulatedNetwork === 'poor' && callState === 'connected' && (
        <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Poor Internet Connection Detected</p>
              <p className="text-amber-800 font-medium">
                Bandwidth is limited in this rural sector. Switch to Voice Consultation to maintain clear audio.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCallMode('voice');
                setCameraOn(false);
                setSimulatedNetwork('good');
              }}
              className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-xs"
            >
              🎤 Switch to Voice Call
            </button>
            <button
              onClick={() => setSimulatedNetwork('good')}
              className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pre-Call Consultation Selector Screen */}
      {callState === 'pre' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto shadow-sm">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Choose Consultation Type</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
              Connect with {patient.name} at {patient.village} Sub-Centre. Select consultation mode based on internet quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Video Consultation Option */}
            <div
              onClick={() => handleStartCall('video')}
              className="p-5 rounded-2xl border-2 border-violet-200 bg-violet-50/50 hover:bg-violet-100/60 hover:border-violet-600 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">🎥 Video Consultation</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Talk face-to-face with live video, audio, and real-time Closed Captions (CC).
              </p>
              <span className="inline-block mt-3 text-[11px] font-extrabold text-violet-800 bg-white px-2.5 py-1 rounded-lg border border-violet-200 shadow-2xs">
                Recommended for Clinical Review →
              </span>
            </div>

            {/* Voice Consultation Option */}
            <div
              onClick={() => handleStartCall('voice')}
              className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-teal-500 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">🎤 Voice Consultation</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Use low-bandwidth audio-only mode with live Closed Captions (CC). Best for low network areas.
              </p>
              <span className="inline-block mt-3 text-[11px] font-extrabold text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                Low Internet Mode →
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Patient: {patient.name} ({patient.id})</span>
            <span>Assigned ASHA: {patient.assignedWorker}</span>
          </div>
        </div>
      )}

      {/* Active Call & Connecting View */}
      {(callState === 'connecting' || callState === 'connected') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Section: Video Viewport & Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col justify-between min-h-[460px]">
              
              {/* Connecting Animation Overlay */}
              {callState === 'connecting' && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
                  <div className="w-16 h-16 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                  <p className="font-extrabold text-base">Connecting Secure Teleconsultation...</p>
                  <p className="text-xs text-slate-400">Establishing WebRTC connection with {patient.village} Sub-Centre</p>
                </div>
              )}

              {/* Top Viewport Status Overlay */}
              <div className="p-4 flex justify-between items-center z-10 bg-gradient-to-b from-slate-950/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800/80 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                    {callMode === 'video' ? '🎥 Video Call' : '🎤 Voice Call'}
                  </span>
                  <button
                    onClick={() => setSimulatedNetwork(simulatedNetwork === 'good' ? 'poor' : 'good')}
                    className={`text-[10px] font-bold px-2 py-1 rounded-xl border ${
                      simulatedNetwork === 'good'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}
                  >
                    {simulatedNetwork === 'good' ? '🟢 Network Good' : '🟡 Simulated Poor Network'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="p-2 bg-slate-800/80 text-slate-300 hover:text-white rounded-xl border border-slate-700"
                    title="Caption & Audio Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-2 bg-slate-800/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 relative"
                    title="Live Chat Drawer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {chatMessages.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-500 rounded-full text-[9px] font-bold text-slate-950 flex items-center justify-center">
                        {chatMessages.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Remote Viewport (Patient Stream / Profile Avatar) */}
              <div className="relative my-4 flex-1 flex items-center justify-center px-4">
                {callMode === 'video' && cameraOn ? (
                  <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 rounded-full bg-teal-800 text-white font-black text-4xl flex items-center justify-center mx-auto border-4 border-teal-500 shadow-xl animate-pulse">
                        {patient.name.charAt(0)}
                      </div>
                      <p className="text-white font-extrabold text-lg">{patient.name}</p>
                      <p className="text-xs text-slate-400">Village: {patient.village} · Connected via ASHA Device</p>
                    </div>

                    {/* Live Camera Stream Indicator */}
                    <span className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                      LIVE PATIENT FEED
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-center p-6">
                    <div className="space-y-3">
                      <div className="w-24 h-24 rounded-full bg-slate-800 text-teal-400 font-black text-4xl flex items-center justify-center mx-auto border-4 border-teal-600 shadow-lg">
                        {patient.name.charAt(0)}
                      </div>
                      <p className="text-white font-bold text-base">Voice Consultation Active</p>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto">
                        Audio stream is active with low-bandwidth optimization. Live Closed Captions (CC) are enabled below.
                      </p>
                      {callMode === 'voice' && (
                        <button
                          onClick={() => {
                            setCallMode('video');
                            setCameraOn(true);
                          }}
                          className="py-1.5 px-3 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                        >
                          🎥 Enable Camera / Video Call
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Self View (Doctor PiP Box) */}
                <div className="absolute bottom-3 right-3 w-32 h-24 bg-slate-900 rounded-xl border-2 border-teal-500 shadow-xl overflow-hidden flex flex-col items-center justify-center text-white">
                  {cameraOn ? (
                    <div className="text-center p-1">
                      <div className="w-8 h-8 rounded-full bg-violet-700 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1">
                        {user.name.charAt(0)}
                      </div>
                      <p className="text-[10px] font-bold text-slate-200 truncate max-w-[100px]">Dr. {user.name.split(' ').pop()}</p>
                      <span className="text-[9px] text-emerald-400 font-semibold">Camera ON</span>
                    </div>
                  ) : (
                    <div className="text-center p-1 text-slate-400">
                      <VideoOff className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                      <span className="text-[9px] font-bold text-rose-300">Camera OFF</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Closed Captions (CC) Overlay Banner */}
              {ccEnabled && (
                <div className="bg-slate-900/95 border-t border-slate-800 p-3 z-20 text-center transition-all">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-2">
                    <span className="flex items-center gap-1 font-bold text-teal-400">
                      <Subtitles className="w-3.5 h-3.5" />
                      Live Closed Captions ({ccLanguage.toUpperCase()})
                    </span>
                    <span>Text Size: {ccSize}</span>
                  </div>

                  <div className="space-y-1 max-w-xl mx-auto">
                    <p
                      className={`font-semibold text-teal-200 transition-all ${
                        ccSize === 'small' ? 'text-xs' : ccSize === 'large' ? 'text-base font-extrabold' : 'text-sm'
                      }`}
                    >
                      <strong className="text-emerald-400 font-bold">Doctor:</strong> "{currentCaptions.doctor}"
                    </p>
                    <p
                      className={`font-medium text-slate-200 transition-all ${
                        ccSize === 'small' ? 'text-[11px]' : ccSize === 'large' ? 'text-sm font-extrabold' : 'text-xs'
                      }`}
                    >
                      <strong className="text-sky-400 font-bold">Patient:</strong> "{currentCaptions.patient}"
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Control Toolbar (Simple English Controls) */}
              <div className="bg-slate-900 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
                <div className="flex items-center gap-2">
                  {/* Microphone Toggle */}
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      micOn
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-rose-600 text-white font-extrabold'
                    }`}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    <span>{micOn ? 'Mute' : 'Unmute'}</span>
                  </button>

                  {/* Camera Toggle */}
                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      cameraOn
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-rose-600 text-white font-extrabold'
                    }`}
                  >
                    {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    <span>{cameraOn ? 'Camera' : 'Camera OFF'}</span>
                  </button>

                  {/* Speaker Audio Toggle */}
                  <button
                    onClick={() => setSpeakerOn(!speakerOn)}
                    className={`py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      speakerOn
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {speakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>{speakerOn ? 'Speaker' : 'Muted'}</span>
                  </button>

                  {/* CC Captions Toggle */}
                  <button
                    onClick={() => setCcEnabled(!ccEnabled)}
                    className={`py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      ccEnabled
                        ? 'bg-teal-600 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <Subtitles className="w-4 h-4" />
                    <span>{ccEnabled ? 'CC ✓' : 'CC OFF'}</span>
                  </button>
                </div>

                {/* End Call Button */}
                <button
                  onClick={() => setShowEndConfirmModal(true)}
                  className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>🔴 End Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Patient Info Panel & Interactive Post-Call Forms */}
          <div className="space-y-4">
            {/* Tabs for Patient Info & Clinical Tools */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex overflow-x-auto gap-1 text-xs font-bold no-scrollbar">
              <button
                onClick={() => setActiveRightTab('info')}
                className={`py-2 px-3 rounded-xl transition-all shrink-0 ${
                  activeRightTab === 'info' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Patient Info
              </button>

              <button
                onClick={() => setActiveRightTab('notes')}
                className={`py-2 px-3 rounded-xl transition-all shrink-0 ${
                  activeRightTab === 'notes' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Doctor Notes
              </button>

              <button
                onClick={() => setActiveRightTab('prescription')}
                className={`py-2 px-3 rounded-xl transition-all shrink-0 ${
                  activeRightTab === 'prescription' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Prescription
              </button>

              <button
                onClick={() => setActiveRightTab('referral')}
                className={`py-2 px-3 rounded-xl transition-all shrink-0 ${
                  activeRightTab === 'referral' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Referral
              </button>

              <button
                onClick={() => setActiveRightTab('followup')}
                className={`py-2 px-3 rounded-xl transition-all shrink-0 ${
                  activeRightTab === 'followup' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Next Check-up
              </button>
            </div>

            {/* TAB 1: Patient Information Panel */}
            {activeRightTab === 'info' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{patient.name}</h3>
                    <p className="text-slate-500 font-medium">{patient.age}y · {patient.gender} · {patient.village}</p>
                    <p className="text-teal-800 font-mono font-bold mt-0.5">ID: {patient.id}</p>
                  </div>
                  <StatusBadge type="risk" status={patient.riskLevel} />
                </div>

                {/* AI Risk Indicator */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                  <span className="font-extrabold text-rose-800 block text-xs">AI Health Risk Check: 🔴 HIGH RISK (82%)</span>
                  <p className="text-rose-800 font-medium">
                    Priority doctor review recommended due to Gestational Hypertension (BP 150/95 mmHg).
                  </p>
                </div>

                {/* Current Symptoms */}
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">Current Symptoms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Severe Frontal Headache', 'Mild Dizziness', 'High BP Elevation', 'Gestational 24 Weeks'].map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg">
                        • {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Latest Vitals Grid */}
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">Latest Vitals</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Blood Pressure</span>
                      <span className="font-extrabold text-rose-700 text-sm">{patient.latestVitals.bp}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Heart Rate</span>
                      <span className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.heartRate} bpm</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">SpO2 Level</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{patient.latestVitals.spO2}%</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Temperature</span>
                      <span className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.temp}</span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Longitudinal Health History Timeline */}
                <div className="border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setShowHistoryTimeline(!showHistoryTimeline)}
                    className="w-full flex justify-between items-center font-bold text-teal-800 hover:text-teal-900 py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-teal-700" />
                      <span>Longitudinal Health History Timeline</span>
                    </span>
                    {showHistoryTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showHistoryTimeline && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 animate-fade-in">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-[10px] font-bold text-teal-800">2026-08-24 · PHC Consultation</span>
                        <p className="font-bold text-slate-900">Gestational Hypertension Assessment</p>
                        <p className="text-slate-600 text-[11px]">BP 150/95 recorded by ASHA Meena. Referred for CMCH OPD.</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-[10px] font-bold text-purple-800">2026-08-21 · Lab Test Result</span>
                        <p className="font-bold text-slate-900">Urine Albumin Trace (+)</p>
                        <p className="text-slate-600 text-[11px]">Hb: 11.2 g/dL (Mild Anemia). Lab technician: R. Loganathan.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Doctor Notes */}
            {activeRightTab === 'notes' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 animate-fade-in text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-teal-700" />
                  Doctor's Consultation Notes
                </h3>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Enter clinical observations, patient-reported symptoms, and diagnostic plan during or after the call..."
                  rows={6}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none font-medium"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-xs"
                  >
                    {notesSaved ? '✓ Notes Saved' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => setClinicalNotes('')}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Add Prescription */}
            {activeRightTab === 'prescription' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 animate-fade-in text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-700" />
                  Add Prescription After Call
                </h3>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medicine Name:</label>
                  <input
                    type="text"
                    value={rxMedicine}
                    onChange={(e) => setRxMedicine(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage & Frequency:</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration:</label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={(e) => setRxDuration(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <button
                  onClick={handleSavePrescription}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs"
                >
                  {rxSaved ? '✓ Prescription Saved' : 'Save Prescription'}
                </button>
              </div>
            )}

            {/* TAB 4: Send to Another Hospital (Referral) */}
            {activeRightTab === 'referral' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 animate-fade-in text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-700" />
                  Send to Another Hospital (Referral)
                </h3>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Facility:</label>
                  <select
                    value={refFacility}
                    onChange={(e) => setRefFacility(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Coimbatore Medical College Hospital">Coimbatore Medical College Hospital (CMCH)</option>
                    <option value="Annur Government Hospital">Annur Government Hospital</option>
                    <option value="Neelambur PHC">Neelambur PHC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency / Priority Level:</label>
                  <select
                    value={refPriority}
                    onChange={(e) => setRefPriority(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency (108 Ambulance)</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Referral Reason:</label>
                  <textarea
                    value={refReason}
                    onChange={(e) => setRefReason(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 resize-none font-medium"
                  />
                </div>
                <button
                  onClick={handleCreateReferralForm}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs"
                >
                  {refCreated ? '✓ Hospital Referral Created' : 'Create Referral'}
                </button>
              </div>
            )}

            {/* TAB 5: Next Check-up (Follow-up) */}
            {activeRightTab === 'followup' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 animate-fade-in text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Schedule Next Check-up
                </h3>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Next Visit Date:</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructions for Health Worker / Patient:</label>
                  <textarea
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 resize-none font-medium"
                  />
                </div>
                <button
                  onClick={handleScheduleFollowUpForm}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-xs"
                >
                  {followUpSaved ? '✓ Next Check-up Scheduled' : 'Schedule Follow-up'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* In-Call Live Chat Drawer Overlay */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-fade-in text-xs">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <span>In-Call Live Chat</span>
            </div>
            <button onClick={() => setShowChat(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl max-w-[85%] ${
                  msg.sender === 'Doctor'
                    ? 'ml-auto bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex justify-between text-[10px] font-bold opacity-80 mb-1">
                  <span>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="leading-relaxed font-medium">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 flex items-center gap-2 bg-slate-50">
            <input
              type="text"
              placeholder="Type message to ASHA/Patient..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Caption & Audio Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 font-extrabold text-slate-900">
              <span>Caption & Accessibility Settings</span>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Caption Language (CC):</label>
              <select
                value={ccLanguage}
                onChange={(e) => setCcLanguage(e.target.value as CaptionLanguage)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Caption Text Size:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as CaptionSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setCcSize(sz)}
                    className={`py-2 rounded-xl font-bold uppercase text-[11px] ${
                      ccSize === sz ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-extrabold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* End Call Confirmation Modal */}
      {showEndConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <PhoneOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">End Teleconsultation?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to end the session with {patient.name}?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEndConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEndCallConfirmed}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Call Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-lg">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Consultation Completed</h3>
                <p className="text-slate-500">Session record successfully attached to longitudinal timeline</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
                <p className="font-bold text-slate-900">{patient.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Doctor</span>
                <p className="font-bold text-slate-900">Dr. {user.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Call Mode</span>
                <p className="font-bold text-teal-800">{callMode === 'video' ? '🎥 Video Call' : '🎤 Voice Call'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Call Duration</span>
                <p className="font-bold text-slate-900">{formatDuration(durationSeconds)}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Closed Captions</span>
                <p className="font-bold text-slate-900">{ccEnabled ? `Enabled (${ccLanguage.toUpperCase()})` : 'Disabled'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Prescription</span>
                <p className="font-bold text-emerald-700">{rxSaved ? 'Added' : 'Review Needed'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  navigate(`/doctor-patients/${patient.id}`);
                }}
                className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs text-center shadow-xs"
              >
                View Patient Record
              </button>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  navigate('/dashboard');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs text-center border border-slate-200"
              >
                Back to Doctor Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationPage;
