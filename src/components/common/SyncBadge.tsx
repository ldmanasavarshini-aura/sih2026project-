import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { useAuth } from '../../context/AuthContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SyncBadge: React.FC = () => {
  const { isOnline, pendingSyncCount, toggleOnlineStatus, syncOfflineRecords } = useHealthData();
  const { role } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      syncOfflineRecords();
      setSyncing(false);
      setToastMessage('Records synced securely with central database.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-teal-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Online / Offline status badge */}
      <button
        onClick={role === 'health_worker' ? toggleOnlineStatus : undefined}
        title={role === 'health_worker' ? 'Click to simulate Online / Offline toggle' : `Status: ${isOnline ? 'Online' : 'Offline'}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
        }`}
      >
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        )}
        <span className="hidden xs:inline">{isOnline ? 'Online' : 'Offline'}</span>
      </button>

      {/* Pending Sync Count & Action for Health Worker */}
      {pendingSyncCount > 0 && (
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-medium">
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 shrink-0 ${syncing ? 'animate-spin' : ''}`} />
          <span>
            {pendingSyncCount} pending {pendingSyncCount === 1 ? 'record' : 'records'}
          </span>

          {role === 'health_worker' && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="ml-1 px-2 py-0.5 bg-blue-600 text-white rounded-md text-[11px] font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-2xs"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
