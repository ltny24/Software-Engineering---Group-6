import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================
// ThemeContext — Always starts in Day Mode on page load / fresh start.
// Theme state exists strictly in memory (React state context).
// Manual toggle button toggles state between 'day' and 'night'.
// ============================================================

export type ThemeMode = 'day' | 'night';
export type ThemeSetting = ThemeMode;

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
  setting: 'day',
  isDay: true,
  isNight: false,
  setSetting: () => {},
  toggle: () => {},
  bgDensity: 60,
  setBgDensity: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to 'day' (Light/Day Mode) on page load
  const [mode, setMode] = useState<ThemeMode>('day');
  const [bgDensity, setBgDensity] = useState(60);

  const setSetting = useCallback((s: ThemeSetting) => {
    setMode(s);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'day' ? '#3B82F6' : '#080E24');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setting: mode,
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
