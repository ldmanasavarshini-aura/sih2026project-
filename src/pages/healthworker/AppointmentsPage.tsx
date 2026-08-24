import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import {
  Calendar,
  Clock,
  Plus,
  QrCode,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, bookAppointment, updateAppointmentStatus, patients, facilities } = useHealthData();

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<any | null>(null);

  const [bookForm, setBookForm] = useState({
    patientId: 'SS-PT-10021',
    facility: 'Coimbatore Medical College Hospital',
    specialty: 'High-Risk Obstetrics / ANC Clinic',
    doctorName: 'Dr. S. Rajalakshmi',
    date: '2026-08-26',
    timeSlot: '10:30 AM - 11:00 AM',
    instructions: 'Fast for 8 hours if blood sugar check is ordered. Carry ANC passport.'
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === bookForm.patientId) || patients[0];
    const newApt = bookAppointment(
      {
        patientId: selPatient.id,
        patientName: selPatient.name,
        patientPhone: selPatient.phone,
        facility: bookForm.facility,
        specialty: bookForm.specialty,
        doctorName: bookForm.doctorName,
        date: bookForm.date,
        timeSlot: bookForm.timeSlot,
        instructions: bookForm.instructions
      },
      user.name
    );
    setShowBookModal(false);
    setSelectedQR(newApt);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Hospital & PHC Appointment Booking</h1>
            <p className="text-xs text-slate-500">Manage queue tokens & specialty doctor slots</p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book OPD Appointment</span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-500 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  Token: {apt.queueToken}
                </span>
                <span className="text-xs font-bold text-slate-900">{apt.patientName}</span>
                <span className="text-[11px] text-slate-400 font-mono">({apt.patientId})</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">{apt.specialty} — {apt.facility}</p>
              <p className="text-xs text-slate-500">
                Doctor: {apt.doctorName} • Date: {apt.date} ({apt.timeSlot})
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge type="appointment" status={apt.status} />

              <button
                onClick={() => setSelectedQR(apt)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                title="View QR Token"
              >
                <QrCode className="w-4 h-4" />
              </button>

              {apt.status === 'Booked' && (
                <button
                  onClick={() => updateAppointmentStatus(apt.id, 'Cancelled', 'Patient requested reschedule')}
                  className="py-1.5 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-[11px]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOOK MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleBookSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowBookModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Book Hospital OPD Appointment</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={bookForm.patientId}
                  onChange={(e) => setBookForm({ ...bookForm, patientId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility</label>
                <select
                  value={bookForm.facility}
                  onChange={(e) => setBookForm({ ...bookForm, facility: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty Clinic</label>
                <input
                  type="text"
                  value={bookForm.specialty}
                  onChange={(e) => setBookForm({ ...bookForm, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={bookForm.doctorName}
                  onChange={(e) => setBookForm({ ...bookForm, doctorName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookForm.date}
                  onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={bookForm.timeSlot}
                  onChange={(e) => setBookForm({ ...bookForm, timeSlot: e.target.value })}
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
                Confirm Appointment Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedQR && (
        <QRCodeModal
          isOpen={!!selectedQR}
          onClose={() => setSelectedQR(null)}
          title={`Queue Token: ${selectedQR.queueToken}`}
          subtitle={selectedQR.facility}
          qrValue={`APT-${selectedQR.id}`}
          details={[
            { label: 'Patient Name', value: selectedQR.patientName },
            { label: 'Token', value: selectedQR.queueToken },
            { label: 'Doctor', value: selectedQR.doctorName },
            { label: 'Date & Slot', value: `${selectedQR.date} (${selectedQR.timeSlot})` }
          ]}
        />
      )}
    </div>
  );
};
