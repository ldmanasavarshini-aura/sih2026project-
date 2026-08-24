import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export interface Clinic {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  medicinesAvailable: string[] | boolean;
  testsAvailable: string[] | boolean;
}

interface ClinicMapProps {
  width?: string;
  height?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
  if ((window as any).google && (window as any).google.maps) {
    callback();
    return;
  }

  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    callback();
  };
  document.head.appendChild(script);
};

export const ClinicMap: React.FC<ClinicMapProps> = ({
  width = '100%',
  height = '450px',
  defaultCenter = { lat: 11.0628, lng: 77.0850 }, // Neelambur area center
  defaultZoom = 12
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. Seed dummy clinics if collection is empty
  const seedClinicsIfEmpty = async () => {
    const clinicsCol = collection(db, 'Clinics');
    const snap = await getDocs(clinicsCol);
    if (snap.empty) {
      console.log('Clinics collection is empty. Seeding sample clinics...');
      const dummyClinics: Clinic[] = [
        {
          name: 'Neelambur Primary Health Centre',
          latitude: 11.0628,
          longitude: 77.0850,
          medicinesAvailable: ['Paracetamol', 'Amoxicillin', 'Metformin'],
          testsAvailable: ['Blood Glucose', 'Malaria Rapid Test']
        },
        {
          name: 'Kallipalayam Community Clinic',
          latitude: 11.0921,
          longitude: 77.0514,
          medicinesAvailable: false,
          testsAvailable: ['HB Check']
        },
        {
          name: 'Coimbatore District Hospital',
          latitude: 11.0183,
          longitude: 76.9724,
          medicinesAvailable: ['Insulin', 'Ibuprofen', 'Cetirizine'],
          testsAvailable: ['X-Ray', 'CBC', 'Widal Test', 'Urinalysis']
        },
        {
          name: 'Somanur Rural Health Sub-Centre',
          latitude: 11.0772,
          longitude: 77.1935,
          medicinesAvailable: ['Paracetamol'],
          testsAvailable: false
        }
      ];

      for (const clinic of dummyClinics) {
        await addDoc(clinicsCol, clinic);
      }
      console.log('Clinics seeded successfully!');
      return dummyClinics;
    }

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Clinic[];
  };

  // 2. Load clinics data and Google Maps API
  useEffect(() => {
    const initData = async () => {
      try {
        const loadedClinics = await seedClinicsIfEmpty();
        setClinics(loadedClinics);
      } catch (err: any) {
        console.error('Failed to load clinic documents:', err);
        setError('Failed to fetch clinic locations from Firestore.');
      }
    };

    initData();

    if (!apiKey) {
      setError('Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    loadGoogleMapsScript(apiKey, () => {
      setMapsLoaded(true);
      setLoading(false);
    });
  }, [apiKey]);

  // 3. Render map once script is loaded and clinics are fetched
  useEffect(() => {
    if (!mapsLoaded || clinics.length === 0 || !mapRef.current) return;

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const infoWindow = new (window as any).google.maps.InfoWindow();

    clinics.forEach((clinic) => {
      const lat = Number(clinic.latitude);
      const lng = Number(clinic.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      // Determine medicine/test availability
      const hasMeds = Array.isArray(clinic.medicinesAvailable)
        ? clinic.medicinesAvailable.length > 0
        : !!clinic.medicinesAvailable;

      const hasTests = Array.isArray(clinic.testsAvailable)
        ? clinic.testsAvailable.length > 0
        : !!clinic.testsAvailable;

      const available = hasMeds || hasTests;
      const markerColor = available ? 'green' : 'red';
      const markerIcon = `https://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`;

      const marker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        title: clinic.name,
        icon: markerIcon
      });

      // Prepare InfoWindow HTML contents
      const medsContent = Array.isArray(clinic.medicinesAvailable)
        ? clinic.medicinesAvailable.join(', ')
        : clinic.medicinesAvailable
        ? 'Available'
        : 'None available';

      const testsContent = Array.isArray(clinic.testsAvailable)
        ? clinic.testsAvailable.join(', ')
        : clinic.testsAvailable
        ? 'Available'
        : 'None available';

      const contentString = `
        <div style="font-family: sans-serif; padding: 8px; max-width: 250px;">
          <h4 style="margin: 0 0 6px 0; color: #111827; font-weight: 700; font-size: 14px;">${clinic.name}</h4>
          <div style="margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; display: block;">Medicines</span>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: ${hasMeds ? '#065f46' : '#991b1b'}; font-weight: 500;">
              ${medsContent}
            </p>
          </div>
          <div>
            <span style="font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; display: block;">Diagnostic Tests</span>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: ${hasTests ? '#065f46' : '#991b1b'}; font-weight: 500;">
              ${testsContent}
            </p>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });
    });
  }, [mapsLoaded, clinics, defaultCenter, defaultZoom]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50" style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-semibold">Loading Clinic Map...</p>
          </div>
        </div>
      )}

      {error && !mapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-100 text-center z-10">
          <div className="max-w-md space-y-2">
            <p className="text-sm font-bold text-slate-800">Map Configuration Issue</p>
            <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
