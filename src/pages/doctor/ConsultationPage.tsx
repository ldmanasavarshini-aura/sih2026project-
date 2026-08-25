import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Stethoscope,
  HeartPulse,
  Brain,
  Pill,
  ClipboardList,
  Share2,
  Clock,
  Siren,
  CheckCircle2,
  Plus,
  Trash2,
  Info
} from 'lucide-react';

interface PrescriptionRow {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

type ReferralDecision = 'None' | 'Accept' | 'Modify' | 'Reject';

export const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const { patients, referrals } = useHealthData();

  const patient = patients.find((p) => p.id === patientId);
  const patientReferral = referrals.find((r) => r.patientId === patientId);

  const [clinicalFindings, setClinicalFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [referralDecision, setReferralDecision] = useState<ReferralDecision>('None');
  const [referralNotes, setReferralNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [saved, setSaved] = useState(false);

  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([
    { medicineName: '', dosage: '', frequency: '', duration: '' }
  ]);

  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { medicineName: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removePrescriptionRow = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const updatePrescription = (idx: number, field: keyof PrescriptionRow, val: string) => {
    const updated = [...prescriptions];
    updated[idx][field] = val;
    setPrescriptions(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center animate-fade-in">
        <Stethoscope className="w-12 h-12 text-violet-300" />
        <p className="text-lg font-bold text-slate-700">Patient not found.</p>
        <button onClick={() => navigate('/doctor-patients')} className="text-sm text-violet-700 font-bold hover:underline">
          ← Back to Patient Queue
        </button>
      </div>
    );
  }

  const aiRiskScore =
    patient.riskLevel === 'Emergency' ? 92 :
    patient.riskLevel === 'Red' ? 78 :
    patient.riskLevel === 'Yellow' ? 45 : 18;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/doctor-patients/${patient.id}`)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Patient Profile
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-violet-600" />
            New Consultation — {patient.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            By {user.name} · {user.facility} · {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
        </div>
        {isEmergency && (
          <div className="bg-rose-100 border border-rose-300 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-bold text-rose-800">
            <Siren className="w-4 h-4 animate-pulse" />
            Emergency Escalation Active
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* 1. Patient Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">1</span>
            Patient Information
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{patient.name}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</p>
              <p className="font-bold text-slate-900 mt-0.5">{patient.age}y · {patient.gender}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Patient ID</p>
              <p className="font-mono font-bold text-teal-700 mt-0.5">{patient.id}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Risk Level</p>
              <StatusBadge type="risk" status={patient.riskLevel} />
            </div>
          </div>
        </div>

        {/* 2. Symptoms */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">2</span>
            Reported Symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {patient.knownConditions.map((c) => (
              <span key={c} className="bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full">{c}</span>
            ))}
            {patient.isPregnant && (
              <span className="bg-pink-50 text-pink-800 border border-pink-200 text-xs font-semibold px-2.5 py-1 rounded-full">Pregnant · {patient.pregnancyWeeks} weeks</span>
            )}
          </div>
        </div>

        {/* 3. Vitals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">3</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
            Latest Vitals
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { label: 'BP', value: patient.latestVitals.bp },
              { label: 'Heart Rate', value: `${patient.latestVitals.heartRate} bpm` },
              { label: 'SpO₂', value: `${patient.latestVitals.spO2}%` },
              { label: 'Temperature', value: patient.latestVitals.temp },
              { label: 'Blood Sugar', value: patient.latestVitals.bloodSugar ? `${patient.latestVitals.bloodSugar} mg/dL` : 'N/A' },
            ].map((v) => (
              <div key={v.label} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{v.label}</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{v.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">Recorded by {patient.latestVitals.recordedBy} at {patient.latestVitals.recordedAt}</p>
        </div>

        {/* 4. Medical History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">4</span>
            Medical History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Known Conditions</p>
              {patient.knownConditions.map((c) => <p key={c} className="text-slate-700 font-semibold">{c}</p>)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Allergies</p>
              {patient.allergies.map((a) => <p key={a} className={`font-semibold ${a === 'None' ? 'text-slate-500' : 'text-rose-700'}`}>{a}</p>)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Medicines</p>
              {patient.currentMedicines.map((m) => <p key={m} className="text-emerald-700 font-semibold">{m}</p>)}
            </div>
          </div>
        </div>

        {/* 5. AI Risk Summary */}
        <div className="bg-violet-50 rounded-2xl border border-violet-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">5</span>
            <Brain className="w-4 h-4 text-violet-600" />
            AI-Assisted Risk Summary
          </h2>
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-violet-200">
            <div className="text-3xl font-extrabold text-violet-700">{aiRiskScore}</div>
            <div>
              <p className="text-xs font-bold text-violet-900">Risk Score / 100</p>
              <StatusBadge type="risk" status={patient.riskLevel} />
            </div>
            <p className="text-xs text-slate-600 flex-1">
              {patient.riskReason ?? 'No specific risk reason recorded.'}
            </p>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 font-medium">
              This AI score is a <strong>clinical decision support tool only</strong>. It does not constitute a medical diagnosis. All clinical decisions must be made by the attending doctor.
            </p>
          </div>
        </div>

        {/* 6. Doctor Clinical Assessment */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">6</span>
            <Stethoscope className="w-4 h-4 text-violet-600" />
            Doctor Clinical Assessment
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinical Findings</label>
            <textarea
              value={clinicalFindings}
              onChange={(e) => setClinicalFindings(e.target.value)}
              placeholder="Describe clinical findings, examination results, and relevant observations..."
              rows={3}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Diagnosis / Clinical Assessment</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter your clinical diagnosis and assessment..."
              rows={2}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 7. Prescription */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">7</span>
              <Pill className="w-4 h-4 text-emerald-600" />
              Prescription
            </h2>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </div>
          <div className="space-y-2">
            {prescriptions.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={row.medicineName}
                  onChange={(e) => updatePrescription(idx, 'medicineName', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-violet-500 focus:outline-none col-span-2 sm:col-span-1"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={row.dosage}
                  onChange={(e) => updatePrescription(idx, 'dosage', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={row.frequency}
                  onChange={(e) => updatePrescription(idx, 'frequency', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={row.duration}
                    onChange={(e) => updatePrescription(idx, 'duration', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                  />
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrescriptionRow(idx)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Treatment Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">8</span>
            <ClipboardList className="w-4 h-4 text-teal-600" />
            Treatment Plan
          </h2>
          <textarea
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder="Describe the complete treatment plan, dietary advice, lifestyle modifications, investigations ordered..."
            rows={3}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
          />
        </div>

        {/* 9. Referral Recommendation */}
        {patientReferral && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">9</span>
              <Share2 className="w-4 h-4 text-indigo-600" />
              Referral Recommendation
            </h2>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">Existing Referral: {patientReferral.id}</p>
              <p className="text-slate-600">{patientReferral.reason}</p>
              <p className="text-slate-500">Urgency: <strong>{patientReferral.urgency}</strong> · To: {patientReferral.destinationFacility}</p>
            </div>
            <div className="flex gap-2">
              {(['Accept', 'Modify', 'Reject', 'None'] as ReferralDecision[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setReferralDecision(d)}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    referralDecision === d
                      ? d === 'Accept' ? 'bg-emerald-600 text-white border-emerald-600'
                        : d === 'Reject' ? 'bg-rose-600 text-white border-rose-600'
                        : d === 'Modify' ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-600 text-white border-slate-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {d === 'None' ? 'No Change' : d}
                </button>
              ))}
            </div>
            {referralDecision !== 'None' && (
              <textarea
                value={referralNotes}
                onChange={(e) => setReferralNotes(e.target.value)}
                placeholder={`Add notes for referral ${referralDecision.toLowerCase()} decision...`}
                rows={2}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
              />
            )}
          </div>
        )}

        {/* 10. Follow-up Date */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center">10</span>
            <Clock className="w-4 h-4 text-amber-600" />
            Follow-up Date
          </h2>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none w-full sm:w-64"
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="submit"
              className="py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
              {saved ? 'Consultation Saved!' : 'Save Consultation'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/referrals/create')}
              className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Create Referral
            </button>

            <button
              type="button"
              onClick={() => navigate('/follow-ups')}
              className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Clock className="w-4 h-4" />
              Schedule Follow-up
            </button>

            <button
              type="button"
              onClick={() => setIsEmergency(!isEmergency)}
              className={`py-3 px-4 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                isEmergency
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
              }`}
            >
              <Siren className={`w-4 h-4 ${isEmergency ? 'animate-pulse' : ''}`} />
              {isEmergency ? 'Cancel Emergency' : 'Emergency Escalation'}
            </button>
          </div>

          {saved && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Consultation record saved successfully for {patient.name}. Record is now part of the patient's medical history.
            </div>
          )}

          {isEmergency && (
            <div className="mt-3 bg-rose-50 border-2 border-rose-300 p-3 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
              <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
              Emergency escalation activated. Duty team and higher officials will be notified immediately. 108 Ambulance coordination initiated.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
