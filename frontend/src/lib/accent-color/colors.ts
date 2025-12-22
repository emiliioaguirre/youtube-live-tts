export type AccentColor = "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "purple";

export interface ColorValues {
  accent: string;
  accentForeground: string;
  ring: string;
  sidebarAccent: string;
  sidebarRing: string;
  primary: string;
  primaryForeground: string;
}

export const ACCENT_COLORS_LIGHT: Record<AccentColor, ColorValues> = {
  red: {
    accent: "oklch(0.637 0.237 25.331)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.637 0.237 25.331)",
    sidebarAccent: "oklch(0.936 0.032 17.717)",
    sidebarRing: "oklch(0.637 0.237 25.331)",
    primary: "oklch(0.637 0.237 25.331)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  rose: {
    accent: "oklch(0.645 0.246 16.439)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.645 0.246 16.439)",
    sidebarAccent: "oklch(0.935 0.033 1.107)",
    sidebarRing: "oklch(0.645 0.246 16.439)",
    primary: "oklch(0.645 0.246 16.439)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  orange: {
    accent: "oklch(0.705 0.213 47.604)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.705 0.213 47.604)",
    sidebarAccent: "oklch(0.954 0.038 73.141)",
    sidebarRing: "oklch(0.705 0.213 47.604)",
    primary: "oklch(0.705 0.213 47.604)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  green: {
    accent: "oklch(0.723 0.191 142.495)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.723 0.191 142.495)",
    sidebarAccent: "oklch(0.938 0.062 143.388)",
    sidebarRing: "oklch(0.723 0.191 142.495)",
    primary: "oklch(0.723 0.191 142.495)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  blue: {
    accent: "oklch(0.623 0.214 259.815)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.623 0.214 259.815)",
    sidebarAccent: "oklch(0.932 0.032 255.508)",
    sidebarRing: "oklch(0.623 0.214 259.815)",
    primary: "oklch(0.623 0.214 259.815)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  yellow: {
    accent: "oklch(0.795 0.184 86.047)",
    accentForeground: "oklch(0.205 0 0)",
    ring: "oklch(0.795 0.184 86.047)",
    sidebarAccent: "oklch(0.962 0.064 95.145)",
    sidebarRing: "oklch(0.795 0.184 86.047)",
    primary: "oklch(0.795 0.184 86.047)",
    primaryForeground: "oklch(0.205 0 0)",
  },
  purple: {
    accent: "oklch(0.627 0.265 303.9)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.627 0.265 303.9)",
    sidebarAccent: "oklch(0.943 0.029 294.588)",
    sidebarRing: "oklch(0.627 0.265 303.9)",
    primary: "oklch(0.627 0.265 303.9)",
    primaryForeground: "oklch(0.985 0 0)",
  },
};

export const ACCENT_COLORS_DARK: Record<AccentColor, ColorValues> = {
  red: {
    accent: "oklch(0.704 0.191 22.216)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.704 0.191 22.216)",
    sidebarAccent: "oklch(0.396 0.141 25.723)",
    sidebarRing: "oklch(0.704 0.191 22.216)",
    primary: "oklch(0.704 0.191 22.216)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  rose: {
    accent: "oklch(0.697 0.196 12.282)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.697 0.196 12.282)",
    sidebarAccent: "oklch(0.393 0.145 5.958)",
    sidebarRing: "oklch(0.697 0.196 12.282)",
    primary: "oklch(0.697 0.196 12.282)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  orange: {
    accent: "oklch(0.792 0.178 56.113)",
    accentForeground: "oklch(0.205 0 0)",
    ring: "oklch(0.792 0.178 56.113)",
    sidebarAccent: "oklch(0.468 0.164 42.689)",
    sidebarRing: "oklch(0.792 0.178 56.113)",
    primary: "oklch(0.792 0.178 56.113)",
    primaryForeground: "oklch(0.205 0 0)",
  },
  green: {
    accent: "oklch(0.784 0.155 148.044)",
    accentForeground: "oklch(0.205 0 0)",
    ring: "oklch(0.784 0.155 148.044)",
    sidebarAccent: "oklch(0.448 0.119 151.328)",
    sidebarRing: "oklch(0.784 0.155 148.044)",
    primary: "oklch(0.784 0.155 148.044)",
    primaryForeground: "oklch(0.205 0 0)",
  },
  blue: {
    accent: "oklch(0.707 0.165 254.624)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.707 0.165 254.624)",
    sidebarAccent: "oklch(0.424 0.199 265.638)",
    sidebarRing: "oklch(0.707 0.165 254.624)",
    primary: "oklch(0.707 0.165 254.624)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  yellow: {
    accent: "oklch(0.854 0.155 91.391)",
    accentForeground: "oklch(0.205 0 0)",
    ring: "oklch(0.854 0.155 91.391)",
    sidebarAccent: "oklch(0.476 0.114 66.296)",
    sidebarRing: "oklch(0.854 0.155 91.391)",
    primary: "oklch(0.854 0.155 91.391)",
    primaryForeground: "oklch(0.205 0 0)",
  },
  purple: {
    accent: "oklch(0.714 0.203 305.504)",
    accentForeground: "oklch(0.985 0 0)",
    ring: "oklch(0.714 0.203 305.504)",
    sidebarAccent: "oklch(0.432 0.232 310.116)",
    sidebarRing: "oklch(0.714 0.203 305.504)",
    primary: "oklch(0.714 0.203 305.504)",
    primaryForeground: "oklch(0.985 0 0)",
  },
};

export const ACCENT_COLOR_NAMES: Record<AccentColor, { en: string; es: string }> = {
  red: { en: "Red", es: "Rojo" },
  rose: { en: "Rose", es: "Rosa" },
  orange: { en: "Orange", es: "Naranja" },
  green: { en: "Green", es: "Verde" },
  blue: { en: "Blue", es: "Azul" },
  yellow: { en: "Yellow", es: "Amarillo" },
  purple: { en: "Purple", es: "Morado" },
};

export const DEFAULT_ACCENT_COLOR: AccentColor = "blue";
