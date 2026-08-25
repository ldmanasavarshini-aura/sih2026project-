import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  QrCode,
  Calendar,
  Share2,
  TestTube,
  Pill,
  Clock,
  Phone,
  Lock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Siren,
  HeartHandshake,
  MapPin
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, appointments, referrals, testResults, medicines, followUps } = useHealthData();
  const { t } = useLanguage();

  const [showQR, setShowQR] = useState(false);

  // Lakshmi Devi's records (SS-PT-10021)
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const nextAppointment = appointments.find((a) => a.patientId === patient.id && a.status === 'Booked');
  const activeReferral = referrals.find((r) => r.patientId === patient.id);
  const pendingFollowUp = followUps.find((f) => f.patientId === patient.id && f.status === 'Pending');
  const latestTest = testResults.find((t) => t.patientId === patient.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Strict View-Only Banner */}
      <div className="bg-teal-900 text-teal-50 p-4 rounded-2xl border border-teal-800 shadow-sm flex items-start gap-3">
        <Lock className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-white mb-0.5">Citizen View-Only Mode</p>
          <p className="text-teal-100 leading-relaxed">
            {t('view_only_banner')}
          </p>
        </div>
      </div>

      {/* Hero Welcome Header & Patient QR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Patient Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {patient.id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Welcome, {patient.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Village: {patient.village} | Assigned ASHA: {patient.assignedWorker}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/healthcare-map')}
            className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>Find Nearby Hospital or PHC</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs flex items-center gap-2 border border-teal-200 transition-all shadow-2xs"
          >
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>Show Patient Health QR Token</span>
          </button>
        </div>
      </div>

      {/* Health Risk & Vitals Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Current Health Status</h3>
            <p className="text-xs text-slate-500">Latest vitals recorded by {patient.latestVitals.recordedBy}</p>
          </div>
          <StatusBadge type="risk" status={patient.riskLevel} />
        </div>

        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl mb-4 text-xs text-rose-900">
          <p className="font-bold flex items-center gap-1.5 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Active Care Note:</span>
          </p>
          <p className="mt-0.5 text-rose-800">{patient.riskReason}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
            <p className="font-extrabold text-slate-900 text-base mt-0.5">{patient.latestVitals.bp}</p>
            <span className="text-[10px] text-rose-600 font-bold">Elevated</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
            <p className="font-extrabold text-slate-900 text-base mt-0.5">{patient.latestVitals.heartRate} bpm</p>
            <span className="text-[10px] text-emerald-600 font-bold">Normal</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">SpO2 Level</span>
            <p className="font-extrabold text-slate-900 text-base mt-0.5">{patient.latestVitals.spO2}%</p>
            <span className="text-[10px] text-emerald-600 font-bold">Normal</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Gestational Age</span>
            <p className="font-extrabold text-teal-800 text-base mt-0.5">24 Weeks</p>
            <span className="text-[10px] text-teal-700 font-bold">ANC 2nd Trimester</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Next Appointment</h3>
              </div>
              {nextAppointment && <StatusBadge type="appointment" status={nextAppointment.status} />}
            </div>

            {nextAppointment ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <p className="font-bold text-slate-900 text-sm">{nextAppointment.specialty}</p>
                  <p className="text-slate-600 mt-0.5">{nextAppointment.facility}</p>
                  <div className="mt-2 flex justify-between items-center text-slate-700 pt-2 border-t border-sky-200/60 font-semibold">
                    <span>Date: {nextAppointment.date}</span>
                    <span>Token: <strong className="text-teal-800 font-mono">{nextAppointment.queueToken}</strong></span>
                  </div>
                </div>
                <p className="text-slate-500 italic text-[11px]">{nextAppointment.instructions}</p>
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center">No upcoming appointments</p>
            )}
          </div>

          <button
            onClick={() => navigate('/appointments')}
            className="mt-4 w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
          >
            <span>View Appointment Queue Token & Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Referral Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Active Referral Status</h3>
              </div>
              {activeReferral && <StatusBadge type="referral" status={activeReferral.status} />}
            </div>

            {activeReferral ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">Destination Facility</span>
                  <p className="font-bold text-slate-900 text-sm">{activeReferral.destinationFacility}</p>
                  <p className="text-slate-600 mt-1">{activeReferral.reason}</p>
                  <div className="mt-2 text-[11px] text-teal-800 font-medium">
                    Transport: {activeReferral.transportStatus}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center">No active referrals</p>
            )}
          </div>

          <button
            onClick={() => navigate('/referrals')}
            className="mt-4 w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
          >
            <span>Track 6-Stage Referral Flow</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second Row: Test Results & Medication Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Results */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <TestTube className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Test Result</h3>
            </div>
            <button
              onClick={() => navigate('/test-results')}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              View All
            </button>
          </div>

          {latestTest ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{latestTest.testName}</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  {latestTest.status}
                </span>
              </div>
              <p className="text-slate-600">{latestTest.resultSummary}</p>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                Facility: {latestTest.facility} | Date: {latestTest.resultDate}
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-xs py-4">No recent lab reports</p>
          )}
        </div>

        {/* Medicines */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Prescribed Medications</h3>
            </div>
            <button
              onClick={() => navigate('/medicines')}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              Check Availability
            </button>
          </div>

          <div className="space-y-2">
            {medicines.map((m) => (
              <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">{m.medicineName}</p>
                  <p className="text-slate-500 text-[11px]">{m.dosage} • {m.frequency}</p>
                </div>
                <StatusBadge type="stock" status={m.facilityStockStatus} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency 108 Card */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Siren className="w-5 h-5 text-white animate-pulse" />
            <h3 className="text-lg font-extrabold">Emergency Assistance (108 Ambulance)</h3>
          </div>
          <p className="text-xs text-red-100 max-w-lg">
            If you experience severe headache, blurred vision, bleeding, or acute chest pain, contact emergency medical transport immediately.
          </p>
        </div>

        <a
          href="tel:108"
          className="w-full sm:w-auto py-3 px-6 bg-white text-red-700 font-extrabold rounded-xl text-sm shadow-md hover:bg-red-50 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Call 108 Emergency</span>
        </a>
      </div>

      {/* Patient QR Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Lakshmi Devi — Digital Patient QR"
        subtitle="Present this QR at PHC or Hospital check-in desks"
        qrValue={patient.id}
        details={[
          { label: 'Patient Name', value: patient.name },
          { label: 'Patient ID', value: patient.id },
          { label: 'ABHA Number', value: patient.abhaId || '91-4829-1029-4412' },
          { label: 'Village', value: patient.village },
          { label: 'Care Status', value: 'High Risk ANC Referral' }
        ]}
      />
    </div>
  );
};
