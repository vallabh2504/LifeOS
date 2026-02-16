import React from 'react';
import { Flame } from 'lucide-react';
import { useTheme } from '../../shared/contexts/ThemeContext';

const StreakDisplay = ({ streak, longest }) => {
  const { theme } = useTheme();

  const getFireColor = (count) => {
    if (count >= 30) return '#ef4444'; // Red hot
    if (count >= 14) return '#f97316'; // Orange
    if (count >= 7) return '#eab308'; // Yellow
    return '#94a3b8'; // Slate/Grey
  };

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="relative">
        <Flame 
          size={24} 
          color={getFireColor(streak)} 
          fill={streak > 0 ? getFireColor(streak) : 'none'} 
          className="transition-all duration-300"
        />
        {streak > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: getFireColor(streak) }}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3`} style={{ backgroundColor: getFireColor(streak) }}></span>
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {streak} <span className="text-xs font-normal opacity-70">days</span>
        </span>
        {longest > streak && (
          <span className="text-xs text-gray-500">Best: {longest}</span>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
