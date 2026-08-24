import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  Share2,
  Plus,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Siren,
  FileText,
  X
} from 'lucide-react';
import { ReferralStatus } from '../../types';

export const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const { referrals, createReferral, updateReferralStatus, patients, facilities } = useHealthData();

  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<any | null>(null);

  const [refForm, setRefForm] = useState({
    patientId: 'SS-PT-10021',
    reason: 'Gestational Hypertension (BP 150/95 mmHg) requiring tertiary Doppler Ultrasound.',
    urgency: 'Urgent' as 'Routine' | 'Urgent' | 'Emergency',
    sourceFacility: 'Kallipalayam Sub-Centre',
    destinationFacility: 'Coimbatore Medical College Hospital',
    clinicalNotes: 'Patient complains of mild frontal headache. Fetal heart sound normal (142 bpm).',
    transportRequired: true
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === refForm.patientId) || patients[0];
    const newRef = createReferral(
      {
        patientId: selPatient.id,
        patientName: selPatient.name,
        patientPhone: selPatient.phone,
        patientVillage: selPatient.village,
        patientAge: selPatient.age,
        reason: refForm.reason,
        urgency: refForm.urgency,
        sourceFacility: refForm.sourceFacility,
        destinationFacility: refForm.destinationFacility,
        clinicalNotes: refForm.clinicalNotes,
        transportRequired: refForm.transportRequired
      },
      user.name
    );
    setShowCreateModal(false);
    setSelectedQR(newRef);
  };

  const filteredReferrals = referrals.filter((r) => {
    if (activeSubTab === 'all') return true;
    return r.subState.toLowerCase() === activeSubTab.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Clinical Referral Management</h1>
            <p className="text-xs text-slate-500">6-Stage referral pipeline tracking & hospital transfer passes</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Referral</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex gap-2 overflow-x-auto text-xs font-bold">
        {['all', 'Sent', 'Accepted', 'Awaiting Visit', 'Completed', 'Delayed'].map((st) => (
          <button
            key={st}
            onClick={() => setActiveSubTab(st)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              activeSubTab === st
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Referral Cards */}
      <div className="space-y-4">
        {filteredReferrals.map((ref) => (
          <div
            key={ref.id}
            className={`bg-white rounded-2xl p-5 border-2 shadow-xs space-y-3 ${
              ref.urgency === 'Emergency' ? 'border-red-600 bg-red-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  {ref.id}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">{ref.patientName}</span>
                <span className="text-xs text-slate-400">({ref.patientVillage})</span>
              </div>
              <StatusBadge type="referral" status={ref.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Route Transfer</span>
                <p className="font-bold text-slate-900 mt-0.5">{ref.sourceFacility} → {ref.destinationFacility}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Clinical Reason</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{ref.reason}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Vitals Logged</span>
                <p className="font-bold text-slate-900 mt-0.5">BP: {ref.vitals.bp} • HR: {ref.vitals.heartRate} bpm</p>
              </div>
            </div>

            {/* Stage Progression Action Controls for Health Workers */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedQR(ref)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-teal-700" />
                  <span>QR Pass Token</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {ref.status === 'Sent' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'Accepted')}
                    className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs"
                  >
                    Mark Accepted by Facility
                  </button>
                )}

                {ref.status === 'Accepted' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'Facility Visit')}
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                  >
                    Confirm Patient Arrived at Facility
                  </button>
                )}

                {ref.status === 'Facility Visit' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'Follow-up', 'Consultation done, medication prescribed.')}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    Mark Consultation & Referral Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE REFERRAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleCreateSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Create Clinical Referral Pass</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={refForm.patientId}
                  onChange={(e) => setRefForm({ ...refForm, patientId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id}) — {p.village}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Urgency Priority Level</label>
                <select
                  value={refForm.urgency}
                  onChange={(e) => setRefForm({ ...refForm, urgency: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="Routine">Routine Transfer</option>
                  <option value="Urgent">Urgent (Within 24 Hours)</option>
                  <option value="Emergency">EMERGENCY (Immediate 108)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Facility</label>
                <select
                  value={refForm.destinationFacility}
                  onChange={(e) => setRefForm({ ...refForm, destinationFacility: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Transfer Reason</label>
                <textarea
                  rows={2}
                  value={refForm.reason}
                  onChange={(e) => setRefForm({ ...refForm, reason: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Notes & Vitals Summary</label>
                <textarea
                  rows={2}
                  value={refForm.clinicalNotes}
                  onChange={(e) => setRefForm({ ...refForm, clinicalNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Issue Referral & Generate QR Pass
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedQR && (
        <QRCodeModal
          isOpen={!!selectedQR}
          onClose={() => setSelectedQR(null)}
          title={`Referral Pass: ${selectedQR.id}`}
          subtitle={`Destination: ${selectedQR.destinationFacility}`}
          qrValue={selectedQR.qrCodeToken}
          details={[
            { label: 'Patient Name', value: selectedQR.patientName },
            { label: 'Priority', value: selectedQR.urgency },
            { label: 'Referring Worker', value: selectedQR.referringWorker }
          ]}
        />
      )}
    </div>
  );
};
