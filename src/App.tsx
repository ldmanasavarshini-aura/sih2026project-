import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { HealthDataProvider } from './context/HealthDataContext';

import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { HelpMatrixPage } from './pages/HelpMatrixPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MyHealthRecord } from './pages/citizen/MyHealthRecord';
import { CitizenAppointments } from './pages/citizen/Appointments';
import { CitizenReferrals } from './pages/citizen/Referrals';
import { CitizenTestResults } from './pages/citizen/TestResults';
import { CitizenMedicines } from './pages/citizen/Medicines';
import { CitizenFollowUps } from './pages/citizen/FollowUps';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Health Worker Pages
import { WorkerDashboard } from './pages/healthworker/WorkerDashboard';
import { PatientList } from './pages/healthworker/PatientList';
import { RegisterPatient } from './pages/healthworker/RegisterPatient';
import { PatientDetail } from './pages/healthworker/PatientDetail';
import { TriagePage } from './pages/healthworker/TriagePage';
import { AppointmentsPage } from './pages/healthworker/AppointmentsPage';
import { ReferralsPage } from './pages/healthworker/ReferralsPage';
import { FollowUpsPage } from './pages/healthworker/FollowUpsPage';
import { ServicesPage } from './pages/healthworker/ServicesPage';

// Higher Official Pages
import { OfficialDashboard } from './pages/official/OfficialDashboard';
import { FacilityPerformance } from './pages/official/FacilityPerformance';
import { ReferralAnalytics } from './pages/official/ReferralAnalytics';
import { HighRiskMonitoring } from './pages/official/HighRiskMonitoring';
import { StockMonitoring } from './pages/official/StockMonitoring';
import { ReportsPage } from './pages/official/ReportsPage';

// Dashboard Dispatcher component based on active role
const DynamicDashboard: React.FC = () => {
  const { role } = useAuth();
  if (role === 'citizen') return <CitizenDashboard />;
  if (role === 'health_worker') return <WorkerDashboard />;
  return <OfficialDashboard />;
};

// Dynamic Appointments Page based on role
const DynamicAppointments: React.FC = () => {
  const { role } = useAuth();
  if (role === 'citizen') return <CitizenAppointments />;
  return <AppointmentsPage />;
};

// Dynamic Referrals Page based on role
const DynamicReferrals: React.FC = () => {
  const { role } = useAuth();
  if (role === 'citizen') return <CitizenReferrals />;
  if (role === 'official') return <ReferralAnalytics />;
  return <ReferralsPage />;
};

// Dynamic Follow-ups Page based on role
const DynamicFollowUps: React.FC = () => {
  const { role } = useAuth();
  if (role === 'citizen') return <CitizenFollowUps />;
  return <FollowUpsPage />;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Main Protected Routes wrapped in Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="dashboard" element={<DynamicDashboard />} />
              <Route path="help-matrix" element={<HelpMatrixPage />} />

              {/* Citizen Routes */}
              <Route path="my-health-record" element={<MyHealthRecord />} />
              <Route path="appointments" element={<DynamicAppointments />} />
              <Route path="referrals" element={<DynamicReferrals />} />
              <Route path="test-results" element={<CitizenTestResults />} />
              <Route path="medicines" element={<CitizenMedicines />} />
              <Route path="follow-ups" element={<DynamicFollowUps />} />
              <Route path="profile" element={<CitizenProfile />} />

              {/* Health Worker Routes */}
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="register-patient" element={<RegisterPatient />} />
              <Route path="triage" element={<TriagePage />} />
              <Route path="appointments/book" element={<AppointmentsPage />} />
              <Route path="referrals/create" element={<ReferralsPage />} />
              <Route path="services" element={<ServicesPage />} />

              {/* Official Routes */}
              <Route path="facilities" element={<FacilityPerformance />} />
              <Route path="high-risk" element={<HighRiskMonitoring />} />
              <Route path="stocks" element={<StockMonitoring />} />
              <Route path="reports" element={<ReportsPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <HealthDataProvider>
            <Router>
              <AppContent />
            </Router>
          </HealthDataProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
