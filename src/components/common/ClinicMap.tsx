import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Locate } from 'lucide-react';

export interface Clinic {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  medicinesAvailable: string[] | boolean;
  testsAvailable: string[] | boolean;
  status: 'operational' | 'understaffed' | 'critical';
  medAlerts: string;
  location?: string;
}

interface ClinicMapProps {
  width?: string;
  height?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

export const ClinicMap: React.FC<ClinicMapProps> = ({
  width = '100%',
  height = '450px',
  defaultCenter = { lat: 19.40, lng: 73.20 }, // Thane region center
  defaultZoom = 10
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const getMockClinics = (): Clinic[] => [
    {
      name: 'Wada PHC',
      location: 'Wada, Palghar District',
      latitude: 19.6548,
      longitude: 73.1378,
      medicinesAvailable: ['Paracetamol', 'Iron-Folic Acid', 'ORS'],
      testsAvailable: ['Malaria', 'Pregnancy', 'Hemoglobin'],
      status: 'operational',
      medAlerts: 'Normal'
    },
    {
      name: 'Bhiwandi PHC',
      location: 'Bhiwandi, Thane District',
      latitude: 19.2952,
      longitude: 73.0482,
      medicinesAvailable: ['Paracetamol', 'ORS'],
      testsAvailable: ['Malaria', 'Pregnancy', 'Hemoglobin'],
      status: 'understaffed',
      medAlerts: 'Metformin, Amlodipine Out'
    },
    {
      name: 'Murbad PHC',
      location: 'Murbad, Thane District',
      latitude: 19.2612,
      longitude: 73.3980,
      medicinesAvailable: ['Paracetamol', 'Metformin', 'ORS'],
      testsAvailable: ['Malaria', 'Pregnancy', 'Blood Sugar'],
      status: 'operational',
      medAlerts: 'Normal'
    },
    {
      name: 'Shahpur PHC',
      location: 'Shahpur, Thane District',
      latitude: 19.4526,
      longitude: 73.3278,
      medicinesAvailable: ['Paracetamol', 'ORS'],
      testsAvailable: ['Malaria', 'Pregnancy'],
      status: 'critical',
      medAlerts: 'Iron-Folic Acid Out'
    },
    {
      name: 'Titwala PHC',
      location: 'Titwala, Thane District',
      latitude: 19.3005,
      longitude: 73.2081,
      medicinesAvailable: ['Paracetamol'],
      testsAvailable: ['Pregnancy'],
      status: 'critical',
      medAlerts: 'ORS & Antimalarial Out'
    },
    {
      name: 'Asangaon PHC',
      location: 'Asangaon, Thane District',
      latitude: 19.4394,
      longitude: 73.2982,
      medicinesAvailable: ['Paracetamol', 'Amoxicillin', 'ORS'],
      testsAvailable: ['Malaria', 'Pregnancy', 'Hemoglobin'],
      status: 'operational',
      medAlerts: 'Normal'
    }
  ];

  const [clinics, setClinics] = useState<Clinic[]>(getMockClinics());

  // Load clinics from Firestore in the background
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicsCol = collection(db, 'Clinics');
        const snap = await getDocs(clinicsCol);
        if (!snap.empty) {
          const fetched = snap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              latitude: Number(data.latitude),
              longitude: Number(data.longitude),
              medicinesAvailable: data.medicinesAvailable ?? [],
              testsAvailable: data.testsAvailable ?? [],
              status: data.status ?? 'operational',
              medAlerts: data.medAlerts ?? 'Normal',
              location: data.location ?? ''
            };
          }) as Clinic[];

          // Merge fetched clinics with mock ones
          const mockThane = getMockClinics();
          const merged = [...fetched];
          mockThane.forEach(mock => {
            if (!merged.some(r => r.name.toLowerCase().includes(mock.name.toLowerCase().split(' ')[0]))) {
              merged.push(mock);
            }
          });
          setClinics(merged);
        }
      } catch (err) {
        console.warn('Firestore fetch failed, relying on mock clinic data:', err);
      }
    };
    fetchClinics();
  }, []);

  // Initialize and Render Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create Map Instance (Google Maps Voyager style tiles)
    const map = L.map(mapRef.current, {
      zoomControl: false, // Use our custom styled overlays instead
      scrollWheelZoom: true,
      attributionControl: true
    }).setView([defaultCenter.lat, defaultCenter.lng], defaultZoom);

    mapInstanceRef.current = map;

    // Google Maps-like Voyager Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Custom colored SVG pin markers
    const getMarkerIcon = (status: 'operational' | 'understaffed' | 'critical') => {
      const color = status === 'critical' ? '#EF4444' : status === 'understaffed' ? '#F59E0B' : '#10B981';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="34" height="34"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
      return L.divIcon({
        html: svg,
        className: 'custom-map-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });
    };

    // Add Markers to Map
    clinics.forEach((clinic) => {
      const lat = Number(clinic.latitude);
      const lng = Number(clinic.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const status = clinic.status || 'operational';
      const marker = L.marker([lat, lng], {
        icon: getMarkerIcon(status)
      }).addTo(map);

      // Detail formatting
      const medsContent = Array.isArray(clinic.medicinesAvailable)
        ? clinic.medicinesAvailable.join(', ')
        : typeof clinic.medicinesAvailable === 'string'
        ? clinic.medicinesAvailable
        : clinic.medicinesAvailable
        ? 'Available'
        : 'Out of stock';

      const testsContent = Array.isArray(clinic.testsAvailable)
        ? clinic.testsAvailable.join(', ')
        : typeof clinic.testsAvailable === 'string'
        ? clinic.testsAvailable
        : clinic.testsAvailable
        ? 'Available'
        : 'Out of stock';

      const statusLabel = status === 'critical' 
        ? 'Critical Stock Alert' 
        : status === 'understaffed' 
        ? 'Understaffed' 
        : 'Operational';

      const statusColor = status === 'critical' 
        ? '#EF4444' 
        : status === 'understaffed' 
        ? '#F59E0B' 
        : '#10B981';

      const statusBadgeBg = status === 'critical' 
        ? '#FEE2E2' 
        : status === 'understaffed' 
        ? '#FEF3C7' 
        : '#D1FAE5';

      // Distance mock calculator
      const distance = clinic.name.includes('Wada') ? '14.2 km' 
                     : clinic.name.includes('Bhiwandi') ? '8.5 km' 
                     : clinic.name.includes('Murbad') ? '22.1 km' 
                     : clinic.name.includes('Shahpur') ? '19.8 km' 
                     : clinic.name.includes('Titwala') ? '12.0 km' 
                     : '17.5 km';

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; padding: 12px; width: 260px; line-height: 1.5; color: #1e293b;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; gap: 8px;">
            <div>
              <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${clinic.name}</h4>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 500;">${clinic.location || 'Thane Region'}</p>
            </div>
            <span style="font-size: 10px; font-weight: 700; color: ${statusColor}; background-color: ${statusBadgeBg}; padding: 3px 8px; border-radius: 9999px; white-space: nowrap;">
              ${statusLabel}
            </span>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 8px; margin-top: 8px; display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 11px;">
            <div>
              <span style="font-weight: 700; color: #94a3b8; text-transform: uppercase; font-size: 8.5px; display: block; letter-spacing: 0.05em;">Staffing Availability</span>
              <span style="color: #334155; font-weight: 500;">${status === 'understaffed' ? 'Doctors: 1, Nurses: 2 (Understaffed)' : 'Doctors: 2, Nurses: 4 (Optimal)'}</span>
            </div>
            
            <div>
              <span style="font-weight: 700; color: #94a3b8; text-transform: uppercase; font-size: 8.5px; display: block; letter-spacing: 0.05em;">Medicines Status</span>
              <span style="color: ${status === 'critical' ? '#ef4444' : '#334155'}; font-weight: 600;">${medsContent}</span>
            </div>

            <div>
              <span style="font-weight: 700; color: #94a3b8; text-transform: uppercase; font-size: 8.5px; display: block; letter-spacing: 0.05em;">Diagnostic Tests</span>
              <span style="color: #334155; font-weight: 500;">${testsContent}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 4px; padding-top: 6px; border-top: 1px dashed #e2e8f0; font-size: 10px; color: #64748b; font-weight: 600;">
              <span>📍 Distance: ${distance}</span>
              <span>⚡ Active</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        maxWidth: 300
      });
    });

    // Cleanup Leaflet Map on Unmount
    return () => {
      map.remove();
    };
  }, [clinics, defaultCenter, defaultZoom]);

  // Zoom Button Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Recenter Map Handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([defaultCenter.lat, defaultCenter.lng], defaultZoom);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50" style={{ width, height }}>
      {/* Map Element */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Google Maps-Style Control Overlays */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        {/* Recenter Location Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
          title="Recenter Map"
        >
          <Locate size={18} />
        </button>

        {/* Zoom Control Group */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center active:bg-slate-100 border-b border-slate-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center active:bg-slate-100 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
