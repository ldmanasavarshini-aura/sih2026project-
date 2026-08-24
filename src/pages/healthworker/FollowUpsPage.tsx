import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Clock,
  CheckCircle2,
  Phone,
  AlertOctagon,
  X,
  Filter,
  Check
} from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const { user } = useAuth();
  const { followUps, completeFollowUp, rescheduleFollowUp } = useHealthData();

  const [activeTab, setActiveTab] = useState<string>('due_today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');

  const filteredTasks = followUps.filter((task) => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    if (activeTab === 'due_today') return task.status === 'Pending';
    if (activeTab === 'overdue') return task.status === 'Overdue';
    if (activeTab === 'completed') return task.status === 'Completed';

    return true;
  });

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      completeFollowUp(selectedTask.id, outcomeNotes || 'Home visit completed. Vitals stable.', user.name);
      setSelectedTask(null);
      setOutcomeNotes('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Follow-Up Task Management</h1>
            <p className="text-xs text-slate-500">ASHA home visit tracking & maternal/child/chronic outcomes</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex gap-2 overflow-x-auto text-xs font-bold border-b border-slate-100 pb-2">
          {[
            { id: 'due_today', label: 'Due Today / Pending' },
            { id: 'overdue', label: 'Overdue Alerts' },
            { id: 'completed', label: 'Completed Visits' }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`px-3 py-2 rounded-xl transition-all shrink-0 ${
                activeTab === tb.id
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 shrink-0">Category:</span>
          {['all', 'Maternal Care', 'Child Care', 'Diabetes', 'Hypertension'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No follow-up tasks in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-5 border-2 shadow-xs space-y-3 ${
                task.riskLevel === 'Red' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {task.category}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">{task.patientName}</span>
                    <span className="text-xs text-slate-400">({task.village})</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs mt-1">{task.purpose}</h4>
                </div>
                <StatusBadge type="followup" status={task.status} />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Clinical Note</span>
                <p className="text-slate-700 mt-0.5">{task.previousNote}</p>
                {task.visitOutcomeNotes && (
                  <p className="text-emerald-800 font-bold mt-1 pt-1 border-t border-slate-200">
                    Recorded Outcome: {task.visitOutcomeNotes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                <a
                  href={`tel:${task.patientPhone}`}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>Call Patient ({task.patientPhone})</span>
                </a>

                {task.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setOutcomeNotes('');
                    }}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Home Visit</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMPLETE VISIT MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleCompleteSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">Record Home Visit Outcome</h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-900">{selectedTask.patientName}</strong> ({selectedTask.category})
            </p>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Visit Outcome Notes & Vitals Check</label>
              <textarea
                rows={3}
                value={outcomeNotes}
                onChange={(e) => setOutcomeNotes(e.target.value)}
                placeholder="e.g. Visited home. Patient took Labetalol on time. BP recorded 138/88. Reminded about CMCH appointment."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Save Outcome & Mark Completed
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
