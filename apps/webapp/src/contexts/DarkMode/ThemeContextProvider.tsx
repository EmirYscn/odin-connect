'use client';
import { useContext, useEffect, useState } from 'react';

import { ThemeContext } from './ThemeContext';

type ThemeContextContextProviderProps = {
  children: React.ReactNode;
};

function ThemeContextProvider({ children }: ThemeContextContextProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
    // else {
    //   const prefersDark = window.matchMedia(
    //     "(prefers-color-scheme: dark)"
    //   ).matches;
    //   setIsDarkMode(prefersDark);
    // }
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    },
    [isDarkMode]
  );

  const toggleDarkMode = () => setIsDarkMode((isDark: boolean) => !isDark);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of DarkModeProvider');
  return context;
}

export { ThemeContextProvider, useDarkMode };
