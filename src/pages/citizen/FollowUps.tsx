import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Clock,
  UserCheck,
  Calendar,
  FileText,
  Phone,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export const CitizenFollowUps: React.FC = () => {
  const { followUps, patients } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const patientFollowUps = followUps.filter((f) => f.patientId === patient.id);

  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Home Care & Follow-Up Tasks</h1>
            <p className="text-xs text-slate-500">ASHA health worker home visits and maternal care monitoring</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {patientFollowUps.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No follow-up tasks assigned.
          </div>
        ) : (
          patientFollowUps.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{task.id}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{task.purpose}</h3>
                </div>
                <StatusBadge type="followup" status={task.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Scheduled Due Date</span>
                  <p className="font-extrabold text-teal-900 text-sm mt-0.5">{task.dueDate}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Health Worker</span>
                  <p className="font-bold text-slate-900 mt-0.5">{task.assignedWorker}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Visit Status</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {task.status === 'Completed' ? 'Home Visit Done' : 'Worker Visit Pending'}
                  </p>
                </div>
              </div>

              {/* Read-Only Visit Notes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Health Worker Clinical Note</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{task.previousNote}</p>
                {task.visitOutcomeNotes && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-emerald-800 font-semibold">
                    Completed Visit Outcome: {task.visitOutcomeNotes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowContactModal(true)}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-200 transition-all"
        >
          <Phone className="w-4 h-4 text-teal-700" />
          <span>Need Help? Contact Assigned ASHA Worker</span>
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Contact ASHA Health Worker</h3>
            <p className="text-xs text-slate-500 mb-4">
              Connect directly with Meena R for visit timing or urgent pregnancy support.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Worker Name:</span>
                <span className="font-bold text-slate-900">Meena R (ASHA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-teal-800 font-mono">+91 98421 88321</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sector:</span>
                <span className="font-bold text-slate-900">Kallipalayam Village</span>
              </div>
            </div>

            <a
              href="tel:+919842188321"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 98421 88321</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
