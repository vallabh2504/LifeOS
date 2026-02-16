import React, { useState } from 'react';
import { BookOpen, Heart, Target, Lightbulb, Plus } from 'lucide-react';

const JournalDeck = () => {
  const [template, setTemplate] = useState('blank');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([
    { id: 1, title: 'Morning Reflection', date: '2026-02-16', preview: 'Today I learned about...', template: 'gratitude' }
  ]);

  const templates = [
    { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'text-pink-400' },
    { id: 'reflection', label: 'Reflection', icon: BookOpen, color: 'text-blue-400' },
    { id: 'goals', label: 'Goals', icon: Target, color: 'text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Journal</h1>
        
        {/* Template Selector */}
        <div className="flex gap-4 mb-8">
          {templates.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${template === t.id ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}>
              <t.icon className={t.color} size={18}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-64 bg-gray-900 rounded-lg p-4 border border-gray-700 focus:border-blue-500 outline-none resize-none"
          />
          <div className="flex justify-between mt-4">
            <span className="text-gray-400 text-sm">{content.length} characters</span>
            <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18}/> Save Entry
            </button>
          </div>
        </div>

        {/* Past Entries */}
        <h2 className="text-xl font-bold mb-4">Past Entries</h2>
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{entry.title}</h3>
                <span className="text-gray-400 text-sm">{entry.date}</span>
              </div>
              <p className="text-gray-400 text-sm">{entry.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalDeck;
