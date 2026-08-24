import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  login: (role: UserRole, identifier: string, otp: string) => boolean;
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

  const [user, setUser] = useState<UserProfile>(() => DEMO_USERS[role] || DEMO_USERS.citizen);

  useEffect(() => {
    const newUser = DEMO_USERS[role] || DEMO_USERS.citizen;
    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify({ role, isLoggedIn }));
  }, [role, isLoggedIn]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(DEMO_USERS[newRole]);
    setIsLoggedIn(true);
  };

  const login = (selectedRole: UserRole, identifier: string, otp: string): boolean => {
    // Mock OTP verification requirement: 123456
    if (otp === '123456' || otp === '1234' || otp.trim() !== '') {
      setRole(selectedRole);
      setUser(DEMO_USERS[selectedRole]);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, switchRole, login, logout }}>
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
