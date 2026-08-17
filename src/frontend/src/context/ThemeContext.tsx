import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================
// ThemeContext — day/night auto-detect with manual override
// Auto: 06:00–17:59 = day | 18:00–05:59 = night
// ============================================================

export type ThemeMode = 'day' | 'night';
type ThemeSetting = ThemeMode | 'auto';

const THEME_STORAGE_KEY = 'myus_theme';
const DAY_START = 6;
const DAY_END = 18;

interface ThemeContextValue {
  mode: ThemeMode;
  setting: ThemeSetting;
  isDay: boolean;
  isNight: boolean;
  setSetting: (s: ThemeSetting) => void;
  toggle: () => void;
  bgDensity: number;
  setBgDensity: (d: number) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'day',
  setting: 'auto',
  isDay: true,
  isNight: false,
  setSetting: () => {},
  toggle: () => {},
  bgDensity: 60,
  setBgDensity: () => {},
});

function detectTimeTheme(): ThemeMode {
  const hour = new Date().getHours();
  return hour >= DAY_START && hour < DAY_END ? 'day' : 'night';
}

function getStoredSetting(): ThemeSetting {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'day' || stored === 'night' || stored === 'auto') return stored;
  } catch {
    /* localStorage blocked */
  }
  return 'auto';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>(getStoredSetting);
  const [mode, setMode] = useState<ThemeMode>(() => {
    const s = getStoredSetting();
    return s === 'auto' ? detectTimeTheme() : s;
  });

  const [bgDensity, setBgDensity] = useState(60);

  const setSetting = useCallback((s: ThemeSetting) => {
    setSettingState(s);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, s);
    } catch {
      /* ignore */
    }
    const newMode = s === 'auto' ? detectTimeTheme() : s;
    setMode(newMode);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'day' ? 'night' : 'day';
      setSettingState(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'day' ? '#3B82F6' : '#080E24');
    }
  }, [mode]);

  useEffect(() => {
    if (setting !== 'auto') return;
    const interval = setInterval(() => {
      setMode(detectTimeTheme());
    }, 60_000);
    return () => clearInterval(interval);
  }, [setting]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setting,
        isDay: mode === 'day',
        isNight: mode === 'night',
        setSetting,
        toggle,
        bgDensity,
        setBgDensity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export default ThemeProvider;
