import { create } from "zustand";
import {
  AccentColor,
  ACCENT_COLORS_LIGHT,
  ACCENT_COLORS_DARK,
  DEFAULT_ACCENT_COLOR,
  ColorValues,
} from "./colors";

const ACCENT_STORAGE_KEY = "app-accent-color";

interface AccentColorStore {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  loadAccentFromStorage: () => void;
}

function isValidAccentColor(color: string): color is AccentColor {
  return ["red", "rose", "orange", "green", "blue", "yellow", "purple"].includes(color);
}

function applyAccentColor(color: AccentColor) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const colors: ColorValues = isDark ? ACCENT_COLORS_DARK[color] : ACCENT_COLORS_LIGHT[color];

  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);
  root.style.setProperty("--ring", colors.ring);
  root.style.setProperty("--sidebar-accent", colors.sidebarAccent);
  root.style.setProperty("--sidebar-ring", colors.sidebarRing);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
}

export const useAccentColorStore = create<AccentColorStore>((set, get) => ({
  accentColor: DEFAULT_ACCENT_COLOR,

  setAccentColor: (accentColor: AccentColor) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCENT_STORAGE_KEY, accentColor);
      applyAccentColor(accentColor);
    }
    set({ accentColor });
  },

  loadAccentFromStorage: () => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (saved && isValidAccentColor(saved)) {
      set({ accentColor: saved });
      applyAccentColor(saved);
    }
  },
}));

export { applyAccentColor };
export type { AccentColor };
export { ACCENT_COLOR_NAMES, DEFAULT_ACCENT_COLOR } from "./colors";
