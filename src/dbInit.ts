import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export async function initFirestoreDatabase(): Promise<Record<string, number>> {
  console.log('--- Initializing Firestore Database Structure ---');

  const collectionsData: Record<string, any[]> = {
    Users: [
      {
        patientId: 'patient-101',
        name: 'Lakshmi Devi',
        age: 42,
        village: 'Kallipalayam',
        phone: '+91 98765 43210',
        role: 'patient'
      },
      {
        patientId: 'patient-102',
        name: 'Ramu K',
        age: 58,
        village: 'Kallipalayam',
        phone: '+91 98765 43211',
        role: 'patient'
      }
    ],
    HealthWorkers: [
      {
        name: 'Meena R',
        assignedClinic: 'Neelambur PHC',
        phone: '+91 98765 11111'
      }
    ],
    Doctors: [
      {
        name: 'Dr. S. Rajalakshmi',
        specialization: 'Obstetrics & Gynecology',
        assignedClinic: 'Neelambur PHC'
      }
    ],
    Appointments: [
      {
        patientId: 'patient-101',
        date: '2026-08-25',
        time: '10:00 AM',
        status: 'Booked',
        type: 'teleconsultation',
        callLink: 'https://meet.jit.si/HealthtechApp-APT-1001'
      }
    ],
    Referrals: [
      {
        patientId: 'patient-101',
        referredTo: 'Coimbatore District Hospital',
        status: 'Sent'
      }
    ],
    FollowUps: [
      {
        patientId: 'patient-101',
        type: 'Maternal Care',
        nextVisitDate: '2026-08-28',
        reminderSent: false
      }
    ],
    Clinics: [
      {
        name: 'Neelambur Primary Health Centre',
        latitude: 11.0628,
        longitude: 77.0850,
        medicinesAvailable: ['Paracetamol', 'Amoxicillin', 'Metformin'],
        testsAvailable: ['Blood Glucose', 'Malaria Rapid Test']
      }
    ],
    RiskScores: [
      {
        patientId: 'patient-101',
        riskLevel: 'Medium',
        reason: 'Patient has persistent cough and lives in village with poor water quality.',
        timestamp: new Date()
      }
    ]
  };

  const results: Record<string, number> = {};

  for (const [colName, dummyDocs] of Object.entries(collectionsData)) {
    try {
      const colRef = collection(db, colName);
      const snap = await getDocs(colRef);
      results[colName] = snap.size;

      if (snap.empty) {
        console.log(`Collection "${colName}" is empty. Seeding dummy documents...`);
        for (const docData of dummyDocs) {
          await addDoc(colRef, docData);
        }
        results[colName] = dummyDocs.length;
        console.log(`Collection "${colName}" seeded successfully.`);
      } else {
        console.log(`Collection "${colName}" already exists and contains ${snap.size} documents.`);
      }
    } catch (err) {
      console.error(`Failed to initialize/seed collection "${colName}":`, err);
      results[colName] = -1;
    }
  }

  console.log('--- Firestore Database Initialization Completed ---');
  console.log('Active Collections Summary:', results);
  return results;
}

// Expose verification runner to browser devtools console
if (typeof window !== 'undefined') {
  (window as any).initFirestoreDatabase = initFirestoreDatabase;
  (window as any).runDatabaseSetupCheck = async () => {
    console.log('Running database setup and list verification...');
    try {
      const summary = await initFirestoreDatabase();
      console.log('%cDatabase Setup Check Completed!', 'color: #10b981; font-weight: bold;');
      console.table(summary);
      return summary;
    } catch (err) {
      console.error('Database setup verification failed:', err);
    }
  };
  console.log('dbInit service loaded! Call runDatabaseSetupCheck() in console to verify collections.');
}
