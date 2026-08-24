import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  Share2,
  Building2,
  FileText,
  Ambulance,
  QrCode,
  Phone,
  CheckCircle2,
  Siren,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ReferralStatus } from '../../types';

export const CitizenReferrals: React.FC = () => {
  const { referrals, patients } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const patientReferrals = referrals.filter((r) => r.patientId === patient.id);

  const [selectedQRReferral, setSelectedQRReferral] = useState<any | null>(null);

  const stages: ReferralStatus[] = [
    'Created',
    'Sent',
    'Accepted',
    'Facility Visit',
    'Consultation Complete',
    'Follow-up'
  ];

  const getStageIndex = (status: ReferralStatus) => {
    return stages.indexOf(status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Clinical Referral Tracker</h1>
            <p className="text-xs text-slate-500">6-Stage public healthcare transfer & consultation pipeline</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {patientReferrals.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No active or past referrals recorded.
          </div>
        ) : (
          patientReferrals.map((ref) => {
            const currentIdx = getStageIndex(ref.status);
            const isEmergency = ref.urgency === 'Emergency';

            return (
              <div
                key={ref.id}
                className={`bg-white rounded-2xl p-6 border-2 shadow-md space-y-5 relative ${
                  isEmergency ? 'border-red-600 bg-red-50/20' : 'border-teal-600'
                }`}
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                        {ref.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ref.urgency === 'Emergency'
                            ? 'bg-red-600 text-white animate-pulse'
                            : ref.urgency === 'Urgent'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ref.urgency} Priority
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {ref.sourceFacility} → {ref.destinationFacility}
                    </h3>
                  </div>
                  <StatusBadge type="referral" status={ref.status} />
                </div>

                {/* 6-Stage Progress Tracker Bar */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <p className="text-[11px] font-bold text-slate-500 uppercase mb-3">
                    Care Continuity Pipeline (Stage {currentIdx + 1} of 6)
                  </p>

                  <div className="flex items-center justify-between min-w-[500px]">
                    {stages.map((st, idx) => {
                      const isDone = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <React.Fragment key={st}>
                          <div className="flex flex-col items-center text-center max-w-[80px]">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCurrent
                                  ? 'bg-teal-700 text-white ring-4 ring-teal-100 scale-110 shadow-sm'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-semibold leading-tight ${
                                isCurrent ? 'text-teal-900 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {st}
                            </span>
                          </div>

                          {idx < stages.length - 1 && (
                            <div
                              className={`flex-1 h-1 mx-1 rounded-full ${
                                idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Clinical Reason & Vitals Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Reason for Clinical Transfer</span>
                    <p className="font-bold text-slate-900">{ref.reason}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ref.clinicalNotes}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Vitals at Time of Referral</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-800 pt-1 font-semibold">
                      <span>BP: <strong className="text-rose-700">{ref.vitals.bp}</strong></span>
                      <span>Heart Rate: <strong>{ref.vitals.heartRate} bpm</strong></span>
                      <span>SpO2: <strong>{ref.vitals.spO2}%</strong></span>
                      <span>Temp: <strong>{ref.vitals.temp}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Emergency Guidance Banner */}
                {isEmergency && (
                  <div className="bg-red-600 text-white p-4 rounded-xl flex items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <Siren className="w-6 h-6 text-white animate-pulse shrink-0" />
                      <div>
                        <p className="font-extrabold text-sm">Emergency Cardiac/Obstetric Referral</p>
                        <p className="text-xs text-red-100">Reach nearest tertiary emergency room immediately.</p>
                      </div>
                    </div>
                    <a
                      href="tel:108"
                      className="py-2 px-4 bg-white text-red-700 font-extrabold rounded-lg text-xs hover:bg-red-50 flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call 108</span>
                    </a>
                  </div>
                )}

                {/* Attached Documents & QR Token Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Attached Docs: {ref.documentsAttached.join(', ')}</span>
                  </div>

                  <button
                    onClick={() => setSelectedQRReferral(ref)}
                    className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Show Referral Pass QR Token</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Referral QR Token Modal */}
      {selectedQRReferral && (
        <QRCodeModal
          isOpen={!!selectedQRReferral}
          onClose={() => setSelectedQRReferral(null)}
          title={`Referral Pass: ${selectedQRReferral.id}`}
          subtitle={`Destination: ${selectedQRReferral.destinationFacility}`}
          qrValue={selectedQRReferral.qrCodeToken}
          details={[
            { label: 'Patient Name', value: selectedQRReferral.patientName },
            { label: 'Patient ID', value: selectedQRReferral.patientId },
            { label: 'Urgency Priority', value: selectedQRReferral.urgency },
            { label: 'Source Centre', value: selectedQRReferral.sourceFacility },
            { label: 'Destination Hospital', value: selectedQRReferral.destinationFacility },
            { label: 'Referring Worker', value: selectedQRReferral.referringWorker }
          ]}
        />
      )}
    </div>
  );
};
