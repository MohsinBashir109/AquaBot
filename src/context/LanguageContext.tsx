import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import ur from '../locales/ur.json';

type Locale = 'en' | 'ur';

type Dictionaries = typeof en;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'app_language';

const dictionaries: Record<Locale, Dictionaries> = {
  en,
  ur,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ur') setLocaleState(stored);
    })();
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    await AsyncStorage.setItem(STORAGE_KEY, l);
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale] as any;
    return (key: string, params?: Record<string, string | number>) => {
      const parts = key.split('.');
      let value: any = dict;
      for (const p of parts) {
        value = value?.[p];
        if (value == null) break;
      }
      if (typeof value !== 'string') return key; // fallback to key
      if (params) {
        return Object.keys(params).reduce((acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k])), value);
      }
      return value;
    };
  }, [locale]);

  const ctx: LanguageContextValue = { locale, setLocale, t };
  return <LanguageContext.Provider value={ctx}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};


