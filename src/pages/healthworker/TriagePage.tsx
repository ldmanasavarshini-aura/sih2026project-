import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Stethoscope,
  AlertTriangle,
  AlertOctagon,
  Siren,
  CheckCircle2,
  Phone,
  Calendar,
  Share2,
  Save,
  ArrowRight,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { RiskLevel } from '../../types';

export const TriagePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, addTriage } = useHealthData();

  const [selectedPatientId, setSelectedPatientId] = useState('SS-PT-10021');
  const [step, setStep] = useState<number>(1);

  // Symptoms & Danger signs state
  const [symptoms, setSymptoms] = useState<string[]>(['High Blood Pressure (BP >= 140/90)', 'Headache / Dizziness']);
  const [dangerSigns, setDangerSigns] = useState<string[]>(['Severe Headache']);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [isPregnant, setIsPregnant] = useState<boolean>(true);

  // Vitals
  const [bp, setBp] = useState('150/95');
  const [temp, setTemp] = useState('98.4°F');
  const [heartRate, setHeartRate] = useState(88);
  const [spO2, setSpO2] = useState(98);
  const [bloodSugar, setBloodSugar] = useState(110);

  const [calculatedRisk, setCalculatedRisk] = useState<RiskLevel>('Red');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSymptomToggle = (sym: string) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const handleDangerToggle = (ds: string) => {
    let newDS;
    if (dangerSigns.includes(ds)) {
      newDS = dangerSigns.filter((d) => d !== ds);
    } else {
      newDS = [...dangerSigns, ds];
    }
    setDangerSigns(newDS);

    // Dynamic risk calculation
    if (newDS.includes('Chest Pain Radiating to Arm') || newDS.includes('Severe Shortness of Breath')) {
      setCalculatedRisk('Emergency');
    } else if (newDS.length > 0 || symptoms.some((s) => s.includes('140/90') || s.includes('Fever > 102'))) {
      setCalculatedRisk('Red');
    } else if (symptoms.length > 0) {
      setCalculatedRisk('Yellow');
    } else {
      setCalculatedRisk('Green');
    }
  };

  const handleSaveTriage = () => {
    let recAction = 'Routine Care';
    let recFacility = 'Kallipalayam Sub-Centre';

    if (calculatedRisk === 'Emergency') {
      recAction = 'IMMEDIATE 108 Emergency Ambulance Escalation';
      recFacility = 'Coimbatore Medical College Hospital (CCU)';
    } else if (calculatedRisk === 'Red') {
      recAction = 'Urgent Specialist Referral within 24 Hours';
      recFacility = 'Coimbatore Medical College Hospital';
    } else if (calculatedRisk === 'Yellow') {
      recAction = 'PHC Doctor Consultation within 48 Hours';
      recFacility = 'Neelambur PHC';
    }

    addTriage(
      {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        village: selectedPatient.village,
        symptoms,
        dangerSigns,
        durationDays,
        isPregnant,
        vitals: {
          bp,
          temp,
          heartRate,
          spO2,
          bloodSugar,
          recordedAt: new Date().toLocaleString(),
          recordedBy: user.name
        },
        calculatedRisk,
        recommendedAction: recAction,
        recommendedFacility: recFacility
      },
      user.name
    );

    setStep(3); // Result view
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Banner & Mandatory Medical Disclaimer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Smart Symptom Triage & Danger Sign Calculator</h1>
            <p className="text-xs text-slate-500">Frontline clinical decision assistance algorithm</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Medical Safety Disclaimer:</p>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              This digital screening tool supports frontline decision-making and does not replace qualified medical diagnosis by a registered medical practitioner.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Selection Header */}
      {step < 3 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Patient for Triage</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.village} ({p.riskLevel} Risk)
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-500 text-[11px]">
            Selected: <strong className="text-slate-900">{selectedPatient.name}</strong> (Age {selectedPatient.age})
          </div>
        </div>
      )}

      {/* STEP 1: SYMPTOMS & DANGER SIGNS CHECKLIST */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Danger Signs & Symptom Checklist
          </h2>

          {/* Emergency Danger Signs */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-700 uppercase flex items-center gap-1.5">
              <Siren className="w-4 h-4 text-rose-600" /> High-Risk Emergency Danger Signs (Check all that apply)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Severe Headache / Blurred Vision',
                'Chest Pain Radiating to Arm / Jaw',
                'Severe Shortness of Breath (SpO2 < 94%)',
                'Vaginal Bleeding in Pregnancy',
                'High Fever (> 102°F) with Convulsions',
                'Loss of Consciousness / Confusion'
              ].map((ds) => (
                <label
                  key={ds}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer font-medium transition-all ${
                    dangerSigns.includes(ds)
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dangerSigns.includes(ds)}
                    onChange={() => handleDangerToggle(ds)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>{ds}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Routine & Moderate Symptoms */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase">
              General Clinical Symptoms
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'High Blood Pressure (BP >= 140/90)',
                'Persistent Cough (> 2 weeks)',
                'Frequent Urination / Excessive Thirst',
                'Mild Fever / Body Pain',
                'Pedal Edema (Swelling in Feet)'
              ].map((sym) => (
                <label
                  key={sym}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer font-medium transition-all ${
                    symptoms.includes(sym)
                      ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={symptoms.includes(sym)}
                    onChange={() => handleSymptomToggle(sym)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span>{sym}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <span>Proceed to Vitals Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VITALS INPUT & RISK CALCULATOR */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Record Vitals & Review Calculated Risk Score
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blood Pressure (mmHg)</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
              <input
                type="number"
                value={spO2}
                onChange={(e) => setSpO2(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Temperature (°F)</label>
              <input
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Calculated Triage Result Preview */}
          <div className="p-4 rounded-2xl border bg-slate-50 space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Calculated Risk Result</span>
            <div className="flex items-center gap-3">
              <StatusBadge type="risk" status={calculatedRisk} />
              <span className="text-xs font-bold text-slate-800">
                {calculatedRisk === 'Green'
                  ? 'Routine Care at Sub-Centre'
                  : calculatedRisk === 'Yellow'
                  ? 'Consultation within 24–48 Hours'
                  : calculatedRisk === 'Red'
                  ? 'Urgent Referral to Tertiary Hospital'
                  : 'IMMEDIATE Escalation to Emergency Room'}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-4 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSaveTriage}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Screening & Action Triage</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FINAL ACTION RECOMMENDATION */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Screening Result Saved</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Triage Recommendation Ready</h2>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 max-w-md mx-auto text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-900">{selectedPatient.name} ({selectedPatient.id})</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Calculated Risk:</span>
              <StatusBadge type="risk" status={calculatedRisk} />
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Recommended Action:</span>
              <strong className="text-teal-900">
                {calculatedRisk === 'Emergency'
                  ? 'Immediate CCU Escalation'
                  : calculatedRisk === 'Red'
                  ? 'Urgent Referral to CMCH'
                  : 'PHC Consultation'}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Target Facility:</span>
              <strong className="text-slate-900">Coimbatore Medical College Hospital</strong>
            </div>
          </div>

          {/* Follow-up Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/referrals/create')}
              className="py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Create Referral Now</span>
            </button>

            <button
              onClick={() => navigate('/appointments/book')}
              className="py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Hospital OPD Slot</span>
            </button>

            {calculatedRisk === 'Emergency' && (
              <a
                href="tel:108"
                className="py-3 px-5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md animate-pulse"
              >
                <Phone className="w-4 h-4" />
                <span>Call 108 Emergency</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
