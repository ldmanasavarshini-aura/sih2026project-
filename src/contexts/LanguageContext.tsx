import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function getTranslationValue(obj: any, path: string): string | null {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('swasthgram-lang');
    if (saved === 'en' || saved === 'mr' || saved === 'hi' || saved === 'ta') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swasthgram-lang', lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    let value = getTranslationValue(translations[language], key);
    if (value === null) {
      // Fallback to English
      value = getTranslationValue(translations['en'], key);
    }
    if (value === null) {
      return key;
    }
    if (variables) {
      let temp = value;
      Object.entries(variables).forEach(([k, v]) => {
        temp = temp.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
      return temp;
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
