/**
 * SwasthGram — Centralized API Client
 *
 * During development the Vite dev server proxies all /api/* requests to the
 * Express backend running on http://localhost:5000 (see vite.config.ts).
 *
 * In production, set VITE_API_URL to your deployed backend base URL.
 * The proxy is not needed in production because the build is served from the
 * same origin as the backend (or CORS is configured on the server).
 */

// Base URL resolves to '' in development (proxy handles routing),
// and to the explicit VITE_API_URL in production builds.
const BASE =
  import.meta.env.MODE === 'development'
    ? ''
    : (import.meta.env.VITE_API_URL ?? 'http://localhost:5000');

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`API ${options.method ?? 'GET'} ${path} → ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

const get  = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });
const put  = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
const del  = <T>(path: string) =>
  request<T>(path, { method: 'DELETE' });

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginResponse {
  success: boolean;
  user?: Record<string, unknown>;
  role?: string;
  message?: string;
}

export const authApi = {
  /** Authenticate with role, identifier (OTP/ID), and OTP code */
  login: (role: string, identifier: string, otp: string) =>
    post<LoginResponse>('/api/auth/login', { role, identifier, otp }),
};

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

export const patientsApi = {
  /** Fetch all registered patients */
  getAll: () => get<unknown[]>('/api/patients'),

  /** Fetch a single patient by ID */
  getById: (id: string) => get<unknown>(`/api/patients/${id}`),

  /** Register a new patient */
  create: (data: Record<string, unknown>) =>
    post<unknown>('/api/patients', data),

  /** Update patient record */
  update: (id: string, data: Record<string, unknown>) =>
    put<unknown>(`/api/patients/${id}`, data),
};

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export const appointmentsApi = {
  getAll: () => get<unknown[]>('/api/appointments'),
  create: (data: Record<string, unknown>) =>
    post<unknown>('/api/appointments', data),
  updateStatus: (id: string, status: string) =>
    put<unknown>(`/api/appointments/${id}/status`, { status }),
};

// ---------------------------------------------------------------------------
// Triage
// ---------------------------------------------------------------------------

export const triageApi = {
  getAll: () => get<unknown[]>('/api/triages'),
  submit: (data: Record<string, unknown>) =>
    post<unknown>('/api/triages', data),
};

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------

export const referralsApi = {
  getAll: () => get<unknown[]>('/api/referrals'),
  create: (data: Record<string, unknown>) =>
    post<unknown>('/api/referrals', data),
  updateStatus: (id: string, status: string, notes?: string) =>
    put<unknown>(`/api/referrals/${id}/status`, { status, notes }),
};

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export const followUpsApi = {
  getAll: () => get<unknown[]>('/api/followups'),
  complete: (id: string, outcomeNotes: string) =>
    put<unknown>(`/api/followups/${id}/complete`, { outcomeNotes }),
};

// ---------------------------------------------------------------------------
// Facilities
// ---------------------------------------------------------------------------

export const facilitiesApi = {
  getAll: () => get<unknown[]>('/api/facilities'),
  getById: (id: string) => get<unknown>(`/api/facilities/${id}`),
};

// ---------------------------------------------------------------------------
// Stocks
// ---------------------------------------------------------------------------

export const stocksApi = {
  getAll: () => get<unknown[]>('/api/stocks'),
  update: (id: string, data: Record<string, unknown>) =>
    put<unknown>(`/api/stocks/${id}`, data),
};

// ---------------------------------------------------------------------------
// Dashboard metrics (role-specific summaries)
// ---------------------------------------------------------------------------

export const dashboardApi = {
  /** Fetch role-specific dashboard statistics */
  getStats: (role: 'worker' | 'doctor' | 'official') =>
    get<Record<string, number>>(`/api/dashboard/${role}`),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notificationsApi = {
  getAll: () => get<unknown[]>('/api/notifications'),
  markRead: (id: string) => put<unknown>(`/api/notifications/${id}/read`, {}),
};

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export const auditLogsApi = {
  getAll: () => get<unknown[]>('/api/audit-logs'),
};

// ---------------------------------------------------------------------------
// Test Results
// ---------------------------------------------------------------------------

export const testResultsApi = {
  getAll: () => get<unknown[]>('/api/test-results'),
  getForPatient: (patientId: string) =>
    get<unknown[]>(`/api/test-results?patientId=${patientId}`),
};

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------

export const medicinesApi = {
  getAll: () => get<unknown[]>('/api/medicines'),
};
