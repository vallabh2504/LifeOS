import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Code, DollarSign, Activity, BookOpen, Search, Moon, Sun } from 'lucide-react';
import SearchBar from './SearchBar';
import { useTheme } from '../shared/contexts/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/personal', label: 'Personal', icon: User },
    { path: '/development', label: 'Development', icon: Code },
    { path: '/finance', label: 'Finance', icon: DollarSign },
    { path: '/habits', label: 'Habits', icon: Activity },
    { path: '/journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className={`w-9 h-9 bg-gradient-to-br ${colors.gradient} rounded-lg flex items-center justify-center text-white font-bold shadow-lg ${colors.glow} hover:scale-110 transition-transform`}>
              L
            </div>
            <span className={`${colors.text} font-bold text-xl tracking-tight`}>LifeOS</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 ml-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                    active
                      ? `${colors.text}`
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className={`absolute inset-0 ${colors.bgGradient} rounded-lg border ${colors.border} shadow-lg`} />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} className={active ? colors.primary : ''} />
                    {item.label}
                  </span>
                  {/* Glow effect for active item */}
                  {active && (
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 ${colors.primary.replace('text-', 'bg-')} rounded-full shadow-[0_0_8px_currentColor]`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: Search + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4 ml-4">
            <div className="w-64">
              <SearchBar />
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110 group`}
              title={`Current: ${theme}. Click to switch.`}
            >
              {theme === 'midnight' && <Moon size={18} className="text-cyan-400 group-hover:text-cyan-300" />}
              {theme === 'nature' && <Sun size={18} className="text-green-400 group-hover:text-green-300" />}
              {theme === 'dark' && <Moon size={18} className="text-purple-400 group-hover:text-purple-300" />}
              {theme === 'light' && <Sun size={18} className="text-blue-400 group-hover:text-blue-300" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-white/60 hover:text-white focus:outline-none">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
