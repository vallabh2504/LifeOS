import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Code, DollarSign, Activity, BookOpen, Search } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const location = useLocation();

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
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="text-white font-bold text-xl tracking-tight">LifeOS</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 ml-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-900 text-white shadow-inner'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-96 ml-4">
             <SearchBar />
          </div>

          {/* Mobile Menu Button (simplified) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
