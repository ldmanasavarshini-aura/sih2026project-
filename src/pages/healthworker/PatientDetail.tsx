import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  User,
  Activity,
  Share2,
  Calendar,
  TestTube,
  Pill,
  Clock,
  FileText,
  Edit,
  Stethoscope,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowLeft,
  X
} from 'lucide-react';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    patients,
    updatePatient,
    recordVitals,
    appointments,
    referrals,
    testResults,
    medicines,
    followUps,
    auditLogs
  } = useHealthData();

  const patientId = id || 'SS-PT-10021';
  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'visits' | 'vitals' | 'referrals' | 'diagnostics' | 'prescriptions' | 'followups' | 'audit'
  >('overview');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Modal form states
  const [editForm, setEditForm] = useState({
    name: patient.name,
    age: patient.age,
    phone: patient.phone,
    village: patient.village,
    riskLevel: patient.riskLevel
  });

  const [vitalsForm, setVitalsForm] = useState({
    bp: patient.latestVitals.bp,
    heartRate: patient.latestVitals.heartRate,
    spO2: patient.latestVitals.spO2,
    temp: patient.latestVitals.temp,
    bloodSugar: patient.latestVitals.bloodSugar || 110
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, editForm, user.name);
    setShowEditModal(false);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    recordVitals(
      patient.id,
      {
        bp: vitalsForm.bp,
        heartRate: Number(vitalsForm.heartRate) || 80,
        spO2: Number(vitalsForm.spO2) || 98,
        temp: vitalsForm.temp,
        bloodSugar: Number(vitalsForm.bloodSugar) || 110,
        recordedAt: new Date().toLocaleString(),
        recordedBy: user.name
      },
      user.name
    );
    setShowVitalsModal(false);
  };

  // Filtered sub-data for this patient
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientReferrals = referrals.filter((r) => r.patientId === patient.id);
  const patientTests = testResults.filter((t) => t.patientId === patient.id);
  const patientMeds = medicines.filter((m) => m.patientId === patient.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === patient.id);
  const patientAudits = auditLogs.filter((a) => a.patientId === patient.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/patients')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{patient.name}</h1>
                <StatusBadge type="risk" status={patient.riskLevel} />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ID: <strong className="font-mono text-teal-800">{patient.id}</strong> • {patient.age}y • {patient.gender} • Village: {patient.village}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-teal-200"
            >
              <QrCode className="w-4 h-4 text-teal-700" />
              <span>QR Token</span>
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200"
            >
              <Edit className="w-4 h-4 text-slate-600" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => navigate(`/triage`)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Triage</span>
            </button>
          </div>
        </div>

        {/* Audit Note */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>ABHA ID: {patient.abhaId || '91-4829-1029-4412'}</span>
          <span>Last updated by {patient.lastUpdatedBy} at {patient.lastUpdatedAt}</span>
        </div>
      </div>

      {/* 8 Tabs Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex overflow-x-auto gap-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'visits', label: 'Visits', icon: FileText },
          { id: 'vitals', label: 'Vitals', icon: Activity },
          { id: 'referrals', label: `Referrals (${patientReferrals.length})`, icon: Share2 },
          { id: 'diagnostics', label: `Diagnostics (${patientTests.length})`, icon: TestTube },
          { id: 'prescriptions', label: `Prescriptions (${patientMeds.length})`, icon: Pill },
          { id: 'followups', label: `Follow-ups (${patientFollowUps.length})`, icon: Clock },
          { id: 'audit', label: 'Audit Log', icon: CheckCircle2 }
        ].map((tb) => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tb.id
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Clinical Risk & Demographics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase">Assessed Clinical Risk</span>
                <p className="font-bold text-rose-900 text-sm mt-0.5">{patient.riskReason}</p>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-slate-900">{patient.phone}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Emergency Contact:</span>
                <strong className="text-slate-900">{patient.emergencyContact}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Blood Group:</span>
                <strong className="text-rose-700 font-extrabold">{patient.bloodGroup}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Pregnancy Status:</span>
                <strong className="text-teal-800">{patient.isPregnant ? `${patient.pregnancyWeeks} Weeks Gestation` : 'Not pregnant'}</strong>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Latest Recorded Vitals</h3>
              <button
                onClick={() => setShowVitalsModal(true)}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Record Vitals
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold">BP</span>
                <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.bp}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold">Heart Rate</span>
                <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.heartRate} bpm</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold">SpO2</span>
                <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.spO2}%</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold">Temp</span>
                <p className="font-extrabold text-slate-900 text-sm">{patient.latestVitals.temp}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: VISITS */}
      {activeTab === 'visits' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Patient Clinical Visit History</h3>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Kallipalayam Sub-Centre Screening Visit</span>
                <span className="text-slate-400">{patient.lastVisitDate}</span>
              </div>
              <p className="text-slate-600 mt-1">
                Routine ANC Screening visit. Elevated blood pressure (150/95) recorded. Referred to CMCH tertiary hospital for high-risk obstetric evaluation.
              </p>
              <p className="text-[11px] text-teal-800 font-semibold mt-2">Examined by: {user.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: VITALS */}
      {activeTab === 'vitals' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Vitals Log</h3>
            <button
              onClick={() => setShowVitalsModal(true)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Vitals</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
              <span>BP: {patient.latestVitals.bp} mmHg</span>
              <span>HR: {patient.latestVitals.heartRate} bpm</span>
              <span>SpO2: {patient.latestVitals.spO2}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Recorded by {patient.latestVitals.recordedBy} at {patient.latestVitals.recordedAt}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Patient Clinical Referrals</h3>
            <button
              onClick={() => navigate('/referrals/create')}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Referral</span>
            </button>
          </div>

          {patientReferrals.map((ref) => (
            <div key={ref.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{ref.id} — {ref.destinationFacility}</span>
                <StatusBadge type="referral" status={ref.status} />
              </div>
              <p className="text-slate-600">{ref.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 5: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Laboratory Diagnostic Reports</h3>
          {patientTests.map((t) => (
            <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
              <div>
                <p className="font-bold text-slate-900">{t.testName}</p>
                <p className="text-slate-600">{t.resultSummary}</p>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 6: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Active Prescribed Medications</h3>
          {patientMeds.map((m) => (
            <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
              <div>
                <p className="font-bold text-slate-900">{m.medicineName}</p>
                <p className="text-slate-600">{m.dosage} • {m.frequency}</p>
              </div>
              <StatusBadge type="stock" status={m.facilityStockStatus} />
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 7: FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Assigned Follow-up Home Visits</h3>
          {patientFollowUps.map((f) => (
            <div key={f.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
              <div>
                <p className="font-bold text-slate-900">{f.purpose}</p>
                <p className="text-slate-600">Due: {f.dueDate} • Worker: {f.assignedWorker}</p>
              </div>
              <StatusBadge type="followup" status={f.status} />
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 8: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Full Action Audit Trail</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {patientAudits.map((a) => (
              <div key={a.id} className="py-2 flex justify-between">
                <div>
                  <p className="font-bold text-slate-900">{a.action}</p>
                  <p className="text-slate-500 text-[11px]">{a.details}</p>
                </div>
                <span className="text-[10px] text-teal-700 font-semibold">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Edit Patient Profile</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Save Updates
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VITALS MODAL */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveVitals} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowVitalsModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Record New Vitals</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">BP (mmHg)</label>
                <input
                  type="text"
                  value={vitalsForm.bp}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bp: e.target.value })}
                  placeholder="e.g. 140/90"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={vitalsForm.heartRate}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitalsForm.spO2}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, spO2: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Temp (°F)</label>
                <input
                  type="text"
                  value={vitalsForm.temp}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, temp: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Record Vitals & Update Audit Log
              </button>
            </div>
          </form>
        </div>
      )}

      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title={`Patient Token: ${patient.id}`}
        subtitle={patient.name}
        qrValue={patient.id}
        details={[
          { label: 'Name', value: patient.name },
          { label: 'ID', value: patient.id },
          { label: 'ABHA', value: patient.abhaId || 'N/A' },
          { label: 'Village', value: patient.village }
        ]}
      />
    </div>
  );
};
