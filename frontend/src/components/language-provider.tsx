"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { loadLanguageFromStorage } = useLanguageStore();

  useEffect(() => {
    loadLanguageFromStorage();
  }, [loadLanguageFromStorage]);

  return <>{children}</>;
}
