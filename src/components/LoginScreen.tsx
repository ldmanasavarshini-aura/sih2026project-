import { useState } from 'react';
import { Stethoscope, UserCheck, ShieldCheck, User, ArrowRight, Heart, Globe, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import type { UserSession, Role } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { loginUser } from '../auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { patients } from '../data/mock';

interface RoleOption {
  id: Role;
  label: string;
  sublabel: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  defaultUser: { name: string; id: string; clinic?: string; patientId?: string };
}

interface Props {
  onLogin: (session: UserSession) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState<Role | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Patient registration states
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [regSuccessUser, setRegSuccessUser] = useState<any>(null);

  const roles: RoleOption[] = [
    {
      id: 'health-worker',
      label: t('login.roles.healthWorker'),
      sublabel: t('login.roles.healthWorkerSub'),
      description: t('login.roles.healthWorkerDesc'),
      icon: <UserCheck size={22} />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      defaultUser: { name: 'Anita Jadhav', id: 'HW-001', clinic: 'Wada' },
    },
    {
      id: 'doctor',
      label: t('login.roles.doctor'),
      sublabel: t('login.roles.doctorSub'),
      description: t('login.roles.doctorDesc'),
      icon: <Stethoscope size={22} />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      defaultUser: { name: 'Dr. Meera Joshi', id: 'DOC-001', clinic: 'Thane Civil Hospital' },
    },
    {
      id: 'admin',
      label: t('login.roles.admin'),
      sublabel: t('login.roles.adminSub'),
      description: t('login.roles.adminDesc'),
      icon: <ShieldCheck size={22} />,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      defaultUser: { name: 'Rajendra Kulkarni', id: 'ADM-001', clinic: 'Thane District' },
    },
    {
      id: 'patient',
      label: t('login.roles.patient'),
      sublabel: t('login.roles.patientSub'),
      description: t('login.roles.patientDesc'),
      icon: <User size={22} />,
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      defaultUser: { name: 'Sunita Thorat', id: 'PAT-001', patientId: 'MH-2024-001' },
    },
  ];

  const selectedRole = roles.find(r => r.id === selected);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;

    if (selected === 'patient') {
      if (!userId) {
        setError('Please enter your Patient ID.');
        return;
      }
      setError(null);
      setLoading(true);
      
      let foundPatient: any = null;
      
      try {
        // Query Users collection in Firestore
        const q = query(collection(db, 'Users'), where('patientId', '==', userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          foundPatient = {
            id: userDoc.patientId || userId,
            name: userDoc.name || 'Patient User',
            patientId: userDoc.patientId || userId
          };
          console.log('Successfully authenticated patient via Firestore Users collection');
        }
      } catch (firestoreErr) {
        console.warn('Firestore query failed, falling back to local list:', firestoreErr);
      }
      
      // Fallback: search in local mock patients list
      if (!foundPatient) {
        const local = patients.find(p => p.id === userId || p.name.toLowerCase() === userId.toLowerCase());
        if (local) {
          foundPatient = {
            id: local.id,
            name: local.name,
            patientId: local.id
          };
          console.log('Successfully authenticated patient via local mock database');
        }
      }
      
      if (foundPatient) {
        onLogin({
          role: 'patient',
          name: foundPatient.name,
          id: foundPatient.id,
          patientId: foundPatient.patientId
        });
        setLoading(false);
        return;
      } else {
        setError('Patient ID not found. If you are a new patient, click "New patient? Create Account" inside the Patient role card.');
        setLoading(false);
        return;
      }
    }

    if (!userId || !password) {
      setError('Please enter both username/email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(userId, password);
      if (res.success) {
        let mappedRole: Role = 'patient';
        if (res.role === 'healthworker') mappedRole = 'health-worker';
        else if (res.role === 'doctor') mappedRole = 'doctor';
        else if (res.role === 'admin') mappedRole = 'admin';

        onLogin({
          role: mappedRole,
          name: res.email?.split('@')[0] || selectedRole.defaultUser.name,
          id: res.uid || selectedRole.defaultUser.id,
          clinic: selectedRole.defaultUser.clinic,
          patientId: selectedRole.defaultUser.patientId,
        });
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e?: React.FormEvent | React.MouseEvent) {
    console.log('handleRegister triggered', { regName, regAge, regVillage, regPhone });
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!regName.trim() || !regAge.trim() || !regVillage.trim()) {
      setError('Please fill in all required fields (Name, Age, Village).');
      return;
    }
    setError(null);
    setLoading(true);

    const generatedId = `SS-PT-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // 1. Save to Firestore with a 1.5-second timeout to prevent hanging on dummy credentials
      const firestorePromise = addDoc(collection(db, 'Users'), {
        patientId: generatedId,
        name: regName,
        age: Number(regAge),
        village: regVillage,
        phone: regPhone || '',
        role: 'patient'
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 1500)
      );

      try {
        await Promise.race([firestorePromise, timeoutPromise]);
        console.log('Successfully registered patient in Firestore:', generatedId);
      } catch (firestoreErr: any) {
        console.error('Firestore storage failed or timed out:', firestoreErr);
      }

      // 2. Sync to local JSON server/API to make it visible to health worker list/dashboard
      try {
        const res = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: generatedId,
            name: regName,
            age: Number(regAge),
            village: regVillage,
            phone: regPhone || '',
            gender: 'Female', // Default placeholder
            riskLevel: 'Green',
            riskReason: 'Self Registered',
            latestVitals: {
              bp: '120/80',
              temp: '98.6°F',
              heartRate: 72,
              spO2: 98,
              recordedAt: new Date().toLocaleString(),
              recordedBy: regName
            }
          })
        });
        if (res.ok) {
          console.log('Successfully synced patient with local JSON server');
        }
      } catch (apiErr) {
        console.warn('Backend server registration sync unavailable. Storing locally only.');
      }

      // Also add to local import map of patients as a runtime backup
      patients.unshift({
        id: generatedId,
        name: regName,
        age: Number(regAge),
        village: regVillage,
        phone: regPhone || null,
        type: 'general',
        lastVisit: new Date().toISOString().split('T')[0],
        condition: 'Self Registered Patient',
        riskLevel: 'low',
        bloodGroup: 'O+',
        weight: '—',
        bp: '120/80'
      });

      // 3. Set success state
      setRegisteredId(generatedId);
      setRegSuccessUser({
        name: regName,
        id: generatedId,
        patientId: generatedId
      });
      
      // Clear fields
      setRegName('');
      setRegAge('');
      setRegVillage('');
      setRegPhone('');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleRegSuccessLogin() {
    if (regSuccessUser) {
      onLogin({
        role: 'patient',
        name: regSuccessUser.name,
        id: regSuccessUser.id,
        patientId: regSuccessUser.patientId
      });
    }
  }

  function handleDemoLogin(role: RoleOption) {
    const u = role.defaultUser;
    onLogin({
      role: role.id,
      name: u.name,
      id: u.id,
      clinic: u.clinic,
      patientId: u.patientId,
    });
  }

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#1C3A5E] via-[#1e4976] to-[#0891B2] flex flex-col items-center justify-center p-4 relative">
      
      {/* Floating Language Dropdown Selector */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white hover:bg-white/20 transition-all select-none">
        <Globe size={14} className="text-white/80" />
        <select 
          value={language} 
          onChange={e => setLanguage(e.target.value as any)}
          className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none cursor-pointer outline-none [appearance:none] pr-4 relative"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', 
            backgroundPosition: 'right center', 
            backgroundRepeat: 'no-repeat', 
            backgroundSize: '1.2em' 
          }}
        >
          <option value="en" className="text-slate-900 bg-white">English</option>
          <option value="mr" className="text-slate-900 bg-white">मराठी</option>
          <option value="hi" className="text-slate-900 bg-white">हिन्दी</option>
          <option value="ta" className="text-slate-900 bg-white">தமிழ்</option>
        </select>
      </div>

      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <Heart size={16} className="text-red-300 fill-red-300" />
            <span className="text-white/80 text-sm font-medium tracking-wide">{t('common.govMaharashtraTag')}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Fraunces, serif' }}>
            {t('common.title')}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {t('login.selectRoleDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Role Cards */}
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3 ml-1">{t('login.selectRole')}</p>
            <div className="grid grid-cols-1 gap-3">
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelected(role.id);
                    setShowRegister(false);
                    setRegisteredId(null);
                    setError(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                    selected === role.id
                      ? 'bg-white border-white shadow-lg scale-[1.01]'
                      : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selected === role.id ? role.bg : 'bg-white/20'}`}>
                      <span className={selected === role.id ? role.color : 'text-white'}>
                        {role.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-base ${selected === role.id ? 'text-slate-900' : 'text-white'}`}>{role.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected === role.id ? role.bg + ' ' + role.color : 'bg-white/20 text-white/70'}`}>{role.sublabel}</span>
                      </div>
                      <p className={`text-sm mt-0.5 leading-snug ${selected === role.id ? 'text-slate-500' : 'text-white/60'}`}>{role.description}</p>
                      
                      {role.id === 'patient' && (
                        <div className="mt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected('patient');
                              setShowRegister(true);
                              setRegisteredId(null);
                              setError(null);
                            }}
                            className={`text-xs font-bold underline transition-all ${
                              selected === 'patient'
                                ? 'text-orange-700 hover:text-orange-950'
                                : 'text-orange-300 hover:text-orange-200'
                            }`}
                          >
                            New patient? Create Account
                          </button>
                        </div>
                      )}
                    </div>
                    {selected === role.id && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${role.bg}`}>
                        <span className={`text-xs ${role.color}`}>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3 ml-1">{t('login.signIn')}</p>
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              {!selected ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <ArrowRight size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">{t('login.selectRolePrompt')}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('login.selectRoleDescLeft')}</p>
                </div>
              ) : registeredId ? (
                // Success screen view
                <div className="text-center py-6 space-y-5 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Registration Successful!</h3>
                    <p className="text-sm text-slate-500 mt-1">Your new patient account has been created.</p>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-xs mx-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Patient ID</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-wide mt-1 block select-all">
                      {registeredId}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">Please note this ID down. You will use it to log in next time.</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleRegSuccessLogin}
                      className="w-full bg-[#1C3A5E] hover:bg-[#132845] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      Log In & Go to Dashboard <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRegisteredId(null);
                        setShowRegister(false);
                        setUserId(registeredId || '');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium block mx-auto underline transition-colors cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              ) : showRegister ? (
                // Registration form view
                <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-1.5 bg-orange-50 text-orange-700">
                    <UserPlus size={18} />
                    <span>Create Patient Account</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Patient Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Age (Years) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={regAge}
                          onChange={e => setRegAge(e.target.value)}
                          placeholder="e.g. 28"
                          min="0"
                          max="125"
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Village <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={regVillage}
                          onChange={e => setRegVillage(e.target.value)}
                          placeholder="e.g. Wada"
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'} <Sparkles size={15} />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegister(false);
                        setError(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium block mx-auto underline transition-colors cursor-pointer"
                    >
                      Cancel & Return to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                // Standard login form
                <form onSubmit={handleLogin}>
                  <div className="mb-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${selectedRole!.bg} ${selectedRole!.color}`}>
                      {selectedRole!.icon}
                      <span>{selectedRole!.label} {t('login.signIn')}</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {selected === 'patient' ? t('login.usernamePatient') : t('login.usernameStaff')}
                        </label>
                        <input
                          type="text"
                          value={userId}
                          onChange={e => setUserId(e.target.value)}
                          placeholder={selected === 'patient' ? t('login.placeholderPatient') : t('login.placeholderStaff', { staffId: selectedRole!.defaultUser.id })}
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                      {selected !== 'patient' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('login.password')}</label>
                          <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={t('login.placeholderPassword')}
                            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C3A5E] hover:bg-[#132845] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3 cursor-pointer"
                  >
                    {loading ? 'Signing in...' : t('login.signIn')} <ArrowRight size={16} />
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center"><span className="px-3 bg-white text-slate-400 text-xs">{t('common.or')}</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin(selectedRole!)}
                    className={`w-full border-2 font-semibold py-2.5 rounded-lg transition-colors text-sm cursor-pointer ${selectedRole!.border} ${selectedRole!.color} hover:${selectedRole!.bg}`}
                  >
                    {t('login.demoButton', { name: selectedRole!.defaultUser.name })}
                  </button>

                  {selected === 'patient' && (
                    <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                      {t('login.patientLoginHint')}
                    </p>
                  )}
                </form>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-center text-xs text-slate-400">
                  {t('common.govMaharashtra')} &bull; NHM Digital Health Platform &bull; SIH26133
                </p>
              </div>
            </div>

            {/* Quick demo buttons */}
            <div className="mt-4">
              <p className="text-white/50 text-xs text-center mb-2">{t('login.quickDemoAccess')}</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleDemoLogin(role)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
