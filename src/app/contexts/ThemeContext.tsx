import { createContext, useContext, useState, useEffect, useCallback } from "react";

type FontSize = 12 | 14 | 17;

interface ThemeContextValue {
  isDark: boolean;
  toggleDark: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  screenReader: boolean;
  toggleScreenReader: () => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleDark: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  screenReader: false,
  toggleScreenReader: () => {},
  fontSize: 14,
  setFontSize: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSize>(14);

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    highContrast
      ? root.classList.add("high-contrast")
      : root.classList.remove("high-contrast");
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`);
  }, [fontSize]);

  const toggleDark = useCallback(() => setIsDark(v => !v), []);
  const toggleHighContrast = useCallback(() => setHighContrast(v => !v), []);
  const toggleScreenReader = useCallback(() => setScreenReader(v => !v), []);
  const setFontSize = useCallback((s: FontSize) => setFontSizeState(s), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, highContrast, toggleHighContrast, screenReader, toggleScreenReader, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
