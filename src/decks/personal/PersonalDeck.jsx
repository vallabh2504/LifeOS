import React, { useEffect, useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { CheckCircle, Circle, Plus, Trash2, User, ListTodo } from 'lucide-react';
import usePersonalStore from './store/personalStore';

const PersonalDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  const { tasks, loading, fetchTasks, addTask, toggleTask, deleteTask } = usePersonalStore();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask({ title: newTask });
      setNewTask('');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await toggleTask(id, newStatus);
  };

  const pending = tasks.filter(t => t.status !== 'completed').length;
  const done = tasks.filter(t => t.status === 'completed').length;

  if (loading && tasks.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.background}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primaryLight }}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${colors.background} relative overflow-hidden`}>
      {/* Background effects */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${colors.primaryBg}/10 rounded-full blur-[100px] pointer-events-none`}></div>
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
          <div className={`p-5 text-center rounded-xl ${colors.cardBg} border ${colors.border}`}>
            <p className={`text-3xl font-black ${colors.text}`}>{pending}</p>
            <p className={`text-sm font-medium ${colors.muted}`}>Pending</p>
          </div>
          <div className={`p-5 text-center rounded-xl ${colors.cardBg} border ${colors.border}`}>
            <p className="text-3xl font-black text-green-400">{done}</p>
            <p className={`text-sm font-medium ${colors.muted}`}>Completed</p>
          </div>
        </div>

        {/* Add Task */}
        <div className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}>
          <div className="flex gap-3">
            <input 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add a new task..."
              className={`flex-1 px-4 py-3 rounded-xl border ${colors.border} ${colors.text} ${colors.background} focus:outline-none focus:ring-2 ${colors.primaryBg}/20`}
            />
            <button 
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${colors.primaryBg} text-white`}
            >
              <Plus size={18} /> Add
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className={`p-6 rounded-xl ${colors.cardBg} border ${colors.border}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colors.text}`}>
            <ListTodo size={20} className={colors.primary.replace('text-', '')} />
            Tasks
          </h2>
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  task.status === 'completed'
                    ? `${colors.border} opacity-60`
                    : `${colors.border} hover:${colors.primaryBg}/20`
                }`}
              >
                <button 
                  onClick={() => handleToggle(task.id, task.status)} 
                  className={`flex-shrink-0 transition-all ${task.status === 'completed' ? 'text-green-400' : colors.primary}`}
                >
                  {task.status === 'completed' ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${task.status === 'completed' ? 'line-through opacity-60' : colors.text}`}>
                    {task.title}
                  </p>
                  {task.due_date && (
                    <span className={`text-xs font-mono ${colors.muted}`}>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
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
            <div className={`text-center py-12 rounded-xl border-2 border-dashed ${colors.border}`}>
              <p className={`text-lg ${colors.muted}`}>No tasks yet.</p>
              <p className={`text-sm mt-1 ${colors.muted}`}>Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDeck;
