import React, { useEffect } from 'react';
import HabitList from './HabitList';
import CompletionChart from './CompletionChart';
import useHabitsStore from './store/habitsStore';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { Activity, Zap, TrendingUp } from 'lucide-react';

const HabitsDeck = () => {
  const { theme } = useTheme();
  const { logs, habits, fetchHabits, loading } = useHabitsStore();

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Calculate some aggregate stats
  const totalCompletions = logs.length;
  const activeStreaks = habits.filter(h => h.current_streak > 0).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longest_streak), 0);

  return (
    <div className={`h-full flex flex-col p-6 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-blue-500" />
          Habit Tracker
        </h1>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Small steps every day add up to big results.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm opacity-70">Active Streaks</p>
              <p className="text-2xl font-bold">{activeStreaks}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm opacity-70">Total Completions</p>
              <p className="text-2xl font-bold">{totalCompletions}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm opacity-70">Best Streak</p>
              <p className="text-2xl font-bold">{bestStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <HabitList />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <CompletionChart logs={logs} />
          
          <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span> Daily Motivation
            </h3>
            <blockquote className="italic opacity-80 border-l-4 border-blue-500 pl-4 py-1">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </blockquote>
            <p className="text-right text-sm mt-3 font-medium opacity-60">— Aristotle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsDeck;
