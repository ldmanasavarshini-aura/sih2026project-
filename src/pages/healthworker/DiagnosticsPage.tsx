import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../context/HealthDataContext';
import {
  TestTube,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  FileText,
  CalendarCheck,
  Activity
} from 'lucide-react';

const DIAGNOSTIC_SERVICES = [
  { id: 'DS-01', name: 'Complete Blood Count (CBC) & Hb', category: 'Laboratory', status: 'Available', facility: 'Neelambur PHC Lab', waitTime: '15 mins', cost: 'Free (NHM)' },
  { id: 'DS-02', name: 'Fasting Blood Sugar & HbA1c', category: 'Biochemistry', status: 'Available', facility: 'Neelambur PHC Lab', waitTime: '10 mins', cost: 'Free (NHM)' },
  { id: 'DS-03', name: 'Urine Albumin & Sugar Test', category: 'Urinalysis', status: 'Available', facility: 'Kallipalayam Sub-Centre', waitTime: '5 mins', cost: 'Free (NHM)' },
  { id: 'DS-04', name: '12-Lead Electrocardiogram (ECG)', category: 'Cardiology', status: 'Limited', facility: 'Annur Government Hospital', waitTime: '30 mins', cost: 'Free (NHM)' },
  { id: 'DS-05', name: 'Obstetric Doppler Ultrasound Scan', category: 'Radiology', status: 'Available', facility: 'Coimbatore Medical College Hospital', waitTime: '45 mins', cost: 'Free (NHM)' },
  { id: 'DS-06', name: 'Digital Chest X-Ray', category: 'Radiology', status: 'Limited', facility: 'Annur Government Hospital', waitTime: '25 mins', cost: 'Free (NHM)' }
];

export const DiagnosticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { testResults, patients } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? '');
  const [selectedTest, setSelectedTest] = useState(DIAGNOSTIC_SERVICES[0].name);
  const [booked, setBooked] = useState(false);

  const filteredTests = testResults.filter((t) =>
    t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
            Diagnostic Coordination Platform
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Diagnostic &amp; Lab Coordination
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Check facility diagnostic availability, order lab investigations, and view patient test results.
          </p>
        </div>
      </div>

      {/* Booking Form + Facility Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Book Diagnostic Test Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-600" /> Order Lab / Imaging Test
          </h2>

          <form onSubmit={handleBookDiagnostic} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) — {p.village}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diagnostic Test / Investigation</label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700"
              >
                {DIAGNOSTIC_SERVICES.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.facility})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Diagnostic Session
            </button>

            {booked && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Test booked successfully! Queue token and instructions sent to patient.
              </div>
            )}
          </form>
        </div>

        {/* Facility Diagnostic Availability */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" /> Real-time Diagnostic Equipment &amp; Test Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIAGNOSTIC_SERVICES.map((ds) => (
              <div key={ds.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900">{ds.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ds.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    🟢 {ds.status}
                  </span>
                </div>
                <p className="text-slate-600">{ds.facility} · {ds.category}</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Est. Wait: <strong>{ds.waitTime}</strong></span>
                  <span className="text-emerald-700 font-bold">{ds.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnostic Results History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TestTube className="w-4 h-4 text-teal-700" />
            Diagnostic Reports &amp; Investigation Results
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by test, patient or facility..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTests.map((test) => (
            <div key={test.id} className="p-4 hover:bg-slate-50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{test.testName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    test.isAbnormal ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {test.isAbnormal ? '⚠️ Abnormal Result' : '✓ Normal'}
                  </span>
                </div>
                <p className="text-slate-600">Patient: <strong>{test.patientName}</strong> ({test.patientId})</p>
                <p className="text-slate-700 font-medium">{test.resultSummary}</p>
                <p className="text-[10px] text-slate-400">Facility: {test.facility} · Order Date: {test.orderDate} · Result Date: {test.resultDate}</p>
              </div>

              <button
                onClick={() => navigate(`/patients/${test.patientId}`)}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[11px] shrink-0"
              >
                View Patient Record
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
