import { create } from "zustand";
import { translations, Language, TranslationKey } from "./translations";

const LANGUAGE_STORAGE_KEY = "app-language";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  loadLanguageFromStorage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en",

  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    set({ language });
  },

  loadLanguageFromStorage: () => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved && (saved === "en" || saved === "es")) {
      set({ language: saved });
    } else {
      // detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "es") {
        set({ language: "es" });
      }
    }
  },
}));

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();

  const t = (key: TranslationKey): string => {
    return (translations[language] as Record<TranslationKey, string>)[key] || translations.en[key] || key;
  };

  return { t, language, setLanguage };
}

export { type Language, type TranslationKey } from "./translations";
