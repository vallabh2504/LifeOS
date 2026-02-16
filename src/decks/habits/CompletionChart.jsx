import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { format, subDays } from 'date-fns';
import { BarChart3 } from 'lucide-react';

const CompletionChart = ({ logs }) => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const getCompletionData = () => {
    const data = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = logs.filter(log => log.completed_date === dateStr).length;
      data.push({ date: format(date, 'MM/dd'), count });
    }
    return data;
  };

  const chartData = getCompletionData();

  const getBarColor = () => {
    switch (theme) {
      case 'midnight': return '#06B6D4';
      case 'nature': return '#22C55E';
      case 'dark': return '#A855F7';
      default: return '#3B82F6';
    }
  };

  return (
    <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        <BarChart3 size={18} className={colors.primary} />
        Completion (14 Days)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              stroke={theme === 'light' ? '#9ca3af' : 'rgba(255,255,255,0.3)'}
              tick={{ fill: theme === 'light' ? '#6b7280' : 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              allowDecimals={false}
              stroke={theme === 'light' ? '#9ca3af' : 'rgba(255,255,255,0.3)'}
              tick={{ fill: theme === 'light' ? '#6b7280' : 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'light' ? '#ffffff' : 'rgba(15,23,42,0.95)',
                borderColor: theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.1)',
                color: theme === 'light' ? '#111827' : '#f3f4f6',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            />
            <Bar dataKey="count" fill={getBarColor()} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionChart;
