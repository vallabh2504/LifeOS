import React from 'react';
import { Flame } from 'lucide-react';
import { useTheme } from '../../shared/contexts/ThemeContext';

const StreakDisplay = ({ streak, longest }) => {
  const { theme } = useTheme();

  const getFireColor = (count) => {
    if (count >= 30) return '#ef4444';
    if (count >= 14) return '#f97316';
    if (count >= 7) return '#eab308';
    return '#94a3b8';
  };

  return (
    <div className={`flex items-center space-x-2 py-1`}>
      <div className="relative">
        <Flame 
          size={20} 
          color={getFireColor(streak)} 
          fill={streak > 0 ? getFireColor(streak) : 'none'} 
          className="transition-all duration-300"
        />
        {streak > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: getFireColor(streak) }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: getFireColor(streak) }}></span>
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          {streak}
        </span>
        <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>days</span>
        {longest > streak && (
          <span className={`text-xs ml-1 ${theme === 'light' ? 'text-gray-400' : 'text-white/30'}`}>
            (best: {longest})
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
