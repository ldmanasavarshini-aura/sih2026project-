import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  AlertOctagon,
  Search,
  Filter
} from 'lucide-react';

export const QueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, appointments } = useHealthData();
  const [filterFacility, setFilterFacility] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate real-time queue items combining appointments & priority patients
  const queueItems = appointments.map((appt, idx) => {
    const patient = patients.find((p) => p.id === appt.patientId) || {
      id: appt.patientId,
      name: appt.patientName,
      age: 30,
      riskLevel: 'Yellow' as const,
      latestVitals: { bp: '120/80', temp: '98.6°F', heartRate: 72, spO2: 98 }
    };

    return {
      token: appt.queueToken || `A-0${idx + 12}`,
      patientId: appt.patientId,
      patientName: appt.patientName,
      timeSlot: appt.timeSlot,
      facility: appt.facility,
      doctorName: appt.doctorName,
      riskLevel: patient.riskLevel,
      status: appt.status,
      waitTimeMinutes: appt.estimatedWaitMinutes || 15,
    };
  });

  const filteredQueue = queueItems.filter((q) => {
    const matchesFacility = filterFacility === 'All' || q.facility === filterFacility;
    const matchesSearch = q.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.token.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFacility && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
            Real-time OPD Queue Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Today's OPD Patient Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Live token status, clinical risk priority, estimated wait times, and consultation dispatch.
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Facility:</span>
          <select
            value={filterFacility}
            onChange={(e) => setFilterFacility(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-teal-700"
          >
            <option value="All">All Facilities</option>
            <option value="Neelambur PHC">Neelambur PHC</option>
            <option value="Kallipalayam Sub-Centre">Kallipalayam Sub-Centre</option>
            <option value="Coimbatore Medical College Hospital">Coimbatore Medical College Hospital</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by token, patient name..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            Live Queue Tokens
          </h2>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {filteredQueue.length} Active Patients in Line
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredQueue.map((item) => (
            <div key={item.token} className="p-4 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0 font-mono">
                  {item.token}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.patientName}</span>
                    <StatusBadge type="risk" status={item.riskLevel} />
                  </div>
                  <p className="text-slate-600 mt-0.5">{item.facility} · Doctor: {item.doctorName}</p>
                  <p className="text-slate-400 text-[10px]">Appt Time: {item.timeSlot} · Queue token: {item.token}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Wait Time</span>
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> {item.waitTimeMinutes} mins
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/consultation/${item.patientId}`)}
                    className="py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Call Consultation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
