export type RiskLevel = 'high' | 'medium' | 'low';
export type PatientType = 'maternal' | 'chronic' | 'child' | 'general';
export type AppointmentStatus = 'in-progress' | 'waiting' | 'scheduled' | 'completed';
export type ReferralStatus = 'pending' | 'completed' | 'rejected';
export type StockLevel = 'high' | 'medium' | 'low' | 'out';

export const patients = [
  { id: 'MH-2024-001', name: 'Sunita Thorat', age: 28, village: 'Wada', phone: '9876543210', type: 'maternal' as PatientType, lastVisit: '2026-08-10', condition: 'Pregnant — 7 months, anaemia', riskLevel: 'high' as RiskLevel, bloodGroup: 'B+', weight: '62 kg', bp: '130/88' },
  { id: 'MH-2024-002', name: 'Ramesh Patil', age: 54, village: 'Bhiwandi', phone: null, type: 'chronic' as PatientType, lastVisit: '2026-08-05', condition: 'Hypertension, Type 2 Diabetes', riskLevel: 'medium' as RiskLevel, bloodGroup: 'O+', weight: '78 kg', bp: '148/94' },
  { id: 'MH-2024-003', name: 'Kavita Shinde', age: 35, village: 'Shahpur', phone: '9823456789', type: 'general' as PatientType, lastVisit: '2026-08-18', condition: 'Fever, Cough — 5 days', riskLevel: 'low' as RiskLevel, bloodGroup: 'A+', weight: '55 kg', bp: '118/76' },
  { id: 'MH-2024-004', name: 'Arjun More', age: 8, village: 'Murbad', phone: null, type: 'child' as PatientType, lastVisit: '2026-08-12', condition: 'Severe acute malnutrition', riskLevel: 'high' as RiskLevel, bloodGroup: 'AB+', weight: '14 kg', bp: '—' },
  { id: 'MH-2024-005', name: 'Lata Desai', age: 62, village: 'Wada', phone: '9988776655', type: 'chronic' as PatientType, lastVisit: '2026-07-30', condition: 'COPD, Osteoarthritis', riskLevel: 'medium' as RiskLevel, bloodGroup: 'B-', weight: '51 kg', bp: '122/80' },
  { id: 'MH-2024-006', name: 'Ganesh Kamble', age: 42, village: 'Asangaon', phone: null, type: 'general' as PatientType, lastVisit: '2026-08-20', condition: 'Fungal skin infection', riskLevel: 'low' as RiskLevel, bloodGroup: 'O+', weight: '70 kg', bp: '124/78' },
  { id: 'MH-2024-007', name: 'Priya Waghmare', age: 24, village: 'Shahpur', phone: '9765432108', type: 'maternal' as PatientType, lastVisit: '2026-08-17', condition: 'Pregnant — 5 months, first pregnancy', riskLevel: 'low' as RiskLevel, bloodGroup: 'A-', weight: '57 kg', bp: '112/72' },
  { id: 'MH-2024-008', name: 'Suresh Mhatre', age: 67, village: 'Titwala', phone: null, type: 'chronic' as PatientType, lastVisit: '2026-08-01', condition: 'Heart failure, Hypertension', riskLevel: 'high' as RiskLevel, bloodGroup: 'A+', weight: '68 kg', bp: '156/102' },
];

export const appointments = [
  { id: 'APT-001', patientId: 'MH-2024-001', patientName: 'Sunita Thorat', village: 'Wada', date: '2026-08-24', time: '10:00', type: 'teleconsultation', status: 'in-progress' as AppointmentStatus, queuePosition: 0, doctor: 'Dr. Meera Joshi', symptoms: 'Dizziness, leg swelling, reduced foetal movement' },
  { id: 'APT-002', patientId: 'MH-2024-002', patientName: 'Ramesh Patil', village: 'Bhiwandi', date: '2026-08-24', time: '10:30', type: 'in-person', status: 'waiting' as AppointmentStatus, queuePosition: 1, doctor: 'Dr. Suresh Kulkarni', symptoms: 'High blood sugar reading at home — 320 mg/dL' },
  { id: 'APT-003', patientId: 'MH-2024-003', patientName: 'Kavita Shinde', village: 'Shahpur', date: '2026-08-24', time: '11:00', type: 'teleconsultation', status: 'scheduled' as AppointmentStatus, queuePosition: 2, doctor: 'Dr. Meera Joshi', symptoms: 'Persistent fever, productive cough, night sweats' },
  { id: 'APT-004', patientId: 'MH-2024-004', patientName: 'Arjun More', village: 'Murbad', date: '2026-08-24', time: '11:30', type: 'in-person', status: 'scheduled' as AppointmentStatus, queuePosition: 3, doctor: 'Dr. Suresh Kulkarni', symptoms: 'Weight not improving, appetite loss' },
  { id: 'APT-005', patientId: 'MH-2024-008', patientName: 'Suresh Mhatre', village: 'Titwala', date: '2026-08-24', time: '14:00', type: 'teleconsultation', status: 'scheduled' as AppointmentStatus, queuePosition: 4, doctor: 'Dr. Meera Joshi', symptoms: 'Breathlessness on exertion, ankle oedema' },
];

export const referrals = [
  { id: 'REF-001', patientId: 'MH-2024-001', patientName: 'Sunita Thorat', from: 'Wada PHC', to: 'Thane Civil Hospital — Obstetrics', reason: 'High-risk pregnancy with pre-eclampsia signs. Requires specialist monitoring and possible early delivery.', status: 'completed' as ReferralStatus, date: '2026-08-15', doctor: 'Dr. Meera Joshi', urgency: 'urgent' },
  { id: 'REF-002', patientId: 'MH-2024-004', patientName: 'Arjun More', from: 'Murbad PHC', to: 'Kalyan District Hospital — NRC', reason: 'Severe acute malnutrition with complications. Requires NRC admission for therapeutic feeding programme.', status: 'pending' as ReferralStatus, date: '2026-08-20', doctor: 'Dr. Suresh Kulkarni', urgency: 'urgent' },
  { id: 'REF-003', patientId: 'MH-2024-002', patientName: 'Ramesh Patil', from: 'Bhiwandi PHC', to: 'Thane Civil Hospital — Endocrinology', reason: 'Uncontrolled Type 2 diabetes with HbA1c >12. Requires endocrinologist and dietitian consultation.', status: 'pending' as ReferralStatus, date: '2026-08-22', doctor: 'Dr. Meera Joshi', urgency: 'routine' },
  { id: 'REF-004', patientId: 'MH-2024-008', patientName: 'Suresh Mhatre', from: 'Titwala PHC', to: 'Thane Civil Hospital — Cardiology', reason: 'Decompensated heart failure. Requires echocardiogram and specialist cardiac management.', status: 'pending' as ReferralStatus, date: '2026-08-23', doctor: 'Dr. Meera Joshi', urgency: 'urgent' },
];

export const followUps = [
  { id: 'FU-001', patientId: 'MH-2024-001', patientName: 'Sunita Thorat', type: 'maternal' as PatientType, village: 'Wada', phone: '9876543210', nextVisit: '2026-08-26', reminderSent: true, daysOverdue: 0, healthWorker: 'Anita Jadhav' },
  { id: 'FU-002', patientId: 'MH-2024-002', patientName: 'Ramesh Patil', type: 'chronic' as PatientType, village: 'Bhiwandi', phone: null, nextVisit: '2026-08-21', reminderSent: false, daysOverdue: 3, healthWorker: 'Rekha Pawar' },
  { id: 'FU-003', patientId: 'MH-2024-005', patientName: 'Lata Desai', type: 'chronic' as PatientType, village: 'Wada', phone: '9988776655', nextVisit: '2026-08-20', reminderSent: true, daysOverdue: 4, healthWorker: 'Anita Jadhav' },
  { id: 'FU-004', patientId: 'MH-2024-007', patientName: 'Priya Waghmare', type: 'maternal' as PatientType, village: 'Shahpur', phone: '9765432108', nextVisit: '2026-08-28', reminderSent: false, daysOverdue: 0, healthWorker: 'Sunanda Gaikwad' },
  { id: 'FU-005', patientId: 'MH-2024-004', patientName: 'Arjun More', type: 'child' as PatientType, village: 'Murbad', phone: null, nextVisit: '2026-08-19', reminderSent: false, daysOverdue: 5, healthWorker: 'Rekha Pawar' },
];

export const clinics = [
  {
    id: 'PHC-001', name: 'Wada PHC', location: 'Wada, Palghar District', doctors: 2, patients_today: 34, status: 'operational',
    medicines: { paracetamol: 'high' as StockLevel, amoxicillin: 'low' as StockLevel, metformin: 'medium' as StockLevel, iron_folic: 'high' as StockLevel, ors: 'high' as StockLevel, amlodipine: 'medium' as StockLevel },
    tests: { malaria: true, pregnancy: true, blood_sugar: true, hemoglobin: true, tb_sputum: false }
  },
  {
    id: 'PHC-002', name: 'Bhiwandi PHC', location: 'Bhiwandi, Thane District', doctors: 1, patients_today: 47, status: 'understaffed',
    medicines: { paracetamol: 'medium' as StockLevel, amoxicillin: 'out' as StockLevel, metformin: 'out' as StockLevel, iron_folic: 'low' as StockLevel, ors: 'medium' as StockLevel, amlodipine: 'out' as StockLevel },
    tests: { malaria: true, pregnancy: true, blood_sugar: false, hemoglobin: true, tb_sputum: false }
  },
  {
    id: 'PHC-003', name: 'Murbad PHC', location: 'Murbad, Thane District', doctors: 2, patients_today: 28, status: 'operational',
    medicines: { paracetamol: 'high' as StockLevel, amoxicillin: 'medium' as StockLevel, metformin: 'high' as StockLevel, iron_folic: 'medium' as StockLevel, ors: 'high' as StockLevel, amlodipine: 'high' as StockLevel },
    tests: { malaria: true, pregnancy: false, blood_sugar: true, hemoglobin: true, tb_sputum: true }
  },
  {
    id: 'PHC-004', name: 'Shahpur PHC', location: 'Shahpur, Thane District', doctors: 1, patients_today: 19, status: 'critical',
    medicines: { paracetamol: 'low' as StockLevel, amoxicillin: 'medium' as StockLevel, metformin: 'low' as StockLevel, iron_folic: 'out' as StockLevel, ors: 'medium' as StockLevel, amlodipine: 'low' as StockLevel },
    tests: { malaria: false, pregnancy: true, blood_sugar: true, hemoglobin: false, tb_sputum: false }
  },
];

export const villageRisks = [
  { village: 'Titwala', score: 79, trend: 'up' as const, population: 5600, activeCases: 67, primaryRisk: 'Water contamination + seasonal malaria spike', actionNeeded: 'Immediate water testing + malaria screening camp' },
  { village: 'Wada', score: 72, trend: 'up' as const, population: 4200, activeCases: 38, primaryRisk: 'High-risk maternal cases cluster — 4 in third trimester', actionNeeded: 'Refer high-risk mothers; increase ANC visits' },
  { village: 'Bhiwandi', score: 61, trend: 'stable' as const, population: 8900, activeCases: 52, primaryRisk: 'Uncontrolled chronic disease burden, medicine stock critical', actionNeeded: 'Emergency medicine resupply; CHO camp needed' },
  { village: 'Murbad', score: 58, trend: 'down' as const, population: 3100, activeCases: 29, primaryRisk: 'Child malnutrition cluster — SAM cases identified', actionNeeded: 'NRC referrals in progress; RUTF distribution' },
  { village: 'Shahpur', score: 45, trend: 'down' as const, population: 2800, activeCases: 18, primaryRisk: 'Seasonal fever outbreak — resolving', actionNeeded: 'Continue monitoring; no immediate action' },
  { village: 'Asangaon', score: 33, trend: 'stable' as const, population: 1900, activeCases: 11, primaryRisk: 'Routine monitoring — low risk', actionNeeded: 'Routine follow-ups; no urgent action' },
];

export const triageSymptoms = [
  'Fever', 'Cough', 'Breathlessness', 'Chest Pain', 'Headache',
  'Abdominal Pain', 'Vomiting', 'Diarrhoea', 'Dizziness', 'Weakness',
  'Reduced Foetal Movement', 'Bleeding', 'Swelling', 'Rash', 'Jaundice',
];

export const mockPatientHistory = [
  { date: '2026-08-10', doctor: 'Dr. Meera Joshi', type: 'teleconsultation', diagnosis: 'Pregnancy — 3rd trimester, anaemia', prescription: 'Iron-Folic Acid 200mg OD, Calcium 500mg BD', notes: 'BP elevated — 130/88. Follow up in 2 weeks.' },
  { date: '2026-07-20', doctor: 'Dr. Suresh Kulkarni', type: 'in-person', diagnosis: 'Mild anaemia', prescription: 'Iron-Folic Acid 200mg OD', notes: 'Diet counselling given. Weight gain on track.' },
  { date: '2026-06-15', doctor: 'Dr. Meera Joshi', type: 'teleconsultation', diagnosis: 'Pregnancy — 2nd trimester, routine ANC', prescription: 'Iron-Folic Acid 100mg OD, Vitamin D 1000IU OD', notes: 'Foetal growth normal. Next USG at 28 weeks.' },
];
