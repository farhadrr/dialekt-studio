import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/i18n";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem("ds_lang") || "ar");

  const dir = lang === "en" ? "ltr" : "rtl";

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("ds_lang", lang);
  }, [lang, dir]);

  const setLang = (l) => setLangState(l);
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
  const tf = (obj) => (obj && obj[lang]) || (obj && obj.en) || "";

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t, tf }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
