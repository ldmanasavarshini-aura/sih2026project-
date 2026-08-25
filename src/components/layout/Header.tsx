import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useAccessibility, FontSize } from '../../context/AccessibilityContext';
import { useHealthData } from '../../context/HealthDataContext';
import { RoleBadge } from '../common/RoleBadge';
import { SyncBadge } from '../common/SyncBadge';
import {
  HeartHandshake,
  Globe,
  Sun,
  Moon,
  Type,
  Bell,
  User,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Siren,
  ChevronDown,
  X,
  UserCog
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { highContrast, toggleHighContrast, fontSize, setFontSize } = useAccessibility();
  const { notifications, markNotificationRead, completeNotificationTask } = useHealthData();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoSwitchModal, setShowDemoSwitchModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  // Filter notifications relevant to current role
  const roleNotifications = notifications.filter(
    (n) => n.forRole === 'all' || n.forRole === role
  );
  const unreadCount = roleNotifications.filter((n) => !n.isRead).length;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleDemoSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowDemoSwitchModal(false);
    setShowProfileMenu(false);
    navigate('/dashboard');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:bg-teal-800 transition-all">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-teal-900 tracking-tight">
                {t('app_name')}
              </span>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                NHM Rural
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block leading-none font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Center: Role Badge & Sync Status Badge */}
        <div className="flex items-center gap-2">
          <RoleBadge role={role} />
          <SyncBadge />
        </div>

        {/* Right Controls: Language, Accessibility, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 rounded-lg px-2 py-1 border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Accessibility Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              title="Accessibility Settings (High Contrast & Font Size)"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all"
            >
              <Type className="w-4 h-4" />
            </button>

            {showAccessibilityMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900">Accessibility Preferences</span>
                  <button
                    onClick={() => setShowAccessibilityMenu(false)}
                    className="p-1 rounded text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    {highContrast ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    {t('high_contrast')}
                  </span>
                  <button
                    onClick={toggleHighContrast}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      highContrast ? 'bg-teal-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size Selector */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1.5">
                    {t('font_size')}
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    {(['normal', 'lg', 'xl'] as FontSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`py-1 rounded text-[11px] font-bold transition-all ${
                          fontSize === size
                            ? 'bg-white text-teal-800 shadow-2xs border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {size === 'normal' ? 'Normal' : size === 'lg' ? 'Large' : 'X-Large'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              title="Global Notification Center"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationsModal && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-sm">
                      {t('notifications')}
                    </span>
                    <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {roleNotifications.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotificationsModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-2">
                  {roleNotifications.length === 0 ? (
                    <p className="text-center text-slate-400 py-6">No new notifications</p>
                  ) : (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-2.5 rounded-xl transition-all my-1 ${
                          !notif.isRead ? 'bg-teal-50/70 border border-teal-100' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex gap-2">
                          {notif.type === 'emergency' ? (
                            <Siren className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-slate-900">{notif.title}</h4>
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>

                            {/* Task Action for Health Workers */}
                            {role === 'health_worker' && notif.actionRequired && (
                              <div className="mt-2 flex justify-end">
                                {notif.actionCompleted ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Completed Task
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      completeNotificationTask(notif.id);
                                    }}
                                    className="text-[11px] font-bold text-white bg-teal-700 hover:bg-teal-800 px-2.5 py-1 rounded-md shadow-2xs"
                                  >
                                    Mark Task Completed
                                  </button>
                                )}
                              </div>
                            )}

                            {(role === 'citizen' || role === 'official') && (
                              <p className="text-[10px] text-slate-400 italic mt-1">Read-only notification</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <span className="font-bold text-xs text-slate-800 hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in text-xs">
                <div className="px-3 py-2 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-slate-500 text-[11px]">{user.roleTitle}</p>
                  {user.patientId && <p className="text-teal-700 font-mono font-bold mt-1">ID: {user.patientId}</p>}
                  {user.facility && <p className="text-slate-600 font-medium">{user.facility}</p>}
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{t('profile')} & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowDemoSwitchModal(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center gap-2 font-bold my-1 border border-teal-200"
                >
                  <UserCheck className="w-4 h-4 text-teal-700" />
                  <span>{t('switch_demo_user')}</span>
                </button>

                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Switch Demo User Modal */}
      {showDemoSwitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowDemoSwitchModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Select Demo User Role</h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantly test SwasthyaSetu permissions across all four user roles.
            </p>

            <div className="space-y-3">
              {/* Citizen Card */}
              <div
                onClick={() => handleDemoSwitch('citizen')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'citizen' ? 'border-teal-700 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:border-teal-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">1. Citizen / Patient User</h4>
                    <p className="text-xs text-teal-800 font-semibold mt-0.5">Lakshmi Devi (ID: SS-PT-10021)</p>
                    <p className="text-[11px] text-slate-500">Village: Kallipalayam | High-Risk ANC Care</p>
                  </div>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                    VIEW ONLY
                  </span>
                </div>
              </div>

              {/* Health Worker Card */}
              <div
                onClick={() => handleDemoSwitch('health_worker')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'health_worker' ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">2. Health Worker (ASHA)</h4>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">Meena R (ASHA Worker)</p>
                    <p className="text-[11px] text-slate-500">Facility: Neelambur PHC | Operational Frontline</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    CREATE + EDIT
                  </span>
                </div>
              </div>

              {/* Doctor Card */}
              <div
                onClick={() => handleDemoSwitch('doctor')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'doctor' ? 'border-violet-600 bg-violet-50/60 shadow-sm' : 'border-slate-200 hover:border-violet-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">3. Doctor</h4>
                    <p className="text-xs text-violet-800 font-semibold mt-0.5">Dr. Arun Kumar (MCI: DR-MCI-4421)</p>
                    <p className="text-[11px] text-slate-500">Facility: Neelambur PHC | Consult & Prescribe</p>
                  </div>
                  <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                    CONSULT + UPDATE
                  </span>
                </div>
              </div>

              {/* Official Card */}
              <div
                onClick={() => handleDemoSwitch('official')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'official' ? 'border-indigo-600 bg-indigo-50/60 shadow-sm' : 'border-slate-200 hover:border-indigo-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">4. Higher Official / Admin</h4>
                    <p className="text-xs text-indigo-800 font-semibold mt-0.5">Priya Deshmukh (District Health Officer)</p>
                    <p className="text-[11px] text-slate-500">District: Coimbatore | Aggregate Monitoring</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    VIEW ANALYTICS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
