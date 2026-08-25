import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json, returning empty structure:', error);
    return {
      users: {},
      patients: [],
      facilities: [],
      appointments: [],
      referrals: [],
      testResults: [],
      medicines: [],
      followUps: [],
      stocks: [],
      notifications: [],
      auditLogs: [],
      triages: []
    };
  }
}

// Helper to write database
async function writeDb(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
    throw error;
  }
}

// 1. Authentication
app.post('/api/auth/login', async (req, res) => {
  const { role, identifier, otp } = req.body;
  const db = await readDb();
  
  // Simple verification logic matching frontend
  if (otp === '123456' || otp === '1234' || (otp && otp.trim() !== '')) {
    const user = db.users[role];
    if (user) {
      return res.json({ success: true, user, role });
    }
  }
  return res.status(400).json({ success: false, message: 'Invalid OTP or role' });
});

// 2. Dashboard metrics retrieval helper endpoints
app.get('/api/dashboard/:role', async (req, res) => {
  const { role } = req.params;
  const db = await readDb();
  
  if (role === 'worker') {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      totalPatients: db.patients.length,
      highRiskCount: db.patients.filter(p => p.riskLevel === 'Red' || p.riskLevel === 'Emergency').length,
      appointmentsToday: db.appointments.filter(a => a.date === today && a.status !== 'Cancelled').length,
      pendingFollowups: db.followUps.filter(f => f.status === 'Pending').length
    };
    return res.json(stats);
  }
  
  if (role === 'official') {
    const stats = {
      totalFacilities: db.facilities.length,
      highRiskRatio: db.patients.filter(p => p.riskLevel === 'Red' || p.riskLevel === 'Emergency').length,
      stockAlerts: db.stocks.filter(s => s.status === 'Low Stock' || s.status === 'Unavailable').length,
      activeReferrals: db.referrals.filter(r => r.status !== 'Consultation Complete').length
    };
    return res.json(stats);
  }
  
  return res.status(400).json({ error: 'Role dashboard endpoint not specifically requested or supported' });
});

// 3. Patients API
app.get('/api/patients', async (req, res) => {
  const db = await readDb();
  res.json(db.patients);
});

app.get('/api/patients/:id', async (req, res) => {
  const db = await readDb();
  const patient = db.patients.find(p => p.id === req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

app.post('/api/patients', async (req, res) => {
  const patientData = req.body;
  const db = await readDb();
  
  const newId = patientData.id || `SS-PT-${Math.floor(10000 + Math.random() * 90000)}`;
  const workerName = patientData.lastUpdatedBy || 'ASHA Worker';
  
  const newPatient = {
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
    lastVisitDate: patientData.lastVisitDate || new Date().toISOString().split('T')[0],
    nextActionDue: patientData.nextActionDue || 'Initial Consultation Pending',
    assignedWorker: patientData.assignedWorker || workerName,
    facility: patientData.facility || 'Kallipalayam Sub-Centre',
    lastUpdatedBy: workerName,
    lastUpdatedAt: new Date().toLocaleString()
  };

  db.patients.unshift(newPatient);
  
  // Add an audit log automatically
  const auditEntry = {
    id: `AUD-${Date.now()}`,
    patientId: newId,
    action: 'New Patient Registered',
    updatedBy: workerName,
    userRole: 'health_worker',
    timestamp: new Date().toLocaleString(),
    details: `Registered ${newPatient.name} from ${newPatient.village}`
  };
  db.auditLogs.unshift(auditEntry);
  
  await writeDb(db);
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = await readDb();
  
  const index = db.patients.findIndex(p => p.id === id);
  if (index !== -1) {
    const workerName = updates.lastUpdatedBy || 'ASHA Worker';
    db.patients[index] = {
      ...db.patients[index],
      ...updates,
      lastUpdatedBy: workerName,
      lastUpdatedAt: new Date().toLocaleString()
    };
    
    // Add audit log
    const auditEntry = {
      id: `AUD-${Date.now()}`,
      patientId: id,
      action: 'Patient Info Updated',
      updatedBy: workerName,
      userRole: 'health_worker',
      timestamp: new Date().toLocaleString(),
      details: `Updated demographic & health record for ${id}`
    };
    db.auditLogs.unshift(auditEntry);
    
    await writeDb(db);
    res.json(db.patients[index]);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// 4. Appointments API
app.get('/api/appointments', async (req, res) => {
  const db = await readDb();
  res.json(db.appointments);
});

app.post('/api/appointments', async (req, res) => {
  const appointmentData = req.body;
  const db = await readDb();
  
  const newId = appointmentData.id || `APT-${Math.floor(9000 + Math.random() * 900)}`;
  const tokenNum = Math.floor(1 + Math.random() * 30);
  const workerName = appointmentData.createdBy || 'ASHA Worker';
  
  const newApt = {
    id: newId,
    patientId: appointmentData.patientId || 'SS-PT-10021',
    patientName: appointmentData.patientName || 'Lakshmi Devi',
    patientPhone: appointmentData.patientPhone || '+91 98765 43210',
    facility: appointmentData.facility || 'Neelambur PHC',
    specialty: appointmentData.specialty || 'General OPD',
    doctorName: appointmentData.doctorName || 'Duty Medical Officer',
    date: appointmentData.date || new Date().toISOString().split('T')[0],
    timeSlot: appointmentData.timeSlot || '10:00 AM - 10:30 AM',
    queueToken: appointmentData.queueToken || `OPD-${tokenNum < 10 ? '0' + tokenNum : tokenNum}`,
    estimatedWaitMinutes: appointmentData.estimatedWaitMinutes || tokenNum * 5,
    locationDetails: appointmentData.locationDetails || 'OPD Desk Room 1',
    instructions: appointmentData.instructions || 'Carry ID card and previous prescriptions.',
    status: appointmentData.status || 'Booked',
    createdAt: new Date().toLocaleString(),
    createdBy: workerName
  };

  db.appointments.unshift(newApt);
  
  // Add audit log
  const auditEntry = {
    id: `AUD-${Date.now()}`,
    patientId: newApt.patientId,
    action: 'Appointment Booked',
    updatedBy: workerName,
    userRole: 'health_worker',
    timestamp: new Date().toLocaleString(),
    details: `Booked appointment ${newApt.id} at ${newApt.facility} for ${newApt.date}`
  };
  db.auditLogs.unshift(auditEntry);
  
  await writeDb(db);
  res.status(201).json(newApt);
});

app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status, cancellationReason } = req.body;
  const db = await readDb();
  
  const index = db.appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    db.appointments[index] = {
      ...db.appointments[index],
      status,
      cancellationReason: cancellationReason || db.appointments[index].cancellationReason
    };
    await writeDb(db);
    res.json(db.appointments[index]);
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// 5. Referrals API
app.get('/api/referrals', async (req, res) => {
  const db = await readDb();
  res.json(db.referrals);
});

app.post('/api/referrals', async (req, res) => {
  const referralData = req.body;
  const db = await readDb();
  
  const newId = referralData.id || `REF-${Math.floor(8800 + Math.random() * 100)}`;
  const workerName = referralData.referringWorker || 'ASHA Worker';
  
  const newRef = {
    id: newId,
    patientId: referralData.patientId || 'SS-PT-10021',
    patientName: referralData.patientName || 'Lakshmi Devi',
    patientPhone: referralData.patientPhone || '+91 98765 43210',
    patientVillage: referralData.patientVillage || 'Kallipalayam',
    patientAge: Number(referralData.patientAge) || 28,
    reason: referralData.reason || 'Referral for higher clinical evaluation',
    urgency: referralData.urgency || 'Urgent',
    sourceFacility: referralData.sourceFacility || 'Kallipalayam Sub-Centre',
    destinationFacility: referralData.destinationFacility || 'Coimbatore Medical College Hospital',
    referringWorker: workerName,
    vitals: referralData.vitals || {
      bp: '120/80',
      temp: '98.6°F',
      heartRate: 80,
      spO2: 98,
      recordedAt: new Date().toLocaleString(),
      recordedBy: workerName
    },
    clinicalNotes: referralData.clinicalNotes || 'Escalating for specialist care',
    transportRequired: referralData.transportRequired || false,
    transportStatus: referralData.transportRequired ? '108 Ambulance Alerted' : undefined,
    status: referralData.status || 'Sent',
    subState: referralData.subState || 'Sent',
    documentsAttached: referralData.documentsAttached || ['Patient_Vitals_Summary.pdf'],
    createdAt: new Date().toLocaleString(),
    qrCodeToken: referralData.qrCodeToken || `REF-${referralData.patientId}-${newId}`
  };

  db.referrals.unshift(newRef);
  
  // Add audit log
  const auditEntry = {
    id: `AUD-${Date.now()}`,
    patientId: newRef.patientId,
    action: 'Created Clinical Referral',
    updatedBy: workerName,
    userRole: 'health_worker',
    timestamp: new Date().toLocaleString(),
    details: `Created referral ${newRef.id} (${newRef.urgency}) to ${newRef.destinationFacility}`
  };
  db.auditLogs.unshift(auditEntry);
  
  await writeDb(db);
  res.status(201).json(newRef);
});

app.put('/api/referrals/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = await readDb();
  
  const index = db.referrals.findIndex(r => r.id === id);
  if (index !== -1) {
    db.referrals[index] = {
      ...db.referrals[index],
      status,
      subState: status,
      outcomeNotes: notes || db.referrals[index].outcomeNotes,
      completedAt: status === 'Follow-up' || status === 'Consultation Complete' ? new Date().toLocaleString() : db.referrals[index].completedAt
    };
    await writeDb(db);
    res.json(db.referrals[index]);
  } else {
    res.status(404).json({ error: 'Referral not found' });
  }
});

// 6. Follow-ups API
app.get('/api/followups', async (req, res) => {
  const db = await readDb();
  res.json(db.followUps);
});

app.put('/api/followups/:id', async (req, res) => {
  const { id } = req.params;
  const { status, visitOutcomeNotes, dueDate, workerName } = req.body;
  const db = await readDb();
  
  const index = db.followUps.findIndex(f => f.id === id);
  if (index !== -1) {
    db.followUps[index] = {
      ...db.followUps[index],
      status: status || db.followUps[index].status,
      visitOutcomeNotes: visitOutcomeNotes || db.followUps[index].visitOutcomeNotes,
      dueDate: dueDate || db.followUps[index].dueDate,
      completedAt: status === 'Completed' ? new Date().toLocaleString() : db.followUps[index].completedAt,
      rescheduledTo: dueDate ? dueDate : db.followUps[index].rescheduledTo
    };
    
    // Add audit log if completed
    if (status === 'Completed') {
      const task = db.followUps[index];
      const auditEntry = {
        id: `AUD-${Date.now()}`,
        patientId: task.patientId,
        action: 'Follow-up Visit Completed',
        updatedBy: workerName || 'ASHA Worker',
        userRole: 'health_worker',
        timestamp: new Date().toLocaleString(),
        details: visitOutcomeNotes || 'Visit completed successfully.'
      };
      db.auditLogs.unshift(auditEntry);
    }
    
    await writeDb(db);
    res.json(db.followUps[index]);
  } else {
    res.status(404).json({ error: 'Follow-up task not found' });
  }
});

// 7. Facilities API
app.get('/api/facilities', async (req, res) => {
  const db = await readDb();
  res.json(db.facilities);
});

// 8. Stocks API
app.get('/api/stocks', async (req, res) => {
  const db = await readDb();
  res.json(db.stocks);
});

app.put('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const { status, quantityOnHand } = req.body;
  const db = await readDb();
  
  const index = db.stocks.findIndex(s => s.id === id);
  if (index !== -1) {
    db.stocks[index] = {
      ...db.stocks[index],
      status: status || db.stocks[index].status,
      quantityOnHand: quantityOnHand !== undefined ? Number(quantityOnHand) : db.stocks[index].quantityOnHand,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    await writeDb(db);
    res.json(db.stocks[index]);
  } else {
    res.status(404).json({ error: 'Stock item not found' });
  }
});

// 9. Triage API
app.get('/api/triages', async (req, res) => {
  const db = await readDb();
  res.json(db.triages || []);
});

app.post('/api/triages', async (req, res) => {
  const triageData = req.body;
  const db = await readDb();
  
  const workerName = triageData.healthWorker || 'ASHA Worker';
  const newTriage = {
    id: `TRG-${Date.now()}`,
    patientId: triageData.patientId || 'SS-PT-10021',
    patientName: triageData.patientName || 'Patient',
    village: triageData.village || 'Kallipalayam',
    timestamp: new Date().toLocaleString(),
    symptoms: triageData.symptoms || [],
    durationDays: Number(triageData.durationDays) || 1,
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
    status: triageData.status || 'Submitted'
  };

  if (!db.triages) {
    db.triages = [];
  }
  db.triages.unshift(newTriage);
  
  // Find and update the patient health profile risk level automatically in backend
  const pIndex = db.patients.findIndex(p => p.id === newTriage.patientId);
  if (pIndex !== -1) {
    db.patients[pIndex].riskLevel = newTriage.calculatedRisk;
    db.patients[pIndex].riskReason = `Triage Result: ${newTriage.recommendedAction}`;
    db.patients[pIndex].latestVitals = newTriage.vitals;
    db.patients[pIndex].lastUpdatedBy = workerName;
    db.patients[pIndex].lastUpdatedAt = new Date().toLocaleString();
  }
  
  // Add audit log
  const auditEntry = {
    id: `AUD-${Date.now()}`,
    patientId: newTriage.patientId,
    action: 'Smart Triage Performed',
    updatedBy: workerName,
    userRole: 'health_worker',
    timestamp: new Date().toLocaleString(),
    details: `Calculated risk level: ${newTriage.calculatedRisk} for ${newTriage.patientName}`
  };
  db.auditLogs.unshift(auditEntry);

  await writeDb(db);
  res.status(201).json(newTriage);
});

// 10. Notifications API
app.get('/api/notifications', async (req, res) => {
  const db = await readDb();
  res.json(db.notifications);
});

app.put('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;
  const { isRead, actionCompleted } = req.body;
  const db = await readDb();
  
  const index = db.notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    db.notifications[index] = {
      ...db.notifications[index],
      isRead: isRead !== undefined ? isRead : db.notifications[index].isRead,
      actionCompleted: actionCompleted !== undefined ? actionCompleted : db.notifications[index].actionCompleted
    };
    await writeDb(db);
    res.json(db.notifications[index]);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

// 11. Audit Logs API
app.get('/api/audit-logs', async (req, res) => {
  const db = await readDb();
  res.json(db.auditLogs);
});

app.post('/api/audit-logs', async (req, res) => {
  const logData = req.body;
  const db = await readDb();
  
  const newEntry = {
    id: logData.id || `AUD-${Date.now()}`,
    patientId: logData.patientId || 'GENERAL',
    action: logData.action || 'Unknown Action',
    updatedBy: logData.updatedBy || 'ASHA Worker',
    userRole: logData.userRole || 'health_worker',
    timestamp: logData.timestamp || new Date().toLocaleString(),
    details: logData.details || ''
  };
  
  db.auditLogs.unshift(newEntry);
  await writeDb(db);
  res.status(201).json(newEntry);
});

// 12. Test Results API
app.get('/api/test-results', async (req, res) => {
  const db = await readDb();
  res.json(db.testResults);
});

// 13. Medicines API
app.get('/api/medicines', async (req, res) => {
  const db = await readDb();
  res.json(db.medicines);
});

// 14. Bulk Sync API for Offline operations
app.post('/api/sync', async (req, res) => {
  const { queue } = req.body;
  if (!Array.isArray(queue) || queue.length === 0) {
    return res.json({ success: true, message: 'Nothing to sync' });
  }
  
  const db = await readDb();
  let syncCount = 0;
  
  for (const item of queue) {
    const { type, payload, id } = item;
    
    if (type === 'REGISTER_PATIENT') {
      const exists = db.patients.some(p => p.id === payload.id);
      if (!exists) {
        db.patients.unshift(payload);
        syncCount++;
      }
    } else if (type === 'UPDATE_PATIENT') {
      const pIndex = db.patients.findIndex(p => p.id === id);
      if (pIndex !== -1) {
        db.patients[pIndex] = {
          ...db.patients[pIndex],
          ...payload,
          lastUpdatedAt: new Date().toLocaleString()
        };
        syncCount++;
      }
    } else if (type === 'ADD_TRIAGE') {
      if (!db.triages) db.triages = [];
      const exists = db.triages.some(t => t.id === payload.id);
      if (!exists) {
        db.triages.unshift(payload);
        
        // update patient risk
        const pIndex = db.patients.findIndex(p => p.id === payload.patientId);
        if (pIndex !== -1) {
          db.patients[pIndex].riskLevel = payload.calculatedRisk;
          db.patients[pIndex].riskReason = `Triage Result: ${payload.recommendedAction}`;
          db.patients[pIndex].latestVitals = payload.vitals;
        }
        syncCount++;
      }
    } else if (type === 'BOOK_APPOINTMENT') {
      const exists = db.appointments.some(a => a.id === payload.id);
      if (!exists) {
        db.appointments.unshift(payload);
        syncCount++;
      }
    } else if (type === 'CREATE_REFERRAL') {
      const exists = db.referrals.some(r => r.id === payload.id);
      if (!exists) {
        db.referrals.unshift(payload);
        syncCount++;
      }
    }
  }
  
  // Add a sync completed audit log
  const syncAudit = {
    id: `AUD-SYNC-${Date.now()}`,
    patientId: 'MULTIPLE',
    action: 'Offline Batch Sync Completed',
    updatedBy: 'Meena R (ASHA Worker)',
    userRole: 'health_worker',
    timestamp: new Date().toLocaleString(),
    details: `${syncCount} records successfully synced from local buffer to central database.`
  };
  db.auditLogs.unshift(syncAudit);
  
  await writeDb(db);
  res.json({ success: true, syncedRecords: syncCount });
});

app.listen(PORT, () => {
  console.log(`Swasthya Setu Backend server running on http://localhost:${PORT}`);
});
