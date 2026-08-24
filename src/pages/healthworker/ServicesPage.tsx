import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  Search,
  Pill,
  TestTube,
  Clock,
  MapPin,
  Calendar,
  Share2,
  Phone
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { facilities, stocks } = useHealthData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'facilities' | 'medicines' | 'diagnostics'>('facilities');

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.villageOrTaluk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const medicinesStock = stocks.filter((s) => s.type === 'Medicine');
  const diagnosticsStock = stocks.filter((s) => s.type === 'Diagnostic');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Facilities, Medicine & Diagnostics</h1>
            <p className="text-xs text-slate-500">Public health network stock availability & service capacities</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center gap-2 flex-col sm:flex-row">
          <div className="flex gap-2 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'facilities' ? 'bg-teal-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Public Facilities ({facilities.length})
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'medicines' ? 'bg-teal-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Essential Medicines ({medicinesStock.length})
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'diagnostics' ? 'bg-teal-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lab Diagnostics ({diagnosticsStock.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facility or drug..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((fac) => (
            <div key={fac.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase">
                    {fac.type}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{fac.name}</h3>
                  <p className="text-xs text-slate-500">{fac.villageOrTaluk}, {fac.district} • {fac.distanceKm} km away</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fac.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {fac.isOpen ? 'OPEN NOW' : 'CLOSED'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Doctors</span>
                  <p className="font-bold text-slate-900">{fac.doctorsAvailable} On Duty</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Est. Wait</span>
                  <p className="font-bold text-slate-900">{fac.avgWaitMinutes} mins</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Load</span>
                  <p className="font-bold text-teal-800">{fac.patientLoad}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available Specialties</span>
                <div className="flex flex-wrap gap-1">
                  {fac.specialties.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate('/appointments/book')}
                  className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Here
                </button>
                <button
                  onClick={() => navigate('/referrals/create')}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" /> Refer Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MEDICINES */}
      {activeTab === 'medicines' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Essential Medicines Availability Matrix</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {medicinesStock.map((stk) => (
              <div key={stk.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{stk.itemName}</p>
                  <p className="text-slate-500">{stk.facilityName} • Stock: {stk.quantityOnHand} {stk.unit}</p>
                </div>
                <StatusBadge type="stock" status={stk.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Diagnostic Service & Equipment Availability</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {diagnosticsStock.map((stk) => (
              <div key={stk.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{stk.itemName}</p>
                  <p className="text-slate-500">{stk.facilityName} • Available: {stk.quantityOnHand} {stk.unit}</p>
                </div>
                <StatusBadge type="stock" status={stk.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
