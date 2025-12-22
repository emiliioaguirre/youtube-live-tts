"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAccentColorStore, applyAccentColor } from "@/lib/accent-color";

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  const { loadAccentFromStorage, accentColor } = useAccentColorStore();
  const { resolvedTheme } = useTheme();

  // Load accent color from localStorage on mount
  useEffect(() => {
    loadAccentFromStorage();
  }, [loadAccentFromStorage]);

  // Re-apply accent color when theme changes (light/dark)
  useEffect(() => {
    if (resolvedTheme) {
      applyAccentColor(accentColor);
    }
  }, [resolvedTheme, accentColor]);

  return <>{children}</>;
}
