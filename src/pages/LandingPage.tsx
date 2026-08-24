import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Building2,
  Activity,
  Stethoscope,
  Calendar,
  Share2,
  Pill,
  Wifi,
  Globe,
  ArrowRight,
  CheckCircle2,
  Check,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Subtle Shapes */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-600 text-teal-200 text-xs font-semibold mb-6">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>National Health Mission Rural Digital Health Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Healthcare should not depend on distance.
          </h1>

          <p className="text-base sm:text-xl text-teal-100 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            SwasthyaSetu helps patients, frontline health workers, public facilities, and administrators stay connected throughout the care journey.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={handleLoginClick}
              className="py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Login to SwasthyaSetu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="py-3.5 px-6 bg-teal-800/80 hover:bg-teal-700 text-white font-bold rounded-xl text-sm sm:text-base border border-teal-600/80 flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Features</span>
            </a>
          </div>
        </div>
      </section>

      {/* Role Permissions Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citizen Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">1. Citizen / Patient</h3>
                <span className="bg-teal-50 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                  VIEW ONLY
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                View personal health records, ANC history, upcoming appointment queue tokens, active referrals, test results, and medication schedules.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal health timeline & vitals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live appointment queue check-in QR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emergency 108 direct dispatch</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleLoginClick}
              className="mt-6 w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-teal-200 transition-all"
            >
              <span>Login as Lakshmi Devi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Health Worker Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Primary Operator
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">2. Health Worker (ASHA)</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  CREATE + EDIT
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Register village patients, run smart symptom triage, book PHC/Hospital appointments, issue 6-stage referrals, and record home visit outcomes.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Register & edit patient profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Smart danger-sign triage screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Offline-first record saving & sync</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleLoginClick}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <span>Login as Meena R (ASHA)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Higher Official Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900">3. Higher Official (DHO)</h3>
                <span className="bg-indigo-50 text-indigo-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  VIEW ANALYTICS
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Monitor district health KPIs, facility referral completion turnaround, high-risk cases, stock-outs of essential medicines, and diagnostic gaps.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Recharts visual analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anonymized high-risk patient list</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Facility performance & stock metrics</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleLoginClick}
              className="mt-6 w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-indigo-200 transition-all"
            >
              <span>Login as Priya Deshmukh</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Comprehensive Rural Healthcare Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-1 font-medium">
            Designed for low bandwidth, multi-role collaboration, and seamless clinical continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Digital Patient Records</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete longitudinal record with vitals history, allergies, pregnancy tracking, and consent audit logs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mb-3">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Smart Symptom Triage</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Guided clinical danger sign checklist with instant risk classification (Green, Yellow, Red, Emergency).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Appointment & Queue Token</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Book PHC/Hospital appointments with live queue token tracking and digital QR code check-in.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">6-Stage Referral Tracker</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              End-to-end referral pipeline: Created → Sent → Accepted → Facility Visit → Consultation → Follow-up.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center mb-3">
              <Pill className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Medicine & Diagnostic Stock</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Real-time public facility availability indicators for Metformin, Amlodipine, IFA, Insulin, and labs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Follow-Up Task Support</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ASHA worker reminders for maternal care, overdue child vaccinations, and chronic care refills.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center mb-3">
              <Wifi className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Offline-First Connectivity</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Save records offline in remote sub-centres and perform one-click batch sync when signal returns.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Multilingual Interface</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instant UI translations in English, Hindi (हिंदी), Marathi (मराठी), and Tamil (தமிழ்).
            </p>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Continuity of Care Journey</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">From sub-centre registration to district hospital consultation and home follow-up</p>
        </div>

        <div className="relative">
          {/* Connected Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-teal-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
            {[
              { step: '1', title: 'Registration', desc: 'Health Worker registers patient & ABHA ID' },
              { step: '2', title: 'Screening', desc: 'Vitals & Smart Triage symptom check' },
              { step: '3', title: 'Referral', desc: 'Urgent referral sent to PHC / Hospital' },
              { step: '4', title: 'Consultation', desc: 'Specialist visit & treatment at facility' },
              { step: '5', title: 'Follow-up', desc: 'ASHA home visit & medicine adherence' },
              { step: '6', title: 'Quality Review', desc: 'Official monitors district outcomes' }
            ].map((st, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center mx-auto mb-2 shadow-xs">
                  {st.step}
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{st.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
