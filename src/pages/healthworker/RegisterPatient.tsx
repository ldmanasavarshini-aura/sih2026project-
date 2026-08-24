import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  WifiOff,
  RefreshCw
} from 'lucide-react';

export const RegisterPatient: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPatient, isOnline } = useHealthData();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    village: 'Kallipalayam',
    address: '',
    bloodGroup: 'O Positive',
    emergencyContact: '',
    abhaId: '',
    consentGiven: true,
    isPregnant: false,
    pregnancyWeeks: '',
    knownConditions: '',
    allergies: '',
    currentMedicines: '',
    facility: 'Kallipalayam Sub-Centre'
  });

  const [error, setError] = useState<string | null>(null);
  const [createdPatient, setCreatedPatient] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name.trim() || !formData.age || !formData.phone.trim()) {
        setError('Please complete Patient Name, Age, and Mobile Phone number.');
        return;
      }
    }
    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleSubmit = (saveMode: 'sync' | 'offline') => {
    const newPatient = addPatient(
      {
        name: formData.name,
        age: Number(formData.age) || 25,
        gender: formData.gender as any,
        phone: formData.phone,
        village: formData.village,
        address: formData.address || 'Village Main Street',
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact || 'Family Contact',
        abhaId: formData.abhaId || undefined,
        consentGiven: formData.consentGiven,
        isPregnant: formData.isPregnant,
        pregnancyWeeks: formData.isPregnant ? Number(formData.pregnancyWeeks) || 12 : undefined,
        knownConditions: formData.knownConditions ? formData.knownConditions.split(',').map((s) => s.trim()) : [],
        allergies: formData.allergies ? formData.allergies.split(',').map((s) => s.trim()) : ['None'],
        currentMedicines: formData.currentMedicines ? formData.currentMedicines.split(',').map((s) => s.trim()) : [],
        facility: formData.facility,
        riskLevel: formData.isPregnant ? 'Yellow' : 'Green',
        riskReason: formData.isPregnant ? 'Pregnancy ANC Registration' : 'New Registration'
      },
      user.name
    );

    setCreatedPatient(newPatient);
    setStep(5); // Success step
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">New Patient Registration</h1>
            <p className="text-xs text-slate-500">Multi-step rural digital health enrollment form</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <span>Step {step} of 4</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: BASIC DETAILS */}
      {step === 1 && (
        <form onSubmit={handleNext} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Basic Personal & Demographic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Full Patient Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lakshmi Devi"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Age (Years) *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 28"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Village Sector *</label>
              <select
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Kallipalayam">Kallipalayam</option>
                <option value="Neelambur">Neelambur</option>
                <option value="Annur">Annur</option>
                <option value="Coimbatore Rural">Coimbatore Rural</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Street Address & Landmark</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Door 14, Main Street, near Post Office"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <span>Continue to Identity & Consent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: IDENTITY & CONSENT */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Government ABHA ID & Patient Consent
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ABHA Digital Health ID (Optional)</label>
              <input
                type="text"
                value={formData.abhaId}
                onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                placeholder="e.g. 91-4829-1029-4412"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">If unassigned, a new ABHA placeholder will be generated.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Caregiver Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="e.g. Ramanan (Husband) +91 98765 43211"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consentCheck"
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="consentCheck" className="font-bold text-emerald-900 text-xs cursor-pointer">
                Patient Data Privacy & Referral Share Consent (Mandatory)
              </label>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed pl-6">
              Patient explicitly authorizes health workers and public facilities (Neelambur PHC & CMCH) to store and share clinical records under the Ayushman Bharat Digital Mission (ABDM).
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <span>Continue to Health Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: HEALTH SUMMARY */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Medical History & Pregnancy Status
          </h2>

          <div className="space-y-4 text-xs">
            {/* Pregnancy Check */}
            {formData.gender === 'Female' && (
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pregCheck"
                    checked={formData.isPregnant}
                    onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <label htmlFor="pregCheck" className="font-bold text-teal-900 text-xs cursor-pointer">
                    Is the patient currently pregnant? (ANC Registration)
                  </label>
                </div>

                {formData.isPregnant && (
                  <div className="pl-6 pt-2">
                    <label className="block font-bold text-teal-900 mb-1">Gestational Age (Weeks)</label>
                    <input
                      type="number"
                      value={formData.pregnancyWeeks}
                      onChange={(e) => setFormData({ ...formData, pregnancyWeeks: e.target.value })}
                      placeholder="e.g. 24"
                      className="w-40 p-2 bg-white border border-teal-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Known Chronic Conditions (Comma separated)</label>
              <input
                type="text"
                value={formData.knownConditions}
                onChange={(e) => setFormData({ ...formData, knownConditions: e.target.value })}
                placeholder="e.g. Type 2 Diabetes, Hypertension"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Known Drug Allergies</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Sulfa drugs (or leave empty)"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <span>Review Registration Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            4. Review Patient Details Before Saving
          </h2>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{formData.name}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Age / Gender:</span> <strong>{formData.age}y • {formData.gender}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Mobile:</span> <strong>{formData.phone}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Village:</span> <strong>{formData.village}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">ABHA ID:</span> <strong className="font-mono text-teal-800">{formData.abhaId || 'Generated on Submit'}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Pregnancy ANC:</span> <strong>{formData.isPregnant ? `${formData.pregnancyWeeks} Weeks` : 'No'}</strong></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleSubmit('offline')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
            >
              <WifiOff className="w-4 h-4 text-slate-600" />
              <span>Save Offline (Local Buffer)</span>
            </button>

            <button
              onClick={() => handleSubmit('sync')}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Sync Immediately</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS PAGE WITH QR CODE */}
      {step === 5 && createdPatient && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">Patient Successfully Registered!</h2>
          <p className="text-xs text-slate-500">
            Assigned Patient ID: <strong className="font-mono text-teal-800 text-base">{createdPatient.id}</strong>
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1">
            <p className="font-bold text-slate-900">{createdPatient.name}</p>
            <p className="text-slate-500">{createdPatient.village} • Mobile: {createdPatient.phone}</p>
            <p className="text-teal-800 font-mono font-bold mt-1">ABHA: {createdPatient.abhaId}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => setShowQR(true)}
              className="py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-teal-200"
            >
              <QrCode className="w-4 h-4 text-teal-700" />
              <span>Generate Patient QR Token</span>
            </button>

            <button
              onClick={() => navigate(`/patients/${createdPatient.id}`)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>View Full Patient Detail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <QRCodeModal
            isOpen={showQR}
            onClose={() => setShowQR(false)}
            title={`Registered Token: ${createdPatient.id}`}
            subtitle={createdPatient.name}
            qrValue={createdPatient.id}
            details={[
              { label: 'Patient ID', value: createdPatient.id },
              { label: 'Name', value: createdPatient.name },
              { label: 'Village', value: createdPatient.village },
              { label: 'ABHA ID', value: createdPatient.abhaId }
            ]}
          />
        </div>
      )}
    </div>
  );
};
