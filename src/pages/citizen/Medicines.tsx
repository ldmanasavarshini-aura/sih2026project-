import React from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Pill,
  Building2,
  Calendar,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const CitizenMedicines: React.FC = () => {
  const { medicines, patients } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const patientMeds = medicines.filter((m) => m.patientId === patient.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Prescribed Medicines & Stock</h1>
            <p className="text-xs text-slate-500">Government hospital & sub-centre medicine availability tracker</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {patientMeds.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No active prescriptions.
          </div>
        ) : (
          patientMeds.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{med.medicineName}</h3>
                  <p className="text-xs text-slate-600 font-medium">{med.dosage} • {med.frequency}</p>
                </div>
                <StatusBadge type="stock" status={med.facilityStockStatus} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Duration & Refill</span>
                  <p className="font-bold text-slate-900 mt-0.5">{med.duration}</p>
                  <p className="text-[11px] text-teal-800 font-semibold">Refill Due: {med.refillDueDate}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Prescribed By</span>
                  <p className="font-bold text-slate-900 mt-0.5">{med.prescribedBy}</p>
                  <p className="text-[11px] text-slate-500">Date: {med.prescribedDate}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nearest Available Facility</span>
                  <p className="font-bold text-teal-900 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>{med.nearestAvailableFacility}</span>
                  </p>
                </div>
              </div>

              {med.facilityStockStatus === 'Low Stock' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Stock is low at PHC. Please collect your refill before {med.refillDueDate}.
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Health Worker Contact Footer Banner */}
      <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
        <div>
          <p className="font-bold text-teal-900 text-sm">Need help with medicine refills or stock?</p>
          <p className="text-teal-800">Contact your assigned ASHA worker for alternative sub-centre collection points.</p>
        </div>
        <a
          href="tel:+919842188321"
          className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Call ASHA Worker</span>
        </a>
      </div>
    </div>
  );
};
