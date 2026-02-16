import React from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';

const CategoryCard = ({ category, spent, budget }) => {
  const { theme } = useTheme();

  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isWarning = percentage > 80;

  const getThemeStyles = () => {
    switch (theme) {
      case 'midnight':
        return 'bg-slate-900 text-cyan-400 border-slate-700';
      case 'nature':
        return 'bg-green-900 text-green-100 border-green-700';
      case 'dark':
        return 'bg-gray-800 text-white border-gray-700';
      default:
        return 'bg-white text-gray-900 border-gray-200';
    }
  };

  const getProgressColor = () => {
    if (isWarning) return 'bg-red-500';
    switch (theme) {
      case 'midnight': return 'bg-cyan-500';
      case 'nature': return 'bg-green-400';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border ${getThemeStyles()} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{category}</h3>
        <span className="text-sm opacity-80">${spent} / ${budget}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${getProgressColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {isWarning && (
        <p className="text-xs text-red-500 mt-1 font-bold">⚠️ Budget Warning (&gt;80%)</p>
      )}
    </div>
  );
};

export default CategoryCard;
