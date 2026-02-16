import React, { useEffect } from 'react';
import HabitList from './HabitList';
import CompletionChart from './CompletionChart';
import useHabitsStore from './store/habitsStore';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { Activity, Zap, TrendingUp, Flame } from 'lucide-react';

const HabitsDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const { logs, habits, fetchHabits, loading } = useHabitsStore();

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const totalCompletions = logs.length;
  const activeStreaks = habits.filter(h => h.current_streak > 0).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longest_streak), 0);

  if (loading && habits.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-slate-100' : ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : `bg-gradient-to-br ${colors.bgGradient}`} relative overflow-hidden`}>
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
            <Flame size={28} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight`}>
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Habit Tracker
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Small steps every day add up to big results.</p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Zap size={24} className="text-orange-400" />
            </div>
            <div>
              <p className={`text-sm font-medium ${colors.muted}`}>Active Streaks</p>
              <p className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{activeStreaks}</p>
            </div>
          </div>
        </div>

        <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Activity size={24} className="text-green-400" />
            </div>
            <div>
              <p className={`text-sm font-medium ${colors.muted}`}>Total Completions</p>
              <p className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{totalCompletions}</p>
            </div>
          </div>
        </div>

        <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <TrendingUp size={24} className="text-purple-400" />
            </div>
            <div>
              <p className={`text-sm font-medium ${colors.muted}`}>Best Streak</p>
              <p className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{bestStreak} <span className="text-sm font-normal opacity-70">days</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <HabitList />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <CompletionChart logs={logs} />
          
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className="text-xl">💡</span> Daily Motivation
            </h3>
            <blockquote className={`italic border-l-4 border-orange-500 pl-4 py-1 ${colors.muted}`}>
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </blockquote>
            <p className={`text-right text-sm mt-3 font-medium ${colors.muted}`}>— Aristotle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsDeck;
