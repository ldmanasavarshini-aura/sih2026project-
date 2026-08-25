# SwasthGram — System Workflow & Data Flow

> This document describes the end-to-end workflow of the SwasthGram rural healthcare platform, covering authentication, patient registration, triage, referrals, and clinic monitoring.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Browser (React 19)                 │
│  React Router v7  ·  TailwindCSS v4  ·  Leaflet Map │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP (Vite proxy → :5000 in dev)
                        ▼
┌─────────────────────────────────────────────────────┐
│          Express.js Backend  (server/server.js)      │
│  REST API  ·  db.json flat-file store  ·  Port 5000 │
└───────────────────────┬─────────────────────────────┘
                        │ (optional — Firestore writes)
                        ▼
┌─────────────────────────────────────────────────────┐
│            Google Firestore (Firebase)               │
│     Patient records  ·  Auth  ·  Audit logs          │
└─────────────────────────────────────────────────────┘
```

---

## User Roles

| Role | Description | Entry Point |
|---|---|---|
| **Citizen / Patient** | Access own health record, appointments, medicines | `/citizen` |
| **ASHA / Health Worker** | Register patients, triage, referrals, follow-ups | `/worker` |
| **Doctor** | Teleconsultation, patient view, prescriptions | `/doctor` |
| **Health Official** | District-level analytics, stock monitoring | `/official` |

---

## 1. Authentication Flow

```
User visits / (LandingPage)
   │
   ▼
Clicks "Sign In" → /login (LoginPage)
   │
   ├── Demo Login: OTP = 1234 / 123456 → Mock auth (offline)
   │
   └── Firebase Login: Email + Password
         │
         ▼
       POST /api/auth/login  ← AuthContext.tsx
         │
         ▼
       server.js validates OTP / role
         │
         ▼
       setRole() + persist to localStorage
         │
         ▼
       <Layout> dispatches to role-specific dashboard
```

**Key files:**
- `src/pages/LoginPage.tsx` — login UI
- `src/context/AuthContext.tsx` — login/logout state
- `src/auth.ts` — Firebase auth helpers
- `server/server.js → POST /api/auth/login`

---

## 2. Patient Registration Flow (Health Worker)

```
Worker navigates to "Register Patient" (/register)
   │
   ▼
RegisterPatient.tsx — fills Name, Age, Village, Phone, etc.
   │
   ▼
HealthDataContext.addPatient()
   │
   ├── Online:  POST /api/patients  → server writes to db.json
   │            (optional) Firestore write via firebase.ts
   │
   └── Offline: Record queued to localStorage offline queue
                Synced on next connectivity event
   │
   ▼
New patient visible in Patient List (/patients)
Patient ID (e.g. SS-PT-87291) generated and shown
```

**Key files:**
- `src/pages/healthworker/RegisterPatient.tsx`
- `src/context/HealthDataContext.tsx → addPatient()`
- `src/api/client.ts → patientsApi.create()`
- `server/server.js → POST /api/patients`

---

## 3. Digital Triage Flow (Health Worker)

```
Worker opens "Triage" page (/triage)
   │
   ▼
Select Patient (search by name / ID)
   │
   ▼
View Patient Info Card
  (Name, ID, Age, Blood Group, Allergies, History)
   │
   ▼
Enter current health complaint (free text)
   │
   ▼
Select symptoms from 15-button grid
  ● Red dot = Danger signs (Chest Pain, Bleeding, etc.)
   │
   ▼
Click "Assess Urgency"
   │
   ├── Emergency 🔴  → Chest Pain / Breathing / Bleeding detected
   │   Referral: Thane Civil Hospital (Emergency)
   │
   ├── Urgent    🟠  → Fever / Vomiting / Jaundice / Weakness
   │   Referral: Wada PHC (Secondary Care)
   │
   └── Routine   🟢  → Cough / Rash / Swelling only
       Referral: Asangaon PHC (General OPD)
   │
   ▼
Triage Record saved:
   POST /api/triages  (via HealthDataContext.addTriage)
   │
   ▼
Click "View on Clinic Map" → navigates to /map (Leaflet CartoDB map)
```

**Key files:**
- `src/pages/healthworker/TriagePage.tsx`
- `src/components/common/ClinicMap.tsx` (Leaflet + CartoDB Voyager tiles)
- `src/api/client.ts → triageApi.submit()`
- `server/server.js → POST /api/triages`

---

## 4. Referral Flow

```
After triage or from patient detail:
Worker creates referral → ReferralsPage.tsx
   │
   ▼
POST /api/referrals
  {patientId, from, to, reason, urgency, doctorId}
   │
   ▼
Doctor receives referral in TeleconsultationPage.tsx
Doctor updates status → PUT /api/referrals/:id/status
   │
   ▼
Health Official views referral analytics → /official/referrals
```

**Key files:**
- `src/pages/healthworker/ReferralsPage.tsx`
- `src/pages/doctor/TeleconsultationPage.tsx`
- `src/pages/official/ReferralAnalytics.tsx`
- `server/server.js → GET/POST /api/referrals`

---

## 5. Teleconsultation Flow (Doctor)

```
Doctor opens TeleconsultationPage
   │
   ▼
Reviews queued appointments from /api/appointments
   │
   ▼
Starts video call (WebRTC / VideoCall.tsx)
   │
   ▼
Records consultation notes, diagnosis, prescription
   │
   ▼
POST /api/appointments/:id/status  (status: "Consultation Complete")
   │
   ▼
Follow-up automatically scheduled → POST /api/followups
```

---

## 6. Clinic Map Flow

```
Worker clicks "View on Clinic Map"
   │
   ▼
ClinicMap.tsx renders Leaflet map with CartoDB Voyager tiles
  (no API key required)
   │
   ▼
Clinic markers loaded from /api/facilities OR src/data/mockData.ts
  ● Green  = Operational
  ● Orange = Understaffed
  ● Red    = Critical / Out of Stock
   │
   ▼
Clicking a pin → popup with:
  · Clinic name
  · Doctor count
  · Medicine availability
  · Test availability
  · Estimated distance
```

---

## 7. Offline Sync

```
isOnline = false (toggled manually or detected via navigator.onLine)
   │
   ▼
All writes queued in localStorage (swasthya_setu_offline_queue_v2)
   │
   ▼
isOnline restored → syncOfflineRecords() called
  For each queued operation:
    POST/PUT /api/* to backend
    Remove from queue on success
```

---

## API Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Role-based login |
| `GET` | `/api/patients` | List all patients |
| `POST` | `/api/patients` | Register new patient |
| `PUT` | `/api/patients/:id` | Update patient |
| `GET` | `/api/appointments` | List appointments |
| `POST` | `/api/appointments` | Book appointment |
| `PUT` | `/api/appointments/:id/status` | Update appointment status |
| `GET` | `/api/referrals` | List referrals |
| `POST` | `/api/referrals` | Create referral |
| `PUT` | `/api/referrals/:id/status` | Update referral status |
| `GET` | `/api/triages` | List triage records |
| `POST` | `/api/triages` | Submit triage assessment |
| `GET` | `/api/followups` | List follow-ups |
| `PUT` | `/api/followups/:id/complete` | Complete follow-up |
| `GET` | `/api/facilities` | List PHC facilities |
| `GET` | `/api/stocks` | Medicine stock levels |
| `GET` | `/api/notifications` | User notifications |
| `GET` | `/api/dashboard/:role` | Role-specific stats |

---

## Data Persistence Layers (in priority order)

1. **Express `db.json`** — Primary server-side store (flat JSON file)
2. **Firestore** — Optional cloud sync for patient records and audit logs
3. **localStorage** — Offline cache and offline write queue

---

*Generated: 2026-08-25 | SwasthGram — SIH 2026*
