import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Theme-specific color palettes
const themeColors = {
  midnight: {
    primary: '#00E5FF',
    secondary: '#0EA5E9',
    accent: '#06B6D4',
    gradient: 'from-cyan-500 via-blue-500 to-cyan-500',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-950',
    cardBg: 'bg-slate-900/80',
    border: 'border-cyan-500/20',
    text: 'text-cyan-50',
    muted: 'text-cyan-300/70',
    glow: 'shadow-cyan-500/20',
  },
  nature: {
    primary: '#22C55E',
    secondary: '#10B981',
    accent: '#34D399',
    gradient: 'from-green-500 via-emerald-500 to-green-500',
    bgGradient: 'from-green-950 via-emerald-900/50 to-green-950',
    cardBg: 'bg-green-900/40',
    border: 'border-green-500/20',
    text: 'text-green-50',
    muted: 'text-green-300/70',
    glow: 'shadow-green-500/20',
  },
  dark: {
    primary: '#A855F7',
    secondary: '#8B5CF6',
    accent: '#C084FC',
    gradient: 'from-purple-500 via-violet-500 to-purple-500',
    bgGradient: 'from-gray-950 via-purple-950/30 to-gray-950',
    cardBg: 'bg-gray-900/80',
    border: 'border-purple-500/20',
    text: 'text-purple-50',
    muted: 'text-purple-300/70',
    glow: 'shadow-purple-500/20',
  },
  light: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    gradient: 'from-blue-500 via-sky-500 to-blue-500',
    bgGradient: 'from-slate-100 via-blue-50 to-slate-100',
    cardBg: 'bg-white/80',
    border: 'border-blue-500/20',
    text: 'text-blue-950',
    muted: 'text-blue-700/70',
    glow: 'shadow-blue-500/20',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const themes = ['light', 'dark', 'midnight', 'nature'];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'midnight', 'nature');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const currentIndex = themes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  const getThemeColors = () => themeColors[theme] || themeColors.dark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes, setTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
