import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Phone,
  AlertCircle,
  CheckCircle2,
  Building2,
  Lock
} from 'lucide-react';

export const CitizenAppointments: React.FC = () => {
  const { appointments, patients } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  const [selectedQRAppointment, setSelectedQRAppointment] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const upcoming = patientAppointments.filter((a) => a.status === 'Booked');
  const past = patientAppointments.filter((a) => a.status !== 'Booked');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">My Appointments & Queue</h1>
            <p className="text-xs text-slate-500">Live facility OPD booking token & waiting status</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Upcoming Scheduled Visits ({upcoming.length})
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No upcoming appointments scheduled.
          </div>
        ) : (
          upcoming.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-6 border-2 border-teal-600/70 shadow-md space-y-4 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full uppercase">
                    {apt.specialty}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{apt.facility}</h3>
                </div>
                <StatusBadge type="appointment" status={apt.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Date & Slot</span>
                    <p className="font-bold text-slate-900">{apt.date}</p>
                    <p className="text-[11px] text-slate-500">{apt.timeSlot}</p>
                  </div>
                </div>

                <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal-800 shrink-0" />
                  <div>
                    <span className="text-[10px] text-teal-800 font-bold uppercase">Queue Token</span>
                    <p className="font-extrabold text-teal-900 text-lg font-mono leading-none mt-0.5">
                      {apt.queueToken}
                    </p>
                    <p className="text-[10px] text-teal-700">Est. Wait: {apt.estimatedWaitMinutes} mins</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Location & Doctor</span>
                    <p className="font-bold text-slate-900">{apt.doctorName}</p>
                    <p className="text-[11px] text-slate-500">{apt.locationDetails}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 text-amber-800 mb-0.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Preparation Instructions:</span>
                </p>
                <p className="text-amber-800">{apt.instructions}</p>
              </div>

              {/* Action Buttons: Show QR Token & Contact Worker */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setSelectedQRAppointment(apt)}
                  className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show OPD Check-in QR Token</span>
                </button>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Unable to Attend? Contact Health Worker</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment History */}
      {past.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Past Appointment History ({past.length})
          </h2>
          <div className="space-y-2">
            {past.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{p.specialty} — {p.facility}</p>
                  <p className="text-slate-500 text-[11px]">Date: {p.date} • Token: {p.queueToken}</p>
                </div>
                <StatusBadge type="appointment" status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQRAppointment && (
        <QRCodeModal
          isOpen={!!selectedQRAppointment}
          onClose={() => setSelectedQRAppointment(null)}
          title={`OPD Queue Check-in: ${selectedQRAppointment.queueToken}`}
          subtitle={selectedQRAppointment.facility}
          qrValue={`APT-${selectedQRAppointment.id}-${selectedQRAppointment.queueToken}`}
          details={[
            { label: 'Patient Name', value: selectedQRAppointment.patientName },
            { label: 'Specialty Clinic', value: selectedQRAppointment.specialty },
            { label: 'Doctor', value: selectedQRAppointment.doctorName },
            { label: 'Appointment Date', value: selectedQRAppointment.date },
            { label: 'Time Slot', value: selectedQRAppointment.timeSlot },
            { label: 'OPD Location', value: selectedQRAppointment.locationDetails }
          ]}
        />
      )}

      {/* Contact Health Worker Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Phone className="w-5 h-5 text-teal-700" />
              <span>Contact Health Worker for Rescheduling</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient accounts have view-only access. Direct appointment rescheduling must be processed by your assigned health worker to maintain facility queue balance.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned ASHA Worker:</span>
                <span className="font-bold text-slate-900">Meena R</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ASHA Phone Number:</span>
                <span className="font-bold text-teal-800 font-mono">+91 98421 88321</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facility:</span>
                <span className="font-bold text-slate-900">Neelambur PHC / Sub-Centre</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="tel:+919842188321"
                className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call ASHA Worker</span>
              </a>
              <button
                onClick={() => setShowContactModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
