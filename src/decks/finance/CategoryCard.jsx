import React from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';

const CategoryCard = ({ category, spent, budget }) => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : (spent > 0 ? 100 : 0);
  const isWarning = budget > 0 && percentage > 80;
  const isOverBudget = budget > 0 && spent > budget;

  // SVG circle parameters
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getProgressColor = () => {
    if (isOverBudget) return '#ef4444'; // red-500
    if (isWarning) return '#f59e0b'; // amber-500
    switch (theme) {
      case 'midnight': return '#06B6D4'; // cyan-500
      case 'nature': return '#22C55E'; // green-500
      case 'dark': return '#A855F7'; // purple-500
      default: return '#3B82F6'; // blue-500
    }
  };

  return (
    <div className={`relative p-5 rounded-xl border transition-all hover:scale-[1.02] duration-300 ${
      theme === 'light' 
        ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
    }`}>
      <div className="flex items-center justify-between">
        {/* Circular Progress */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              className={theme === 'light' ? 'stroke-gray-200' : 'stroke-white/10'}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              stroke={getProgressColor()}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="progress-ring-circle"
            />
          </svg>
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : isWarning ? 'text-amber-500' : colors.primary}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {/* Category info */}
        <div className="flex-1 ml-4">
          <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{category}</h3>
          <p className={`text-sm ${colors.muted}`}>
            <span className={isOverBudget ? 'text-red-400' : ''}>${spent.toFixed(2)}</span>
            {budget > 0 && <span> / ${budget.toFixed(2)}</span>}
          </p>
        </div>

        {/* Warning indicator */}
        {isWarning && !isOverBudget && (
          <div className="text-amber-500" title="Budget warning - over 80%">
            ⚠️
          </div>
        )}
        {isOverBudget && (
          <div className="text-red-500" title="Over budget!">
            🚨
          </div>
        )}
      </div>

      {/* Budget warning text */}
      {isWarning && (
        <p className={`text-xs mt-3 font-medium ${isOverBudget ? 'text-red-500' : 'text-amber-500'}`}>
          {isOverBudget ? 'Over budget!' : 'Budget warning (>80%)'}
        </p>
      )}
    </div>
  );
};

export default CategoryCard;
