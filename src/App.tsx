import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import AppShell from './components/AppShell';
import { LanguageProvider } from './contexts/LanguageContext';

export type Role = 'health-worker' | 'doctor' | 'admin' | 'patient';

export interface UserSession {
  role: Role;
  name: string;
  id: string;
  clinic?: string;
  patientId?: string;
}

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const content = session ? (
    <AppShell session={session} onLogout={() => setSession(null)} onRefresh={() => setUpdateKey(k => k + 1)} />
  ) : (
    <LoginScreen onLogin={setSession} />
  );

  return (
    <LanguageProvider>
      <div className="h-full w-full relative">
        {content}
      </div>
    </LanguageProvider>
  );
}
