# SwasthGram 🌿

> **Rural Healthcare Management Platform** — Smart India Hackathon 2026

SwasthGram is a full-stack progressive web application designed to digitize rural healthcare delivery in India. It connects ASHA workers, doctors, and health officials on a single platform — with offline-first support for low-connectivity regions.

---

## Live Demo

| Role | Login | OTP |
|---|---|---|
| Patient / Citizen | Select "Citizen" role | Any non-empty OTP |
| Health Worker (ASHA) | Select "Health Worker" | `1234` or `123456` |
| Doctor | Select "Doctor" | `1234` or `123456` |
| Health Official | Select "Official" | `1234` or `123456` |

---

## Features

### 👩‍⚕️ ASHA / Health Worker
- **Patient Registration** — Register new patients with demographic info, generate unique Patient IDs
- **Digital Triage** — Search patients, view health profiles, select symptoms, assess urgency levels (Emergency / Urgent / Routine), get recommended referral facilities
- **Appointments** — Book and manage patient appointments (in-person & teleconsultation)
- **Referrals** — Create and track referrals to district hospitals
- **Follow-ups** — Track overdue follow-up visits, send SMS reminders
- **Diagnostics** — Record test results and vitals

### 🩺 Doctor
- **Teleconsultation** — Video-based remote consultations
- **Patient View** — Full patient clinical history, medications, test results
- **Consultation Notes** — Record diagnosis, prescriptions, follow-up plans

### 🏛️ Health Official
- **District Dashboard** — Village-level risk heat map (Maharashtra Map)
- **Facility Performance** — PHC doctor counts, patient loads, stock alerts
- **Referral Analytics** — Pending, completed, and urgent referral tracking
- **Stock Monitoring** — Medicine and equipment availability across clinics
- **Disease Trends** — Outbreak patterns across districts

### 🧑‍🤝‍🧑 Citizen / Patient
- Personal health record
- Appointment history
- Referral status
- Medicine prescriptions
- Follow-up schedule

### 🗺️ Clinic Map
- Interactive Leaflet map with CartoDB Voyager tiles (no API key required)
- Color-coded PHC pins (Green = Operational, Orange = Understaffed, Red = Critical)
- Clinic popups with medicines, tests, distance

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| React Router | 7 | Client-side routing |
| TailwindCSS | 4 | Utility-first CSS |
| Leaflet | 1.9 | Interactive clinic map |
| Lucide React | — | Icons |
| Recharts | — | Analytics charts |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4 | REST API server |
| `db.json` | — | Flat-file database |
| Firebase / Firestore | 12 | Cloud auth + data sync |

### Build & Tooling
| Tool | Purpose |
|---|---|
| Vite | Dev server + bundler |
| oxlint | Fast linter |
| oxfmt | Formatter |

---

## Project Structure

```
sih2026project/
├── server/
│   ├── server.js          # Express backend (REST API)
│   └── db.json            # Flat-file database
│
├── src/
│   ├── api/
│   │   └── client.ts      # Centralized API client (all fetch calls)
│   │
│   ├── context/
│   │   ├── AuthContext.tsx        # Login / logout / role state
│   │   └── HealthDataContext.tsx  # Global health data + offline sync
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MaharashtraMapPage.tsx
│   │   ├── citizen/               # Patient-facing pages
│   │   ├── healthworker/          # ASHA worker pages
│   │   ├── doctor/                # Doctor pages
│   │   └── official/              # Health official pages
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── ClinicMap.tsx      # Leaflet map component
│   │   └── layout/                # Header, Sidebar, BottomNav
│   │
│   ├── data/
│   │   ├── mock.ts               # Triage symptoms, demo patients
│   │   └── mockData.ts           # INITIAL_* seed data
│   │
│   ├── App.tsx                   # Root with React Router routes
│   └── main.tsx                  # Entry point
│
├── vite.config.ts                # Vite config + /api proxy to port 5000
├── .env                          # Environment variables
├── workflow.md                   # System data-flow documentation
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/ldmanasavarshini-aura/sih2026project-.git
cd sih2026project-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Edit `.env` in the project root:

```env
# Required for Firestore (optional — app works offline without this)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI (optional — for AI risk scoring)
VITE_GEMINI_API_KEY=your_gemini_key

# Backend URL (default: localhost:5000, proxied automatically in dev)
VITE_API_URL=http://localhost:5000
```

### 4. Start the backend server

```bash
npm run server
# Express backend starts on http://localhost:5000
```

### 5. Start the frontend dev server

```bash
npm run dev
# Vite dev server starts on http://localhost:8443
# All /api/* requests are automatically proxied to port 5000
```

### 6. Open in browser

```
http://localhost:8443
```

---

## Running Both Servers Together

Install `concurrently`:

```bash
npm install -D concurrently
```

Add to `package.json`:

```json
"dev:full": "concurrently \"npm run server\" \"npm run dev\""
```

Then:

```bash
npm run dev:full
```

---

## How Frontend Connects to Backend

The connection is handled via a **Vite dev proxy** configured in [`vite.config.ts`](./vite.config.ts):

```ts
proxy: {
  '/api': {
    target: 'http://localhost:5000',   // Express backend
    changeOrigin: true,
    secure: false,
  },
}
```

All API calls in the frontend use **relative paths** (`/api/patients`, `/api/auth/login`, etc.) — Vite forwards them to the Express server automatically during development.

The centralized API client at [`src/api/client.ts`](./src/api/client.ts) wraps all fetch calls with consistent error handling and typing. Import from there in any component:

```ts
import { patientsApi, triageApi } from '@/api/client';

const patients = await patientsApi.getAll();
await triageApi.submit({ patientId: 'P-1001', symptoms: ['Fever'] });
```

---

## API Reference

See [`workflow.md`](./workflow.md#api-endpoint-summary) for the full endpoint table.

---

## Offline Support

SwasthGram is built for low-connectivity rural environments:

- All data is cached in **localStorage** on load
- Write operations (patient registration, triage, referrals) are queued when offline
- The queue syncs automatically when connectivity is restored
- Use the **Online/Offline toggle** in the header to simulate offline mode

---

## Branches

| Branch | Contents |
|---|---|
| `main` | Production-ready merged code |
| `backend` | Digital Triage workflow + Leaflet ClinicMap + Patient signup |
| `frontend` | Frontend feature development branch |

---

## Team

**Team Aura — KMIT, Hyderabad**  
Smart India Hackathon 2026

---

## License

MIT
