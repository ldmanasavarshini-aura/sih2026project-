import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { AccessRestricted } from '../common/AccessRestricted';

interface LayoutProps {
  children: React.ReactNode;
}

// Routes requiring Health Worker edit access
const EDIT_ONLY_PATHS = [
  '/register-patient',
  '/triage',
  '/appointments/book',
  '/referrals/create'
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { role } = useAuth();
  const location = useLocation();

  const isEditPath =
    EDIT_ONLY_PATHS.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.includes('/edit');

  const isAccessRestricted = isEditPath && role !== 'health_worker';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        <Sidebar />

        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
          {isAccessRestricted ? <AccessRestricted /> : children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
