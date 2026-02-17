import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// BRD Theme-specific color palettes - EXACT colors from requirements
const themeColors = {
  forestLight: {
    primary: 'text-[#4A7C59]',
    primaryBg: 'bg-[#4A7C59]',
    secondary: 'text-[#8FBC8F]',
    secondaryBg: 'bg-[#8FBC8F]',
    background: 'bg-[#F5F9F6]',
    backgroundGradient: 'from-[#F5F9F6] via-[#F5F9F6] to-[#F5F9F6]',
    text: 'text-[#2D3E2F]',
    textLight: 'text-[#2D3E2F]/80',
    accent: 'text-[#A0D8B3]',
    accentBg: 'bg-[#A0D8B3]',
    gradient: 'from-[#4A7C59] via-[#8FBC8F] to-[#4A7C59]',
    bgGradient: 'from-[#F5F9F6] via-[#F5F9F6] to-[#F5F9F6]',
    cardBg: 'bg-white/80',
    border: 'border-[#4A7C59]/20',
    muted: 'text-[#2D3E2F]/60',
    glow: 'shadow-[#4A7C59]/20',
    primaryLight: '#4A7C59',
  },
  forestDark: {
    primary: 'text-[#6B9D77]',
    primaryBg: 'bg-[#6B9D77]',
    secondary: 'text-[#3D5A45]',
    secondaryBg: 'bg-[#3D5A45]',
    background: 'bg-[#1E2821]',
    backgroundGradient: 'from-[#1E2821] via-[#1E2821] to-[#1E2821]',
    text: 'text-[#E8F3EC]',
    textLight: 'text-[#E8F3EC]/80',
    accent: 'text-[#7FCD91]',
    accentBg: 'bg-[#7FCD91]',
    gradient: 'from-[#6B9D77] via-[#7FCD91] to-[#6B9D77]',
    bgGradient: 'from-[#1E2821] via-[#1E2821] to-[#1E2821]',
    cardBg: 'bg-[#1E2821]/80',
    border: 'border-[#6B9D77]/20',
    muted: 'text-[#E8F3EC]/60',
    glow: 'shadow-[#6B9D77]/20',
    primaryLight: '#6B9D77',
  },
  beachLight: {
    primary: 'text-[#5B9BD5]',
    primaryBg: 'bg-[#5B9BD5]',
    secondary: 'text-[#F4A460]',
    secondaryBg: 'bg-[#F4A460]',
    background: 'bg-[#FFF9F0]',
    backgroundGradient: 'from-[#FFF9F0] via-[#FFF9F0] to-[#FFF9F0]',
    text: 'text-[#2C3E50]',
    textLight: 'text-[#2C3E50]/80',
    accent: 'text-[#FFD194]',
    accentBg: 'bg-[#FFD194]',
    gradient: 'from-[#5B9BD5] via-[#F4A460] to-[#5B9BD5]',
    bgGradient: 'from-[#FFF9F0] via-[#FFF9F0] to-[#FFF9F0]',
    cardBg: 'bg-white/80',
    border: 'border-[#5B9BD5]/20',
    muted: 'text-[#2C3E50]/60',
    glow: 'shadow-[#5B9BD5]/20',
    primaryLight: '#5B9BD5',
  },
  beachDark: {
    primary: 'text-[#7EAFDB]',
    primaryBg: 'bg-[#7EAFDB]',
    secondary: 'text-[#D4A76A]',
    secondaryBg: 'bg-[#D4A76A]',
    background: 'bg-[#1A2632]',
    backgroundGradient: 'from-[#1A2632] via-[#1A2632] to-[#1A2632]',
    text: 'text-[#EEF3F7]',
    textLight: 'text-[#EEF3F7]/80',
    accent: 'text-[#FFA94D]',
    accentBg: 'bg-[#FFA94D]',
    gradient: 'from-[#7EAFDB] via-[#FFA94D] to-[#7EAFDB]',
    bgGradient: 'from-[#1A2632] via-[#1A2632] to-[#1A2632]',
    cardBg: 'bg-[#1A2632]/80',
    border: 'border-[#7EAFDB]/20',
    muted: 'text-[#EEF3F7]/60',
    glow: 'shadow-[#7EAFDB]/20',
    primaryLight: '#7EAFDB',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'forestDark');
  const themes = ['forestLight', 'forestDark', 'beachLight', 'beachDark'];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('forestLight', 'forestDark', 'beachLight', 'beachDark');
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

  const getThemeColors = () => themeColors[theme] || themeColors.forestDark;

  // Get theme display name
  const getThemeName = () => {
    const names = {
      forestLight: 'Forest Light',
      forestDark: 'Forest Dark',
      beachLight: 'Beach Light',
      beachDark: 'Beach Dark',
    };
    return names[theme] || 'Forest Dark';
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes, setTheme, getThemeColors, getThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
