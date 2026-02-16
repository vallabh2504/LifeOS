import React, { useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { CheckCircle, Circle, Plus, Trash2, User, ListTodo } from 'lucide-react';

const PersonalDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buy groceries', due: '2026-02-17', completed: false },
    { id: 2, title: 'Call mom', due: '', completed: true },
    { id: 3, title: 'Submit assignment', due: '2026-02-18', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, due: '', completed: false }]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const pending = tasks.filter(t => !t.completed).length;
  const done = tasks.filter(t => t.completed).length;

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : `bg-gradient-to-br ${colors.bgGradient}`} relative overflow-hidden`}>
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.glow}`}>
            <User size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                Personal Checklist
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Stay on top of your tasks.</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`glass-card p-5 text-center ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <p className={`text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{pending}</p>
            <p className={`text-sm font-medium ${colors.muted}`}>Pending</p>
          </div>
          <div className={`glass-card p-5 text-center ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <p className="text-3xl font-black text-green-400">{done}</p>
            <p className={`text-sm font-medium ${colors.muted}`}>Completed</p>
          </div>
        </div>

        {/* Add Task */}
        <div className={`glass-card p-4 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <div className="flex gap-3">
            <input 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className={`flex-1 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                  : 'bg-white/5 border-white/10 text-white focus:border-cyan-500 placeholder-white/20'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            />
            <button 
              onClick={addTask}
              disabled={!newTask.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.glow}`
              }`}
            >
              <Plus size={18} /> Add
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <ListTodo size={20} className={colors.primary} />
            Tasks
          </h2>
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                  task.completed
                    ? theme === 'light'
                      ? 'bg-green-50/50 border-green-200/50 opacity-60'
                      : 'bg-green-500/5 border-green-500/10 opacity-60'
                    : theme === 'light'
                      ? 'bg-white/40 border-gray-200 hover:bg-white/60'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task.id)} 
                  className={`flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                    task.completed ? 'text-green-400' : colors.primary
                  }`}
                >
                  {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${
                    task.completed 
                      ? 'line-through text-gray-500' 
                      : theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{task.title}</p>
                  {task.due && (
                    <span className={`text-xs font-mono ${colors.muted}`}>Due: {task.due}</span>
                  )}
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
              theme === 'light' ? 'border-gray-300 text-gray-400' : 'border-white/10 text-white/30'
            }`}>
              <p className="text-lg">No tasks yet.</p>
              <p className="text-sm mt-1">Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDeck;
