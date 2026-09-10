"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, DICTIONARIES } from "./dictionaries";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof DICTIONARIES["en"];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("careeris_locale") as Locale | null;
    if (saved && (saved === "en" || saved === "hi")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("careeris_locale", newLocale);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: DICTIONARIES[locale] || DICTIONARIES.en,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
