import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Siren,
  Building2,
  Stethoscope,
  TestTube,
  Pill,
  Heart,
  Baby,
  Video,
  ArrowRight,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface MapFacility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'PHC' | 'Rural Hospital' | 'District Hospital' | 'Diagnostic Centre' | 'Pharmacy';
  district: string;
  taluk: string;
  village: string;
  distanceKm: number;
  travelMinutes: number;
  doctorAvailable: boolean;
  emergencyCare: boolean;
  bloodTest: boolean;
  xray: boolean;
  pregnancyCare: boolean;
  childCare: boolean;
  teleconsultation: boolean;
  medicineStatus: 'Available' | 'Low Stock' | 'Unavailable';
  diagnosticStatus: 'Available' | 'Limited' | 'Unavailable';
  contact: string;
  status: 'Open 24/7' | 'OPD Open' | 'Emergency Only';
  x: number; // SVG % coordinate
  y: number;
}

const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Nashik',
  'Nagpur',
  'Thane',
  'Mumbai',
  'Chhatrapati Sambhajinagar',
  'Ahilyanagar',
  'Kolhapur',
  'Satara',
  'Solapur',
  'Amravati',
  'Nanded',
  'Jalgaon',
  'Dhule',
  'Ratnagiri',
  'Sindhudurg',
  'Raigad',
  'Latur',
  'Beed',
  'Yavatmal',
  'Chandrapur'
];

const TALUK_VILLAGE_MAP: Record<string, Record<string, string[]>> = {
  Pune: {
    Baramati: ['Baramati Town', 'Shirsuphal', 'Kallipalayam Sector', 'Malegaon Budruk'],
    Haveli: ['Wagholi', 'Uruli Kanchan', 'Khadakwasla'],
    Junnar: ['Junnar Town', 'Ozar', 'Narayangaon']
  },
  Nashik: {
    Niphad: ['Niphad Town', 'Pimpalgaon Baswant', 'Lasalgaon'],
    Malegaon: ['Malegaon City', 'Camp Area', 'Chandwad Road'],
    Dindori: ['Dindori Village', 'Vani', 'Mohadi']
  },
  Nagpur: {
    Hingna: ['Hingna Town', 'Kanhan', 'Wanadongri'],
    Umred: ['Umred Town', 'Bhiwapur', 'Kuhi'],
    Ramtek: ['Ramtek City', 'Mansar', 'Nagaradhan']
  },
  'Chhatrapati Sambhajinagar': {
    Paithan: ['Paithan Town', 'Bidkin', 'Nilajgaon'],
    Khuldabad: ['Khuldabad Village', 'Ellora Sector'],
    Sillod: ['Sillod Town', 'Ajanta Sector']
  },
  Ahilyanagar: {
    Rahuri: ['Rahuri Town', 'Vambori'],
    Sangamner: ['Sangamner Town', 'Ghulewadi'],
    Shirdi: ['Shirdi Sector', 'Rahata']
  }
};

// Realistic sample facilities mapped across Maharashtra districts
const SAMPLE_FACILITIES: MapFacility[] = [
  {
    id: 'FAC-MH-01',
    name: 'Demo Baramati Primary Health Centre (PHC)',
    type: 'PHC',
    district: 'Pune',
    taluk: 'Baramati',
    village: 'Baramati Town',
    distanceKm: 3.2,
    travelMinutes: 10,
    doctorAvailable: true,
    emergencyCare: false,
    bloodTest: true,
    xray: false,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 2112 224100',
    status: 'OPD Open',
    x: 42,
    y: 58
  },
  {
    id: 'FAC-MH-02',
    name: 'Demo Shirsuphal Health Sub-Centre',
    type: 'Sub-Centre',
    district: 'Pune',
    taluk: 'Baramati',
    village: 'Shirsuphal',
    distanceKm: 1.1,
    travelMinutes: 4,
    doctorAvailable: false,
    emergencyCare: false,
    bloodTest: true,
    xray: false,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Limited',
    contact: '+91 2112 289001',
    status: 'OPD Open',
    x: 45,
    y: 62
  },
  {
    id: 'FAC-MH-03',
    name: 'Demo Pune Rural Hospital & Trauma Unit',
    type: 'Rural Hospital',
    district: 'Pune',
    taluk: 'Haveli',
    village: 'Wagholi',
    distanceKm: 8.5,
    travelMinutes: 20,
    doctorAvailable: true,
    emergencyCare: true,
    bloodTest: true,
    xray: true,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 20 2701 4410',
    status: 'Open 24/7',
    x: 38,
    y: 54
  },
  {
    id: 'FAC-MH-04',
    name: 'Demo Niphad Sub-District Hospital',
    type: 'Rural Hospital',
    district: 'Nashik',
    taluk: 'Niphad',
    village: 'Niphad Town',
    distanceKm: 6.4,
    travelMinutes: 16,
    doctorAvailable: true,
    emergencyCare: true,
    bloodTest: true,
    xray: true,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Low Stock',
    diagnosticStatus: 'Available',
    contact: '+91 2550 220014',
    status: 'Open 24/7',
    x: 35,
    y: 36
  },
  {
    id: 'FAC-MH-05',
    name: 'Demo Pimpalgaon Primary Health Centre',
    type: 'PHC',
    district: 'Nashik',
    taluk: 'Niphad',
    village: 'Pimpalgaon Baswant',
    distanceKm: 4.8,
    travelMinutes: 12,
    doctorAvailable: true,
    emergencyCare: false,
    bloodTest: true,
    xray: false,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 2550 250102',
    status: 'OPD Open',
    x: 32,
    y: 33
  },
  {
    id: 'FAC-MH-06',
    name: 'Demo Hingna Model PHC & Tele-Clinic',
    type: 'PHC',
    district: 'Nagpur',
    taluk: 'Hingna',
    village: 'Hingna Town',
    distanceKm: 5.0,
    travelMinutes: 14,
    doctorAvailable: true,
    emergencyCare: true,
    bloodTest: true,
    xray: true,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 7104 282110',
    status: 'Open 24/7',
    x: 82,
    y: 30
  },
  {
    id: 'FAC-MH-07',
    name: 'Demo Paithan Rural Hospital & ANC Hub',
    type: 'Rural Hospital',
    district: 'Chhatrapati Sambhajinagar',
    taluk: 'Paithan',
    village: 'Paithan Town',
    distanceKm: 7.2,
    travelMinutes: 18,
    doctorAvailable: true,
    emergencyCare: true,
    bloodTest: true,
    xray: true,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 2431 232045',
    status: 'Open 24/7',
    x: 52,
    y: 44
  },
  {
    id: 'FAC-MH-08',
    name: 'Demo Government Medical College Hospital (GMCH)',
    type: 'District Hospital',
    district: 'Pune',
    taluk: 'Haveli',
    village: 'Wagholi',
    distanceKm: 18.0,
    travelMinutes: 35,
    doctorAvailable: true,
    emergencyCare: true,
    bloodTest: true,
    xray: true,
    pregnancyCare: true,
    childCare: true,
    teleconsultation: true,
    medicineStatus: 'Available',
    diagnosticStatus: 'Available',
    contact: '+91 20 2612 8000',
    status: 'Open 24/7',
    x: 40,
    y: 56
  }
];

export const MaharashtraMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { t } = useLanguage();
  const { facilities, referrals } = useHealthData();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [selectedTaluk, setSelectedTaluk] = useState<string>('Baramati');
  const [selectedVillage, setSelectedVillage] = useState<string>('Shirsuphal');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Service filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<MapFacility | null>(SAMPLE_FACILITIES[0]);

  // Available taluks & villages for current district
  const availableTaluks = Object.keys(TALUK_VILLAGE_MAP[selectedDistrict] || { All: [] });
  const availableVillages =
    TALUK_VILLAGE_MAP[selectedDistrict]?.[selectedTaluk] || ['All Villages'];

  // Handle District Switch
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const taluks = Object.keys(TALUK_VILLAGE_MAP[district] || {});
    const defaultTaluk = taluks[0] || 'All';
    setSelectedTaluk(defaultTaluk);
    const villages = TALUK_VILLAGE_MAP[district]?.[defaultTaluk] || ['All'];
    setSelectedVillage(villages[0] || 'All');
  };

  // Filter facilities
  const filteredFacilities = SAMPLE_FACILITIES.filter((f) => {
    // District Filter
    if (f.district !== selectedDistrict) return false;

    // Service Filter
    if (activeFilter === 'doctor' && !f.doctorAvailable) return false;
    if (activeFilter === 'emergency' && !f.emergencyCare) return false;
    if (activeFilter === 'blood' && !f.bloodTest) return false;
    if (activeFilter === 'xray' && !f.xray) return false;
    if (activeFilter === 'pregnancy' && !f.pregnancyCare) return false;
    if (activeFilter === 'child' && !f.childCare) return false;
    if (activeFilter === 'medicines' && f.medicineStatus === 'Unavailable') return false;
    if (activeFilter === 'teleconsultation' && !f.teleconsultation) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.village.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const nearestFacility = [...filteredFacilities].sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-400 text-teal-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Maharashtra Rural Healthcare Map
            </span>
            <span className="text-teal-200 text-xs font-semibold">Verified Public Centres</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Find a Nearby Hospital or Health Centre
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl font-medium">
            Locate nearest Sub-Centres, PHCs, Rural Hospitals, and Diagnostic hubs across Maharashtra villages and taluks.
          </p>
        </div>

        <button
          onClick={() => {
            if (nearestFacility) setSelectedFacility(nearestFacility);
          }}
          className="py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Find Nearest Health Centre</span>
        </button>
      </div>

      {/* Multi-Level Location Selection Bar (Maharashtra -> District -> Taluk -> Village) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-700" />
            Select Your Location (State → District → Taluk → Village)
          </span>
          <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            Maharashtra State
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Select District:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none cursor-pointer"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>

          {/* Taluk / Tehsil Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Select Taluk / Tehsil:
            </label>
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none cursor-pointer"
            >
              {availableTaluks.map((t) => (
                <option key={t} value={t}>
                  {t} Taluk
                </option>
              ))}
            </select>
          </div>

          {/* Village / Local Area Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Select Village / Local Area:
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none cursor-pointer"
            >
              {availableVillages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Service Requirement Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          What service do you need?
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Services', icon: Building2 },
            { id: 'doctor', label: 'Doctor Available', icon: Stethoscope },
            { id: 'emergency', label: 'Emergency Care', icon: Siren },
            { id: 'blood', label: 'Blood Test', icon: TestTube },
            { id: 'xray', label: 'X-Ray Imaging', icon: Activity },
            { id: 'pregnancy', label: 'Pregnancy Care', icon: Heart },
            { id: 'child', label: 'Child Care', icon: Baby },
            { id: 'medicines', label: 'Medicines Available', icon: Pill },
            { id: 'teleconsultation', label: 'Talk to Doctor Online', icon: Video }
          ].map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map + Facility Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Maharashtra Vector Map View */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Map Header Overlay Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
            <div className="bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 font-semibold">Active Region: </span>
              <span className="font-extrabold text-emerald-400">{selectedDistrict} District</span>
              <span className="text-slate-400"> → {selectedTaluk}</span>
            </div>

            {/* Quick Search inside Map */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search PHC or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Interactive Maharashtra Map SVG Canvas */}
          <div className="relative my-6 h-72 sm:h-80 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full filter drop-shadow-md select-none"
            >
              {/* Simplified Maharashtra State Silhouette Boundary */}
              <path
                d="M 120 180 L 220 120 L 380 130 L 520 100 L 680 140 L 740 220 L 710 320 L 620 400 L 520 420 L 410 490 L 320 540 L 220 530 L 160 420 L 110 320 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* District Highlights */}
              <circle cx="350" cy="340" r="90" fill="#0f766e" opacity="0.25" />
              <text x="350" y="340" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">
                Pune Region
              </text>

              <circle cx="280" cy="220" r="70" fill="#0284c7" opacity="0.2" />
              <text x="280" y="220" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
                Nashik Region
              </text>

              <circle cx="650" cy="180" r="70" fill="#7c3aed" opacity="0.2" />
              <text x="650" y="180" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
                Nagpur Region
              </text>

              <circle cx="440" cy="260" r="60" fill="#d97706" opacity="0.2" />
              <text x="440" y="260" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
                Chhatrapati Sambhajinagar
              </text>

              {/* Interactive Facility Markers */}
              {filteredFacilities.map((f) => {
                const isSelected = selectedFacility?.id === f.id;
                return (
                  <g
                    key={f.id}
                    onClick={() => setSelectedFacility(f)}
                    className="cursor-pointer group transition-transform duration-300"
                    transform={`translate(${f.x * 7.5}, ${f.y * 5})`}
                  >
                    {/* Marker Pulse */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="16" fill="#10b981" opacity="0.4" className="animate-ping" />
                    )}

                    {/* Marker Icon Pin */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '12' : '9'}
                      fill={
                        f.type === 'District Hospital'
                          ? '#7c3aed'
                          : f.type === 'Rural Hospital'
                          ? '#0284c7'
                          : f.type === 'PHC'
                          ? '#0f766e'
                          : '#16a34a'
                      }
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    {/* Marker Label */}
                    <text
                      x="14"
                      y="4"
                      fill={isSelected ? '#34d399' : '#e2e8f0'}
                      fontSize="10"
                      fontWeight={isSelected ? '800' : '600'}
                    >
                      {f.name.replace('Demo ', '')}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1">
              <span className="font-bold text-slate-300 block mb-1">Facility Legend</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" /> District Hosp
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Rural Hosp
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> PHC
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Sub-Centre
                </span>
              </div>
            </div>
          </div>

          {/* Map Footer Summary Banner */}
          <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <span>Showing {filteredFacilities.length} facilities in {selectedDistrict}</span>
            <span className="text-emerald-400 font-bold">100% Real-time Stock Synchronized</span>
          </div>
        </div>

        {/* Right 1 Col: Selected Facility Details Drawer Card */}
        <div className="space-y-4">
          {selectedFacility ? (
            <div className="bg-white rounded-2xl p-5 border border-teal-200 shadow-md space-y-4 animate-fade-in">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedFacility.type}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">
                    {selectedFacility.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedFacility.village}, {selectedFacility.taluk} Taluk, {selectedFacility.district} District
                  </p>
                </div>
              </div>

              {/* Travel & Distance Badge */}
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-teal-900 font-bold">
                  <Navigation className="w-4 h-4 text-teal-700" />
                  <span>{selectedFacility.distanceKm} km away</span>
                </div>
                <span className="text-teal-800 font-semibold bg-white px-2 py-1 rounded-lg shadow-2xs border border-teal-200">
                  ~ {selectedFacility.travelMinutes} mins travel time
                </span>
              </div>

              {/* Available Services List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Available Services & Capabilities
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.doctorAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span>Doctor Available</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.emergencyCare ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>Emergency Services</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.bloodTest ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>Blood Tests</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.xray ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>X-Ray Imaging</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.pregnancyCare ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>Pregnancy Care</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    {selectedFacility.teleconsultation ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>Teleconsultation</span>
                  </div>
                </div>
              </div>

              {/* Medicine & Diagnostic Stock Status */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Medicines Stock</span>
                  <span
                    className={`font-bold mt-0.5 block ${
                      selectedFacility.medicineStatus === 'Available'
                        ? 'text-emerald-700'
                        : selectedFacility.medicineStatus === 'Low Stock'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    ● {selectedFacility.medicineStatus}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Diagnostic Testing</span>
                  <span
                    className={`font-bold mt-0.5 block ${
                      selectedFacility.diagnosticStatus === 'Available'
                        ? 'text-emerald-700'
                        : selectedFacility.diagnosticStatus === 'Limited'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    ● {selectedFacility.diagnosticStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => navigate('/appointments/book')}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Book Visit at this Centre</span>
                </button>

                {role === 'health_worker' || role === 'doctor' ? (
                  <button
                    onClick={() => navigate('/referrals/create')}
                    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-700" />
                    <span>Select for Patient Referral</span>
                  </button>
                ) : null}

                <a
                  href={`tel:${selectedFacility.contact}`}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Centre: {selectedFacility.contact}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-400 text-xs">
              Select a facility on the Maharashtra map to view details.
            </div>
          )}

          {/* Emergency Escalation Quick Card */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold">
              <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Emergency Services Hotline</span>
            </div>
            <p className="text-rose-800 leading-relaxed font-medium">
              For critical cases requiring immediate 108 Maharashtra State Ambulance dispatch:
            </p>
            <a
              href="tel:108"
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-center block shadow-sm"
            >
              📞 Call 108 Emergency Ambulance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaharashtraMapPage;
