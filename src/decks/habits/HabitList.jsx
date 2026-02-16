import React, { useEffect, useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import useHabitsStore from './store/habitsStore';
import { format, subDays } from 'date-fns';
import StreakDisplay from './StreakDisplay';
import { Plus, Trash2, Check, X } from 'lucide-react';

const HabitList = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const { habits, logs, addHabit, deleteHabit, toggleHabit, loading } = useHabitsStore();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      addHabit(newHabitTitle);
      setNewHabitTitle('');
      setIsAdding(false);
    }
  };

  const getDayGrid = (habitId) => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isCompleted = logs.some(
        (log) => log.habit_id === habitId && log.completed_date === dateStr
      );
      days.push({ date, dateStr, isCompleted });
    }
    return days;
  };

  if (loading && habits.length === 0) {
    return (
      <div className={`text-center p-8 ${colors.muted}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
        Loading habits...
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 h-full flex flex-col ${theme === 'light' ? 'bg-white/70' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>My Habits</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
            isAdding
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.glow}`
          }`}
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancel' : 'Add Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddHabit} className="mb-6 flex gap-3 animate-fade-in">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter habit name..."
            className={`flex-1 px-4 py-2.5 rounded-lg border backdrop-blur-sm transition-all ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500 placeholder-white/30'
            } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            autoFocus
          />
          <button
            type="submit"
            disabled={!newHabitTitle.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/20 hover:scale-105"
          >
            Save
          </button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {habits.length === 0 && !loading ? (
          <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
            theme === 'light' ? 'border-gray-300 text-gray-400' : 'border-white/10 text-white/30'
          }`}>
            <p className="text-lg">No habits tracked yet.</p>
            <p className="text-sm mt-1">Add one above to start your streak!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const dayGrid = getDayGrid(habit.id);
            return (
              <div 
                key={habit.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                  theme === 'light'
                    ? 'bg-white/40 border-gray-200 hover:bg-white/60 hover:shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className={`font-semibold text-lg truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{habit.title}</h3>
                  <div className="mt-1">
                    <StreakDisplay streak={habit.current_streak} longest={habit.longest_streak} />
                  </div>
                </div>

                {/* Weekly Grid */}
                <div className="flex items-center gap-1.5 sm:gap-2 mr-4">
                  {dayGrid.map((day) => (
                    <div key={day.dateStr} className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] uppercase font-bold ${colors.muted}`}>
                        {format(day.date, 'EEEEE')}
                      </span>
                      <button
                        onClick={() => toggleHabit(habit.id, day.dateStr)}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                          ${day.isCompleted 
                            ? 'bg-green-500 text-white scale-100 shadow-sm ring-2 ring-green-500/30 shadow-green-500/20' 
                            : theme === 'light'
                              ? 'bg-gray-100 text-transparent hover:bg-gray-200 ring-1 ring-gray-300'
                              : 'bg-white/5 text-transparent hover:bg-white/10 ring-1 ring-white/10'
                          }
                        `}
                        title={`${day.isCompleted ? 'Completed' : 'Mark complete'} on ${format(day.date, 'MMM d')}`}
                      >
                        <Check size={16} className={`transition-transform duration-200 ${day.isCompleted ? 'scale-100' : 'scale-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if(window.confirm('Delete this habit?')) deleteHabit(habit.id);
                  }}
                  className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                    theme === 'light'
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-red-400 hover:bg-red-500/10'
                  }`}
                  aria-label="Delete habit"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitList;
