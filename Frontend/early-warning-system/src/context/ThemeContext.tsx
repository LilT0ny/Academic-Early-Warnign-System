import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
  toggle: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeContext = createContext<ThemeContextType>({} as any);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  // Aplica/remueve la clase 'dark' en <html>
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effectiveDark = theme === "dark" || (theme === "system" && prefersDark);

    root.classList.toggle("dark", effectiveDark);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    setTheme,
    isDark: document.documentElement.classList.contains("dark"),
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
