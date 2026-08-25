export type UserRole = 'citizen' | 'health_worker' | 'official';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  patientId?: string;
  facility?: string;
  village?: string;
  district?: string;
  phone: string;
  empId?: string;
  accessLevel: 'View Only' | 'Create and Edit' | 'View Only Dashboard';
}

export type RiskLevel = 'Green' | 'Yellow' | 'Red' | 'Emergency';

export interface Vitals {
  bp: string; // e.g. "150/95"
  temp: string; // e.g. "98.6"
  heartRate: number; // e.g. 82
  spO2: number; // e.g. 98
  bloodSugar?: number; // e.g. 140
  weight?: number; // in kg
  recordedAt: string; // timestamp
  recordedBy: string;
}

export interface Patient {
  id: string; // e.g. "SS-PT-10021"
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  village: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  abhaId?: string;
  caregiverPhone?: string;
  consentGiven: boolean;
  
  // Health Status & Risk
  riskLevel: RiskLevel;
  riskReason?: string;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  knownConditions: string[];
  allergies: string[];
  currentMedicines: string[];
  
  // Latest Vitals
  latestVitals: Vitals;
  
  lastVisitDate: string;
  nextActionDue: string;
  assignedWorker: string;
  facility: string;
  
  // Audit
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  facility: string;
  workerName: string;
  reason: string;
  diagnosis: string;
  vitals: Vitals;
  notes: string;
  prescriptions: { medicineName: string; dosage: string; frequency: string; duration: string }[];
  followUpDate?: string;
}

export interface TriageRecord {
  id: string;
  patientId: string;
  patientName: string;
  village: string;
  timestamp: string;
  symptoms: string[];
  durationDays: number;
  isPregnant: boolean;
  dangerSigns: string[];
  vitals: Vitals;
  calculatedRisk: RiskLevel;
  recommendedAction: string;
  recommendedFacility: string;
  healthWorker: string;
  status: 'Draft' | 'Submitted' | 'Actioned';
}

export interface Appointment {
  id: string; // e.g. "APT-9042"
  patientId: string;
  patientName: string;
  patientPhone: string;
  facility: string;
  specialty: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  queueToken: string; // e.g. "A-14"
  estimatedWaitMinutes: number;
  locationDetails: string;
  instructions: string;
  status: 'Booked' | 'Checked In' | 'Completed' | 'Cancelled' | 'No Show';
  cancellationReason?: string;
  rescheduledFrom?: string;
  createdAt: string;
  createdBy: string;
  callLink?: string;
}

export type ReferralStatus = 
  | 'Created'
  | 'Sent'
  | 'Accepted'
  | 'Facility Visit'
  | 'Consultation Complete'
  | 'Follow-up';

export interface Referral {
  id: string; // e.g. "REF-8831"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientVillage: string;
  patientAge: number;
  reason: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  sourceFacility: string;
  destinationFacility: string;
  referringWorker: string;
  vitals: Vitals;
  clinicalNotes: string;
  transportRequired: boolean;
  transportStatus?: string;
  status: ReferralStatus;
  subState: 'Draft' | 'Sent' | 'Accepted' | 'Awaiting Visit' | 'Completed' | 'Delayed';
  documentsAttached: string[];
  createdAt: string;
  acceptedAt?: string;
  visitedAt?: string;
  completedAt?: string;
  outcomeNotes?: string;
  qrCodeToken: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  orderDate: string;
  sampleCollectedDate?: string;
  resultDate?: string;
  facility: string;
  status: 'Ordered' | 'Sample Collected' | 'Result Ready';
  resultSummary?: string;
  normalRange?: string;
  isAbnormal?: boolean;
  labTechnician?: string;
  reportUrl?: string;
}

export interface MedicineItem {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  refillDueDate: string;
  prescribedBy: string;
  prescribedDate: string;
  facilityStockStatus: 'Available' | 'Low Stock' | 'Unavailable';
  nearestAvailableFacility?: string;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  village: string;
  category: 'Maternal Care' | 'Child Care' | 'Diabetes' | 'Hypertension' | 'TB' | 'Elderly' | 'General';
  dueDate: string;
  purpose: string;
  assignedWorker: string;
  riskLevel: RiskLevel;
  previousNote: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  completedAt?: string;
  visitOutcomeNotes?: string;
  rescheduledTo?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'PHC' | 'Government Hospital' | 'Medical College Hospital';
  district: string;
  villageOrTaluk: string;
  distanceKm: number;
  doctorsAvailable: number;
  specialties: string[];
  isOpen: boolean;
  avgWaitMinutes: number;
  patientLoad: 'Low' | 'Moderate' | 'High' | 'Overloaded';
  referralCompletionRate: number;
  staffCount: number;
  activeQueueCount: number;
  contactNumber: string;
}

export interface StockAvailability {
  id: string;
  facilityId: string;
  facilityName: string;
  itemName: string;
  type: 'Medicine' | 'Diagnostic';
  status: 'Available' | 'Low Stock' | 'Unavailable' | 'Limited';
  quantityOnHand?: number;
  unit?: string;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  forRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  isRead: boolean;
  actionRequired?: boolean;
  actionCompleted?: boolean;
}

export interface AuditLogEntry {
  id: string;
  patientId: string;
  action: string;
  updatedBy: string;
  userRole: UserRole;
  timestamp: string;
  details: string;
}
