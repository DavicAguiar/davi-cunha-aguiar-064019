import { BehaviorSubject } from "rxjs";

export type ThemeMode = "light" | "dark";
type ThemeState = { mode: ThemeMode };

const STORAGE_KEY = "theme";

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem(STORAGE_KEY, mode);
}

export const themeState$ = new BehaviorSubject<ThemeState>({ mode: getInitialTheme() });

const sub = themeState$.subscribe((s) => applyTheme(s.mode));

if (import.meta && (import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => sub.unsubscribe());
}

export const themeActions = {
  toggle() {
    const next: ThemeMode = themeState$.getValue().mode === "dark" ? "light" : "dark";
    themeState$.next({ mode: next });
  },
  set(mode: ThemeMode) {
    themeState$.next({ mode });
  },
};
