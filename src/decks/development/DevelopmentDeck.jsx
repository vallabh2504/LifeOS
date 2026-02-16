import React, { useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { Plus, GripVertical, CheckCircle, Clock, Circle, Code, ArrowRight, ArrowLeft } from 'lucide-react';

const DevelopmentDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const columns = [
    { id: 'todo', title: 'To Do', icon: Circle, iconColor: 'text-gray-400', accentColor: 'from-gray-500 to-slate-500', dotColor: 'bg-gray-400' },
    { id: 'doing', title: 'In Progress', icon: Clock, iconColor: 'text-blue-400', accentColor: 'from-blue-500 to-cyan-500', dotColor: 'bg-blue-400' },
    { id: 'done', title: 'Done', icon: CheckCircle, iconColor: 'text-green-400', accentColor: 'from-green-500 to-emerald-500', dotColor: 'bg-green-400' }
  ];

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup React Project', status: 'todo', project: 'LifeOS' },
    { id: 2, title: 'Design Database Schema', status: 'doing', project: 'LifeOS' },
    { id: 3, title: 'Fix Authentication', status: 'done', project: 'LifeOS' }
  ]);

  const [newTaskCol, setNewTaskCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = (colId) => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTaskTitle, status: colId, project: 'LifeOS' }]);
      setNewTaskTitle('');
      setNewTaskCol(null);
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : `bg-gradient-to-br ${colors.bgGradient}`} relative overflow-hidden`}>
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg shadow-purple-500/20">
            <Code size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Development Deck
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Kanban-style project tracking.</p>
          </div>
        </div>
      </header>
      
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {columns.map(col => {
          const Icon = col.icon;
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`glass-card p-5 ${theme === 'light' ? 'bg-white/70' : ''}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${col.accentColor}`}></div>
                  <Icon size={18} className={col.iconColor} />
                  <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{col.title}</h2>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/60'
                }`}>
                  {colTasks.length}
                </span>
              </div>
              
              {/* Tasks */}
              <div className="space-y-3 min-h-[100px]">
                {colTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      theme === 'light'
                        ? 'bg-white/60 border-gray-200 hover:bg-white/80 hover:shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                        theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-300'
                      }`}>{task.project}</span>
                      <GripVertical className={`${theme === 'light' ? 'text-gray-300' : 'text-white/20'} opacity-0 group-hover:opacity-100 transition-opacity`} size={14} />
                    </div>
                    <p className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{task.title}</p>
                    <div className="flex gap-2">
                      {col.id !== 'todo' && (
                        <button 
                          onClick={() => moveTask(task.id, col.id === 'done' ? 'doing' : 'todo')} 
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 ${
                            theme === 'light'
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <ArrowLeft size={12} /> Back
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button 
                          onClick={() => moveTask(task.id, col.id === 'todo' ? 'doing' : 'done')}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 ${
                            theme === 'light'
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : `bg-gradient-to-r ${col.id === 'todo' ? 'from-blue-500/20 to-cyan-500/20 text-blue-300' : 'from-green-500/20 to-emerald-500/20 text-green-300'} hover:opacity-80`
                          }`}
                        >
                          Next <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Task */}
              {newTaskCol === col.id ? (
                <div className="mt-4 flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                    placeholder="Task title..."
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm backdrop-blur-sm ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        : 'bg-white/5 border-white/10 text-white focus:border-cyan-500 placeholder-white/20'
                    } focus:outline-none`}
                    autoFocus
                  />
                  <button 
                    onClick={() => addTask(col.id)}
                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-lg hover:opacity-90 transition-all"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => { setNewTaskCol(null); setNewTaskTitle(''); }}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/50'
                    } hover:opacity-80 transition-all`}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setNewTaskCol(col.id)}
                  className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] ${
                    theme === 'light'
                      ? 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/60 hover:bg-white/5'
                  }`}
                >
                  <Plus size={16} /> Add Task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevelopmentDeck;
