import React, { useState } from 'react';
import { Plus, GripVertical, CheckCircle, Clock, Circle } from 'lucide-react';

const DevelopmentDeck = () => {
  const [columns] = useState([
    { id: 'todo', title: 'To Do', color: 'border-gray-500' },
    { id: 'doing', title: 'In Progress', color: 'border-blue-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup React Project', status: 'todo', project: 'LifeOS' },
    { id: 2, title: 'Design Database Schema', status: 'doing', project: 'LifeOS' },
    { id: 3, title: 'Fix Authentication', status: 'done', project: 'LifeOS' }
  ]);

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Development Deck</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.id} className="bg-gray-800 rounded-xl p-4 border-t-4 border-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {col.id === 'todo' && <Circle className="text-gray-400" size={20}/>}
              {col.id === 'doing' && <Clock className="text-blue-400" size={20}/>}
              {col.id === 'done' && <CheckCircle className="text-green-400" size={20}/>}
              {col.title}
              <span className="text-sm text-gray-400 ml-auto">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </h2>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-600 transition cursor-grab">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-1 rounded">{task.project}</span>
                    <GripVertical className="text-gray-500" size={16}/>
                  </div>
                  <p className="font-medium">{task.title}</p>
                  <div className="flex gap-2 mt-3">
                    {col.id !== 'todo' && (
                      <button onClick={() => moveTask(task.id, col.id === 'done' ? 'doing' : 'todo')} 
                        className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">←</button>
                    )}
                    {col.id !== 'done' && (
                      <button onClick={() => moveTask(task.id, col.id === 'todo' ? 'doing' : 'done')}
                        className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded">→</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition">
              <Plus size={18}/> Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentDeck;
