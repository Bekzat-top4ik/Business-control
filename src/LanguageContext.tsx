import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LanguageType, TranslationDictionary } from './translations.js';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof TranslationDictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('saas_language') as LanguageType;
    return (saved === 'en' || saved === 'ru' || saved === 'ky') ? saved : 'ru';
  });

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('saas_language', lang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    const fallbackDict = translations['en'];
    return fallbackDict[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
