import React, { useState } from 'react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { BookOpen, Heart, Target, Plus, Calendar, Trash2 } from 'lucide-react';

const JournalDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const [template, setTemplate] = useState('blank');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([
    { id: 1, title: 'Morning Reflection', date: '2026-02-16', preview: 'Today I learned about the importance of consistency...', template: 'gratitude' }
  ]);

  const templates = [
    { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'from-pink-500 to-rose-500', iconColor: 'text-pink-400', bg: 'bg-pink-500/20' },
    { id: 'reflection', label: 'Reflection', icon: BookOpen, color: 'from-blue-500 to-indigo-500', iconColor: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'goals', label: 'Goals', icon: Target, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400', bg: 'bg-green-500/20' }
  ];

  const handleSave = () => {
    if (!content.trim()) return;
    const newEntry = {
      id: Date.now(),
      title: `${template.charAt(0).toUpperCase() + template.slice(1)} Entry`,
      date: new Date().toISOString().split('T')[0],
      preview: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      template
    };
    setEntries([newEntry, ...entries]);
    setContent('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getTemplateInfo = (id) => templates.find(t => t.id === id) || templates[0];

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : `bg-gradient-to-br ${colors.bgGradient}`} relative overflow-hidden`}>
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
            <BookOpen size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Journal
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Reflect, write, grow.</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Template Selector */}
        <div className="flex flex-wrap gap-3">
          {templates.map(t => (
            <button 
              key={t.id} 
              onClick={() => setTemplate(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 border ${
                template === t.id 
                  ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-lg`
                  : theme === 'light'
                    ? 'bg-white/60 border-gray-200 text-gray-700 hover:bg-white/80'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className={`w-full h-64 rounded-xl p-4 border backdrop-blur-sm transition-all resize-none ${
              theme === 'light'
                ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
                : 'bg-white/5 border-white/10 text-white focus:border-indigo-400 placeholder-white/20'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          />
          <div className="flex justify-between items-center mt-4">
            <span className={`text-sm ${colors.muted}`}>{content.length} characters</span>
            <button 
              onClick={handleSave}
              disabled={!content.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-105'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 hover:opacity-90'
              }`}
            >
              <Plus size={18} /> Save Entry
            </button>
          </div>
        </div>

        {/* Past Entries */}
        <div>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <Calendar size={20} className={colors.primary} />
            Past Entries
          </h2>
          <div className="space-y-3">
            {entries.map(entry => {
              const tInfo = getTemplateInfo(entry.template);
              return (
                <div key={entry.id} className={`group glass-card-hover p-5 cursor-pointer ${theme === 'light' ? 'bg-white/70' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tInfo.bg}`}>
                        <tInfo.icon size={16} className={tInfo.iconColor} />
                      </div>
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{entry.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono ${colors.muted}`}>{entry.date}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm ml-11 ${colors.muted}`}>{entry.preview}</p>
                </div>
              );
            })}
            {entries.length === 0 && (
              <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
                theme === 'light' ? 'border-gray-300 text-gray-400' : 'border-white/10 text-white/30'
              }`}>
                <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
                <p>No entries yet. Start writing above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDeck;
