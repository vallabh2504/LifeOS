import React, { useEffect, useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import useHabitsStore from './store/habitsStore';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import StreakDisplay from './StreakDisplay';
import { Plus, Trash2, Check, X } from 'lucide-react';

const HabitList = () => {
  const { theme } = useTheme();
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
    // Show last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const isCompleted = logs.some(
        (log) => log.habit_id === habitId && log.completed_date === dateStr
      );

      days.push({
        date,
        dateStr,
        isCompleted
      });
    }
    return days;
  };

  if (loading && habits.length === 0) {
    return (
      <div className={`text-center p-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
        Loading habits...
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg p-6 h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddHabit} className="mb-6 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter habit name..."
            className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            autoFocus
          />
          <button
            type="submit"
            disabled={!newHabitTitle.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {habits.length === 0 && !loading ? (
          <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
            theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            <p>No habits tracked yet.</p>
            <p className="text-sm mt-1">Add one above to start your streak!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const dayGrid = getDayGrid(habit.id);
            return (
              <div 
                key={habit.id} 
                className={`group flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50' : 'border-gray-200 bg-gray-50 hover:bg-white'
                }`}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-semibold text-lg truncate">{habit.title}</h3>
                  <div className="mt-1">
                    <StreakDisplay streak={habit.current_streak} longest={habit.longest_streak} />
                  </div>
                </div>

                {/* Weekly Grid */}
                <div className="flex items-center gap-1.5 sm:gap-2 mr-4">
                  {dayGrid.map((day) => (
                    <div key={day.dateStr} className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] uppercase font-bold ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {format(day.date, 'EEEEE')}
                      </span>
                      <button
                        onClick={() => toggleHabit(habit.id, day.dateStr)}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                          ${day.isCompleted 
                            ? 'bg-green-500 text-white scale-100 shadow-sm ring-2 ring-green-500/30' 
                            : theme === 'dark' 
                              ? 'bg-gray-700 text-transparent hover:bg-gray-600 ring-1 ring-gray-600' 
                              : 'bg-white text-transparent hover:bg-gray-100 ring-1 ring-gray-200'
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
                    theme === 'dark' 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-500 hover:bg-red-50'
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
