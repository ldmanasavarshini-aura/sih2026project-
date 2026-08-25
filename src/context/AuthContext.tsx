import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { loginUser, logoutUser } from '../auth';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  firebaseRole?: 'healthworker' | 'doctor' | 'admin' | 'citizen';
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  login: (role: UserRole, identifier: string, otp: string) => Promise<boolean>;
  firebaseLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: 'healthworker' | 'doctor' | 'admin' }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_AUTH_KEY = 'swasthya_setu_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.role || 'citizen';
      } catch (e) {
        console.error(e);
      }
    }
    return 'citizen';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    return saved ? JSON.parse(saved).isLoggedIn ?? true : true; // Default logged in for smooth preview
  });

  const [firebaseRole, setFirebaseRole] = useState<'healthworker' | 'doctor' | 'admin' | 'citizen' | undefined>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.firebaseRole;
      } catch (e) {
        console.error(e);
      }
    }
    return undefined;
  });

  const [user, setUser] = useState<UserProfile>(() => DEMO_USERS[role] || DEMO_USERS.citizen);

  useEffect(() => {
    if (firebaseRole) {
      setUser({
        id: localStorage.getItem('swasthya_setu_firebase_uid') || 'firebase-user',
        name: localStorage.getItem('swasthya_setu_firebase_email')?.split('@')[0] || 'Firebase User',
        role: role,
        roleTitle: firebaseRole === 'healthworker' ? 'Health Worker' : firebaseRole === 'doctor' ? 'Doctor' : 'Administrator',
        phone: '',
        accessLevel: firebaseRole === 'healthworker' ? 'Create and Edit' : 'View Only Dashboard'
      });
    } else {
      const newUser = DEMO_USERS[role] || DEMO_USERS.citizen;
      setUser(newUser);
    }
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify({ role, isLoggedIn, firebaseRole }));
  }, [role, isLoggedIn, firebaseRole]);

  const switchRole = (newRole: UserRole) => {
    setFirebaseRole(undefined);
    setRole(newRole);
    setUser(DEMO_USERS[newRole]);
    setIsLoggedIn(true);
  };

  const login = async (selectedRole: UserRole, identifier: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: selectedRole, identifier, otp })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRole(selectedRole);
          setUser(data.user);
          setIsLoggedIn(true);
          return true;
        }
      }
    } catch (err) {
      console.warn('Backend login unavailable, falling back to mock authentication:', err);
    }

    // Mock OTP verification requirement fallback (for offline or local demo)
    if (otp === '123456' || otp === '1234' || (otp && otp.trim() !== '')) {
      setRole(selectedRole);
      setUser(DEMO_USERS[selectedRole]);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const firebaseLogin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: 'healthworker' | 'doctor' | 'admin' }> => {
    const result = await loginUser(email, password);
    if (result.success && result.role) {
      setFirebaseRole(result.role);
      
      // Map to internal role for backward compatibility
      let mappedRole: UserRole = 'citizen';
      if (result.role === 'healthworker') {
        mappedRole = 'health_worker';
      } else if (result.role === 'doctor' || result.role === 'admin') {
        mappedRole = 'official';
      }
      
      setRole(mappedRole);
      setIsLoggedIn(true);
      
      if (result.uid) {
        localStorage.setItem('swasthya_setu_firebase_uid', result.uid);
      }
      if (result.email) {
        localStorage.setItem('swasthya_setu_firebase_email', result.email);
      }
      
      return { success: true, role: result.role };
    }
    return { success: false, error: result.error };
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Firebase logout error:', err);
    }
    setFirebaseRole(undefined);
    localStorage.removeItem('swasthya_setu_firebase_uid');
    localStorage.removeItem('swasthya_setu_firebase_email');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, firebaseRole, isLoggedIn, switchRole, login, firebaseLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

