import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Facility,
  Appointment,
  Referral,
  TestResult,
  MedicineItem,
  FollowUpTask,
  StockAvailability,
  AppNotification,
  AuditLogEntry,
  TriageRecord,
  Vitals,
  ReferralStatus
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_FACILITIES,
  INITIAL_APPOINTMENTS,
  INITIAL_REFERRALS,
  INITIAL_TEST_RESULTS,
  INITIAL_MEDICINES,
  INITIAL_FOLLOWUPS,
  INITIAL_STOCKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateCallLink } from '../VideoCall';

interface HealthDataContextType {
  patients: Patient[];
  facilities: Facility[];
  appointments: Appointment[];
  referrals: Referral[];
  testResults: TestResult[];
  medicines: MedicineItem[];
  followUps: FollowUpTask[];
  stocks: StockAvailability[];
  notifications: AppNotification[];
  auditLogs: AuditLogEntry[];
  triages: TriageRecord[];
  
  // Connectivity & Offline
  isOnline: boolean;
  pendingSyncCount: number;
  toggleOnlineStatus: () => void;
  syncOfflineRecords: () => void;
  
  // Health Worker Actions
  addPatient: (patient: Partial<Patient>, workerName: string) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>, workerName: string) => void;
  recordVitals: (patientId: string, vitals: Vitals, workerName: string) => void;
  addTriage: (triage: Partial<TriageRecord>, workerName: string) => TriageRecord;
  bookAppointment: (appointment: Partial<Appointment>, workerName: string) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], reason?: string) => void;
  createReferral: (referral: Partial<Referral>, workerName: string) => Referral;
  updateReferralStatus: (id: string, status: ReferralStatus, notes?: string) => void;
  completeFollowUp: (id: string, outcomeNotes: string, workerName: string) => void;
  rescheduleFollowUp: (id: string, newDate: string, workerName: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  completeNotificationTask: (id: string) => void;
}

const LOCAL_STORAGE_HEALTH_KEY = 'swasthya_setu_health_store_v2';
const LOCAL_STORAGE_OFFLINE_KEY = 'swasthya_setu_offline_queue_v2';

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_patients`);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_referrals`);
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [testResults, setTestResults] = useState<TestResult[]>(INITIAL_TEST_RESULTS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);

  const [followUps, setFollowUps] = useState<FollowUpTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_followups`);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
  });

  const [stocks, setStocks] = useState<StockAvailability[]>(INITIAL_STOCKS);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HEALTH_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [triages, setTriages] = useState<TriageRecord[]>([]);

  // Connectivity state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingQueue, setPendingQueue] = useState<any[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_OFFLINE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Load from backend if online
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [
          resPatients,
          resAppointments,
          resReferrals,
          resFollowUps,
          resNotifications,
          resAuditLogs,
          resTriages,
          resFacilities,
          resStocks,
          resTestResults,
          resMedicines
        ] = await Promise.all([
          fetch('/api/patients').then(res => res.ok ? res.json() : null),
          fetch('/api/appointments').then(res => res.ok ? res.json() : null),
          fetch('/api/referrals').then(res => res.ok ? res.json() : null),
          fetch('/api/followups').then(res => res.ok ? res.json() : null),
          fetch('/api/notifications').then(res => res.ok ? res.json() : null),
          fetch('/api/audit-logs').then(res => res.ok ? res.json() : null),
          fetch('/api/triages').then(res => res.ok ? res.json() : null),
          fetch('/api/facilities').then(res => res.ok ? res.json() : null),
          fetch('/api/stocks').then(res => res.ok ? res.json() : null),
          fetch('/api/test-results').then(res => res.ok ? res.json() : null),
          fetch('/api/medicines').then(res => res.ok ? res.json() : null)
        ]);

        if (resPatients) setPatients(resPatients);
        if (resAppointments) setAppointments(resAppointments);
        if (resReferrals) setReferrals(resReferrals);
        if (resFollowUps) setFollowUps(resFollowUps);
        if (resNotifications) setNotifications(resNotifications);
        if (resAuditLogs) setAuditLogs(resAuditLogs);
        if (resTriages) setTriages(resTriages);
        if (resFacilities) setFacilities(resFacilities);
        if (resStocks) setStocks(resStocks);
        if (resTestResults) setTestResults(resTestResults);
        if (resMedicines) setMedicines(resMedicines);
      } catch (err) {
        console.warn('Backend server unreachable. Using local storage fallbacks.', err);
      }
    };

    if (isOnline) {
      loadFromBackend();
    }
  }, [isOnline]);

  // Save changes to localStorage (as offline fallback cache)
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_referrals`, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_followups`, JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_HEALTH_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_OFFLINE_KEY, JSON.stringify(pendingQueue));
  }, [pendingQueue]);

  const toggleOnlineStatus = () => {
    setIsOnline((prev) => !prev);
  };

  const syncOfflineRecords = async () => {
    if (pendingQueue.length === 0) return;
    
    if (isOnline) {
      try {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queue: pendingQueue })
        });
        
        if (res.ok) {
          setPendingQueue([]);
          // Reload from server
          const updatedPatients = await fetch('/api/patients').then(r => r.json());
          const updatedAppointments = await fetch('/api/appointments').then(r => r.json());
          const updatedReferrals = await fetch('/api/referrals').then(r => r.json());
          const updatedFollowups = await fetch('/api/followups').then(r => r.json());
          const updatedAuditLogs = await fetch('/api/audit-logs').then(r => r.json());
          const updatedTriages = await fetch('/api/triages').then(r => r.json());
          
          setPatients(updatedPatients);
          setAppointments(updatedAppointments);
          setReferrals(updatedReferrals);
          setFollowUps(updatedFollowups);
          setAuditLogs(updatedAuditLogs);
          setTriages(updatedTriages);
          return;
        }
      } catch (err) {
        console.error('Failed to sync offline queue with backend:', err);
      }
    }

    // Fallback sync logging if offline or request fails
    setPendingQueue([]);
    const syncAudit: AuditLogEntry = {
      id: `AUD-SYNC-${Date.now()}`,
      patientId: 'MULTIPLE',
      action: 'Offline Batch Sync Completed (Local)',
      updatedBy: 'Meena R (ASHA Worker)',
      userRole: 'health_worker',
      timestamp: new Date().toLocaleString(),
      details: `${pendingQueue.length} records successfully synced locally.`
    };
    setAuditLogs((prev) => [syncAudit, ...prev]);
  };

  // Helper audit logger
  const logAudit = (patientId: string, action: string, workerName: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      patientId,
      action,
      updatedBy: workerName,
      userRole: 'health_worker',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      details
    };
    
    if (isOnline) {
      fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      }).catch(err => console.error('Failed to post audit log to backend:', err));
    }
    
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // 1. Add Patient
  const addPatient = (patientData: Partial<Patient>, workerName: string): Patient => {
    const newId = `SS-PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPatient: Patient = {
      id: newId,
      name: patientData.name || 'New Patient',
      age: Number(patientData.age) || 30,
      gender: patientData.gender || 'Female',
      phone: patientData.phone || '+91 90000 00000',
      village: patientData.village || 'Kallipalayam',
      address: patientData.address || 'Village Sector 2',
      bloodGroup: patientData.bloodGroup || 'O Positive',
      emergencyContact: patientData.emergencyContact || 'Family Contact',
      abhaId: patientData.abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      consentGiven: patientData.consentGiven ?? true,
      riskLevel: patientData.riskLevel || 'Green',
      riskReason: patientData.riskReason || 'Routine Registration',
      isPregnant: patientData.isPregnant || false,
      pregnancyWeeks: patientData.pregnancyWeeks,
      knownConditions: patientData.knownConditions || [],
      allergies: patientData.allergies || [],
      currentMedicines: patientData.currentMedicines || [],
      latestVitals: patientData.latestVitals || {
        bp: '120/80',
        temp: '98.6°F',
        heartRate: 75,
        spO2: 98,
        recordedAt: new Date().toLocaleString(),
        recordedBy: workerName
      },
      lastVisitDate: new Date().toISOString().split('T')[0],
      nextActionDue: 'Initial Consultation Pending',
      assignedWorker: workerName,
      facility: patientData.facility || 'Kallipalayam Sub-Centre',
      lastUpdatedBy: workerName,
      lastUpdatedAt: new Date().toLocaleString()
    };

    if (isOnline) {
      fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      }).catch(err => console.error('Failed to post patient to backend:', err));
    } else {
      setPendingQueue((prev) => [...prev, { type: 'REGISTER_PATIENT', payload: newPatient }]);
    }

    setPatients((prev) => [newPatient, ...prev]);
    logAudit(newId, 'New Patient Registered', workerName, `Registered ${newPatient.name} from ${newPatient.village}`);
    return newPatient;
  };

  // 2. Update Patient
  const updatePatient = (id: string, updates: Partial<Patient>, workerName: string) => {
    if (isOnline) {
      fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, lastUpdatedBy: workerName })
      }).catch(err => console.error('Failed to update patient on backend:', err));
    } else {
      setPendingQueue((q) => [...q, { type: 'UPDATE_PATIENT', id, payload: updates }]);
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            ...updates,
            lastUpdatedBy: workerName,
            lastUpdatedAt: new Date().toLocaleString()
          };
          return updated;
        }
        return p;
      })
    );
    logAudit(id, 'Patient Info Updated', workerName, `Updated demographic & health record for ${id}`);
  };

  // 3. Record Vitals
  const recordVitals = (patientId: string, vitals: Vitals, workerName: string) => {
    updatePatient(patientId, { latestVitals: vitals }, workerName);
  };

  // 4. Add Triage Record
  const addTriage = (triageData: Partial<TriageRecord>, workerName: string): TriageRecord => {
    const newTriage: TriageRecord = {
      id: `TRG-${Date.now()}`,
      patientId: triageData.patientId || 'SS-PT-10021',
      patientName: triageData.patientName || 'Patient',
      village: triageData.village || 'Kallipalayam',
      timestamp: new Date().toLocaleString(),
      symptoms: triageData.symptoms || [],
      durationDays: triageData.durationDays || 1,
      isPregnant: triageData.isPregnant || false,
      dangerSigns: triageData.dangerSigns || [],
      vitals: triageData.vitals || {
        bp: '120/80',
        temp: '98.6°F',
        heartRate: 76,
        spO2: 98,
        recordedAt: new Date().toLocaleString(),
        recordedBy: workerName
      },
      calculatedRisk: triageData.calculatedRisk || 'Green',
      recommendedAction: triageData.recommendedAction || 'Routine Care',
      recommendedFacility: triageData.recommendedFacility || 'Kallipalayam Sub-Centre',
      healthWorker: workerName,
      status: 'Submitted'
    };

    if (isOnline) {
      fetch('/api/triages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTriage)
      }).catch(err => console.error('Failed to post triage to backend:', err));
    } else {
      setPendingQueue((prev) => [...prev, { type: 'ADD_TRIAGE', payload: newTriage }]);
    }

    setTriages((prev) => [newTriage, ...prev]);

    // Update patient risk if higher
    if (triageData.patientId) {
      updatePatient(
        triageData.patientId,
        {
          riskLevel: triageData.calculatedRisk || 'Green',
          riskReason: `Triage Result: ${triageData.recommendedAction}`,
          latestVitals: newTriage.vitals
        },
        workerName
      );
    }

    logAudit(newTriage.patientId, 'Smart Triage Performed', workerName, `Calculated risk level: ${newTriage.calculatedRisk}`);
    return newTriage;
  };

  // 5. Book Appointment
  const bookAppointment = (appointmentData: Partial<Appointment>, workerName: string): Appointment => {
    const newId = `APT-${Math.floor(9000 + Math.random() * 900)}`;
    const tokenNum = Math.floor(1 + Math.random() * 30);
    const callLink = generateCallLink(newId);

    const newApt: Appointment = {
      id: newId,
      patientId: appointmentData.patientId || 'SS-PT-10021',
      patientName: appointmentData.patientName || 'Lakshmi Devi',
      patientPhone: appointmentData.patientPhone || '+91 98765 43210',
      facility: appointmentData.facility || 'Neelambur PHC',
      specialty: appointmentData.specialty || 'General OPD',
      doctorName: appointmentData.doctorName || 'Duty Medical Officer',
      date: appointmentData.date || new Date().toISOString().split('T')[0],
      timeSlot: appointmentData.timeSlot || '10:00 AM - 10:30 AM',
      queueToken: `OPD-${tokenNum < 10 ? '0' + tokenNum : tokenNum}`,
      estimatedWaitMinutes: tokenNum * 5,
      locationDetails: appointmentData.locationDetails || 'OPD Desk Room 1',
      instructions: appointmentData.instructions || 'Carry ID card and previous prescriptions.',
      status: 'Booked',
      createdAt: new Date().toLocaleString(),
      createdBy: workerName,
      callLink: callLink
    };

    // Save to Firestore collection "Appointments"
    try {
      const aptRef = doc(db, 'Appointments', newId);
      setDoc(aptRef, newApt).catch((err) => console.error('Failed to write appointment to Firestore:', err));
    } catch (err) {
      console.error('Error referencing Firestore doc:', err);
    }

    if (isOnline) {
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt)
      }).catch(err => console.error('Failed to post appointment to backend:', err));
    } else {
      setPendingQueue((prev) => [...prev, { type: 'BOOK_APPOINTMENT', payload: newApt }]);
    }

    setAppointments((prev) => [newApt, ...prev]);
    logAudit(newApt.patientId, 'Appointment Booked', workerName, `Booked ${newApt.id} at ${newApt.facility} (${newApt.date})`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status'], reason?: string) => {
    if (isOnline) {
      fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cancellationReason: reason })
      }).catch(err => console.error('Failed to update appointment status on backend:', err));
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, cancellationReason: reason } : a))
    );
  };

  // 6. Create Referral
  const createReferral = (referralData: Partial<Referral>, workerName: string): Referral => {
    const newId = `REF-${Math.floor(8800 + Math.random() * 100)}`;
    const newRef: Referral = {
      id: newId,
      patientId: referralData.patientId || 'SS-PT-10021',
      patientName: referralData.patientName || 'Lakshmi Devi',
      patientPhone: referralData.patientPhone || '+91 98765 43210',
      patientVillage: referralData.patientVillage || 'Kallipalayam',
      patientAge: referralData.patientAge || 28,
      reason: referralData.reason || 'Referral for higher clinical evaluation',
      urgency: referralData.urgency || 'Urgent',
      sourceFacility: referralData.sourceFacility || 'Kallipalayam Sub-Centre',
      destinationFacility: referralData.destinationFacility || 'Coimbatore Medical College Hospital',
      referringWorker: workerName,
      vitals: referralData.vitals || {
        bp: '140/90',
        temp: '98.6°F',
        heartRate: 80,
        spO2: 98,
        recordedAt: new Date().toLocaleString(),
        recordedBy: workerName
      },
      clinicalNotes: referralData.clinicalNotes || 'Escalating for specialist care',
      transportRequired: referralData.transportRequired || false,
      transportStatus: referralData.transportRequired ? '108 Ambulance Alerted' : undefined,
      status: 'Sent',
      subState: 'Sent',
      documentsAttached: referralData.documentsAttached || ['Patient_Vitals_Summary.pdf'],
      createdAt: new Date().toLocaleString(),
      qrCodeToken: `REF-${referralData.patientId}-${newId}`
    };

    if (isOnline) {
      fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRef)
      }).catch(err => console.error('Failed to post referral to backend:', err));
    } else {
      setPendingQueue((prev) => [...prev, { type: 'CREATE_REFERRAL', payload: newRef }]);
    }

    setReferrals((prev) => [newRef, ...prev]);
    logAudit(newRef.patientId, 'Created Clinical Referral', workerName, `Created ${newId} (${newRef.urgency}) -> ${newRef.destinationFacility}`);
    return newRef;
  };

  const updateReferralStatus = (id: string, status: ReferralStatus, notes?: string) => {
    if (isOnline) {
      fetch(`/api/referrals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      }).catch(err => console.error('Failed to update referral status on backend:', err));
    }

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            subState: status as any,
            outcomeNotes: notes || r.outcomeNotes,
            completedAt: status === 'Follow-up' || status === 'Consultation Complete' ? new Date().toLocaleString() : r.completedAt
          };
        }
        return r;
      })
    );
  };

  // 7. Complete Follow-Up
  const completeFollowUp = (id: string, outcomeNotes: string, workerName: string) => {
    if (isOnline) {
      fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed', visitOutcomeNotes: outcomeNotes, workerName })
      }).catch(err => console.error('Failed to complete follow-up on backend:', err));
    }

    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: 'Completed',
            completedAt: new Date().toLocaleString(),
            visitOutcomeNotes: outcomeNotes
          };
        }
        return f;
      })
    );
    const task = followUps.find((f) => f.id === id);
    if (task) {
      logAudit(task.patientId, 'Follow-up Visit Completed', workerName, outcomeNotes);
    }
  };

  const rescheduleFollowUp = (id: string, newDate: string, workerName: string) => {
    if (isOnline) {
      fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: newDate, workerName })
      }).catch(err => console.error('Failed to reschedule follow-up on backend:', err));
    }

    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            dueDate: newDate,
            rescheduledTo: newDate
          };
        }
        return f;
      })
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    if (isOnline) {
      fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      }).catch(err => console.error('Failed to update notification read status on backend:', err));
    }

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const completeNotificationTask = (id: string) => {
    if (isOnline) {
      fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionCompleted: true, isRead: true })
      }).catch(err => console.error('Failed to complete notification action on backend:', err));
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, actionCompleted: true, isRead: true } : n))
    );
  };

  return (
    <HealthDataContext.Provider
      value={{
        patients,
        facilities,
        appointments,
        referrals,
        testResults,
        medicines,
        followUps,
        stocks,
        notifications,
        auditLogs,
        triages,
        isOnline,
        pendingSyncCount: pendingQueue.length,
        toggleOnlineStatus,
        syncOfflineRecords,
        addPatient,
        updatePatient,
        recordVitals,
        addTriage,
        bookAppointment,
        updateAppointmentStatus,
        createReferral,
        updateReferralStatus,
        completeFollowUp,
        rescheduleFollowUp,
        markNotificationRead,
        completeNotificationTask
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
