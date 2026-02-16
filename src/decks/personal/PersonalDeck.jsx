import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

const PersonalDeck = () => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Personal Checklist</h1>
      
      {/* Add Task */}
      <div className="flex gap-4 mb-8">
        <input 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
        />
        <button onClick={addTask} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg flex items-center gap-2">
          <Plus size={20}/> Add
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className={`flex items-center gap-4 p-4 rounded-lg transition ${task.completed ? 'bg-gray-800/50 opacity-60' : 'bg-gray-800'}`}>
            <button onClick={() => toggleTask(task.id)} className="text-blue-400 hover:text-blue-300">
              {task.completed ? <CheckCircle size={24}/> : <Circle size={24}/>}
            </button>
            <div className="flex-1">
              <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
              {task.due && <span className="text-sm text-gray-400">Due: {task.due}</span>}
            </div>
            <button className="text-red-400 hover:text-red-300">
              <Trash2 size={20}/>
            </button>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p>No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  );
};

export default PersonalDeck;
