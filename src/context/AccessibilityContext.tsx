import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'normal' | 'lg' | 'xl';

export interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const LOCAL_STORAGE_ACCESSIBILITY_KEY = 'swasthya_setu_accessibility_v1';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSIBILITY_KEY);
    return saved ? JSON.parse(saved).highContrast || false : false;
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSIBILITY_KEY);
    return saved ? JSON.parse(saved).fontSize || 'normal' : 'normal';
  });

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_ACCESSIBILITY_KEY,
      JSON.stringify({ highContrast, fontSize })
    );

    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('font-size-normal', 'font-size-lg', 'font-size-xl');
    root.classList.add(`font-size-${fontSize}`);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const setFontSize = (size: FontSize) => setFontSizeState(size);

  return (
    <AccessibilityContext.Provider value={{ highContrast, fontSize, toggleHighContrast, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
