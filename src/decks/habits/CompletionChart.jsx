import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { format, subDays, startOfDay } from 'date-fns';

const CompletionChart = ({ logs }) => {
  const { theme } = useTheme();

  const getCompletionData = () => {
    // Generate data for the last 14 days
    const data = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const count = logs.filter(log => log.completed_date === dateStr).length;
      
      data.push({
        date: format(date, 'MM/dd'),
        count: count
      });
    }
    
    return data;
  };

  const chartData = getCompletionData();

  return (
    <div className={`p-4 rounded-xl shadow-md h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Habit Completion (Last 14 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} 
              tick={{fill: theme === 'dark' ? '#d1d5db' : '#374151'}}
            />
            <YAxis 
              allowDecimals={false}
              stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
              tick={{fill: theme === 'dark' ? '#d1d5db' : '#374151'}}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                color: theme === 'dark' ? '#f3f4f6' : '#111827'
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionChart;
