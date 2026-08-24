import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Edit,
  Baby,
  Heart,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

export const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useHealthData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredPatients = patients.filter((p) => {
    // Search matching
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.abhaId && p.abhaId.includes(searchQuery)) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter matching
    if (selectedFilter === 'high_risk') return p.riskLevel === 'Red' || p.riskLevel === 'Emergency';
    if (selectedFilter === 'pregnant') return p.isPregnant;
    if (selectedFilter === 'child_care') return p.age <= 5;
    if (selectedFilter === 'chronic') return p.knownConditions.some((c) => c.includes('Diabetes') || c.includes('Hypertension'));
    if (selectedFilter === 'follow_up') return p.nextActionDue.length > 0;

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in relative pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Village Patient Registry</h1>
            <p className="text-xs text-slate-500">Manage sector healthcare records & risk monitoring</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/register-patient')}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by Name, Phone, Patient ID (SS-PT-...), ABHA ID, or Village..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {[
            { id: 'all', label: `All (${patients.length})` },
            { id: 'high_risk', label: 'High Risk' },
            { id: 'pregnant', label: 'Pregnant (ANC)' },
            { id: 'child_care', label: 'Child Care (0-5y)' },
            { id: 'chronic', label: 'Chronic Care (NCD)' },
            { id: 'follow_up', label: 'Follow-up Due' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setSelectedFilter(flt.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedFilter === flt.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List Grid */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No patients match search query or filter.
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => navigate(`/patients/${patient.id}`)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    {patient.id}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{patient.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">({patient.age}y, {patient.gender})</span>
                </div>
                <StatusBadge type="risk" status={patient.riskLevel} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Village Sector</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{patient.village}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Latest BP & Vitals</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {patient.latestVitals.bp} mmHg
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Next Care Action Due</span>
                  <p className="font-bold text-emerald-800 mt-0.5 truncate">{patient.nextActionDue}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Last Updated Audit Note</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    By {patient.lastUpdatedBy} ({patient.lastUpdatedAt})
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Register Button for Mobile */}
      <button
        onClick={() => navigate('/register-patient')}
        className="sm:hidden fixed bottom-18 right-4 bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-30 hover:bg-emerald-700 flex items-center justify-center"
      >
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
};
