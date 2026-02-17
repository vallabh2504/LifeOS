import React, { useEffect, useState } from 'react';
import useDevelopmentStore from './store/developmentStore';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { calendarService } from '../../shared/services/calendarService';
import { 
  Plus, GripVertical, CheckCircle, Clock, Circle, Folder, FileText, 
  HelpCircle, ChevronRight, X, Calendar, Trash2, Edit3, Send, BookOpen
} from 'lucide-react';

const DevelopmentDeck = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  const {
    categories, projects, tasks, notes, doubts,
    selectedCategoryId, selectedProjectId, selectedTab,
    setSelectedCategory, setSelectedProject, setSelectedTab,
    fetchAll, addCategory, addProject, addTask, addNote, addDoubt,
    updateTask, moveTask, deleteTask, deleteProject, deleteCategory,
    updateNote, deleteNote, resolveDoubt, deleteDoubt, updateProject,
    loading
  } = useDevelopmentStore();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newDoubtQuestion, setNewDoubtQuestion] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-400', textColor: 'text-gray-400' },
    { id: 'doing', title: 'In Progress', color: 'border-blue-500', textColor: 'text-blue-400' },
    { id: 'done', title: 'Done', color: 'border-green-500', textColor: 'text-green-400' }
  ];

  // Filter tasks by selected project
  const projectTasks = selectedProjectId 
    ? tasks.filter(t => t.project_id === selectedProjectId)
    : selectedCategoryId
      ? tasks.filter(t => t.category_id === selectedCategoryId)
      : [];

  const projectNotes = selectedProjectId
    ? notes.filter(n => n.project_id === selectedProjectId)
    : selectedCategoryId
      ? notes.filter(n => n.category_id === selectedCategoryId)
      : [];

  const projectDoubts = selectedProjectId
    ? doubts.filter(d => d.project_id === selectedProjectId)
    : selectedCategoryId
      ? doubts.filter(d => d.category_id === selectedCategoryId)
      : [];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory({ name: newCategoryName, color: '#6366f1' });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim() || !selectedCategoryId) return;
    await addProject({ name: newProjectName, category_id: selectedCategoryId });
    setNewProjectName('');
    setShowAddProject(false);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const taskData = {
      title: newTaskTitle,
      status: 'todo',
      category_id: selectedCategoryId,
      project_id: selectedProjectId,
      due_date: newTaskDue || null,
      priority: 'medium'
    };
    await addTask(taskData);
    setNewTaskTitle('');
    setNewTaskDue('');
    setShowAddTask(false);
  };

  const handlePushToCalendar = async (task) => {
    try {
      // Show loading state
      const confirmSync = window.confirm(`Push "${task.title}" to Google Calendar?`);
      if (!confirmSync) return;
      
      await calendarService.signIn();
      const event = {
        summary: `[Dev] ${task.title}`,
        description: `Priority: ${task.priority}\nStatus: ${task.status}`,
        start: {
          dateTime: task.due_date || new Date().toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(new Date(task.due_date || Date.now()).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      const createdEvent = await calendarService.createEvent(event);
      await updateTask(task.id, { gcal_event_id: createdEvent.id });
      alert('✅ Task pushed to Google Calendar!');
    } catch (error) {
      console.error('Failed to push to calendar:', error);
      const errorMessage = error.message || error.error?.message || 'Unknown error';
      alert(`❌ Failed to push to calendar.\n\nError: ${errorMessage}\n\nMake sure you're signed in with a Google account.`);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteTitle.trim()) return;
    await addNote({
      title: newNoteTitle,
      content: newNoteContent,
      category_id: selectedCategoryId,
      project_id: selectedProjectId
    });
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleAddDoubt = async () => {
    if (!newDoubtQuestion.trim()) return;
    await addDoubt({
      question: newDoubtQuestion,
      category_id: selectedCategoryId,
      project_id: selectedProjectId
    });
    setNewDoubtQuestion('');
  };

  if (loading && categories.length === 0) {
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
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.glow}`}>
            <Folder size={28} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${colors.text}`}>
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                Development Deck
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Organize projects, track tasks, resolve doubts.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Left Sidebar - Categories & Projects */}
        <div className="lg:col-span-1 space-y-4">
          {/* Categories */}
          <div className={`rounded-2xl p-4 ${colors.cardBg} border ${colors.border}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold ${colors.text}`}>Categories</h3>
              <button 
                onClick={() => setShowAddCategory(true)}
                className={`p-1.5 rounded-lg ${colors.primaryBg} text-white hover:opacity-90 transition`}
              >
                <Plus size={16} />
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-3 flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Category name..."
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border ${colors.border} ${colors.text} ${colors.background}`}
                  autoFocus
                />
                <button onClick={handleAddCategory} className={`p-2 rounded-lg ${colors.primaryBg} text-white`}>
                  <Send size={14} />
                </button>
              </div>
            )}

            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      selectedCategoryId === cat.id 
                        ? `${colors.primaryBg} text-white` 
                        : `${colors.text} hover:${colors.primaryBg}/20`
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#6366f1' }}></div>
                    <span className="font-medium flex-1 text-left truncate">{cat.name}</span>
                    {selectedCategoryId === cat.id && <ChevronRight size={16} />}
                  </button>
                  
                  {/* Projects under category */}
                  {selectedCategoryId === cat.id && (
                    <div className="ml-6 mt-2 space-y-1">
                      {projects.filter(p => p.category_id === cat.id).map(proj => (
                        <button
                          key={proj.id}
                          onClick={() => setSelectedProject(proj.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedProjectId === proj.id
                              ? `${colors.accentBg} ${colors.text}`
                              : `${colors.muted} hover:${colors.text}`
                          }`}
                        >
                          <Folder size={14} />
                          <span className="flex-1 text-left truncate">{proj.name}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </button>
                      ))}
                      
                      {showAddProject ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                            placeholder="Project name..."
                            className={`flex-1 px-2 py-1.5 rounded text-sm border ${colors.border} ${colors.text} ${colors.background}`}
                            autoFocus
                          />
                          <button onClick={handleAddProject} className={`p-1.5 rounded ${colors.primaryBg} text-white`}>
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddProject(true)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${colors.muted} hover:${colors.text} transition`}
                        >
                          <Plus size={14} />
                          <span>Add Project</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {categories.length === 0 && (
                <p className={`text-sm text-center py-4 ${colors.muted}`}>No categories yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCategoryId ? (
            <>
              {/* Tabs */}
              <div className={`flex gap-2 p-1 rounded-xl ${colors.cardBg} border ${colors.border} w-fit`}>
                <button
                  onClick={() => setSelectedTab('tasks')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'tasks' 
                      ? `${colors.primaryBg} text-white` 
                      : `${colors.text} ${colors.muted} hover:${colors.text}`
                  }`}
                >
                  <span className="flex items-center gap-2"><CheckCircle size={16} /> Tasks</span>
                </button>
                <button
                  onClick={() => setSelectedTab('notes')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'notes' 
                      ? `${colors.primaryBg} text-white` 
                      : `${colors.text} ${colors.muted} hover:${colors.text}`
                  }`}
                >
                  <span className="flex items-center gap-2"><BookOpen size={16} /> Notes</span>
                </button>
                <button
                  onClick={() => setSelectedTab('doubts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'doubts' 
                      ? `${colors.primaryBg} text-white` 
                      : `${colors.text} ${colors.muted} hover:${colors.text}`
                  }`}
                >
                  <span className="flex items-center gap-2"><HelpCircle size={16} /> Doubts</span>
                </button>
              </div>

              {/* Tasks Tab */}
              {selectedTab === 'tasks' && (
                <div className="space-y-4">
                  {selectedProjectId && (
                    <div className="flex justify-between items-center">
                      <h3 className={`text-lg font-bold ${colors.text}`}>
                        {projects.find(p => p.id === selectedProjectId)?.name} - Tasks
                      </h3>
                      <button
                        onClick={() => setShowAddTask(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${colors.primaryBg} text-white hover:opacity-90 transition`}
                      >
                        <Plus size={18} /> Add Task
                      </button>
                    </div>
                  )}

                  {showAddTask && (
                    <div className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}>
                      <div className="flex gap-3">
                        <input
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task title..."
                          className={`flex-1 px-4 py-2 rounded-lg border ${colors.border} ${colors.text} ${colors.background}`}
                          autoFocus
                        />
                        <input
                          type="datetime-local"
                          value={newTaskDue}
                          onChange={(e) => setNewTaskDue(e.target.value)}
                          className={`px-4 py-2 rounded-lg border ${colors.border} ${colors.text} ${colors.background}`}
                        />
                        <button 
                          onClick={handleAddTask}
                          className={`px-4 py-2 rounded-lg ${colors.primaryBg} text-white font-medium`}
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => { setShowAddTask(false); setNewTaskTitle(''); setNewTaskDue(''); }}
                          className={`p-2 rounded-lg ${colors.muted}`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Kanban Board */}
                  <div className="grid grid-cols-3 gap-4">
                    {columns.map(col => (
                      <div key={col.id} className={`rounded-xl p-4 ${colors.cardBg} border-t-4 ${col.color}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${col.textColor}`}>
                          {col.id === 'todo' && <Circle size={18} />}
                          {col.id === 'doing' && <Clock size={18} />}
                          {col.id === 'done' && <CheckCircle size={18} />}
                          {col.title}
                          <span className="ml-auto text-sm opacity-70">
                            {projectTasks.filter(t => t.status === col.id).length}
                          </span>
                        </h4>
                        
                        <div className="space-y-3">
                          {projectTasks.filter(t => t.status === col.id).map(task => (
                            <div 
                              key={task.id} 
                              className={`group p-3 rounded-lg border ${colors.border} ${colors.cardBg} hover:border-opacity-50 transition`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  task.priority === 'urgent' ? 'bg-red-500/30 text-red-400' :
                                  task.priority === 'high' ? 'bg-orange-500/30 text-orange-400' :
                                  task.priority === 'medium' ? 'bg-blue-500/30 text-blue-400' :
                                  'bg-gray-500/30 text-gray-400'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                  {task.due_date && !task.gcal_event_id && (
                                    <button 
                                      onClick={() => handlePushToCalendar(task)}
                                      className={`p-1 rounded ${colors.primaryBg}/20 ${colors.primary} hover:${colors.primaryBg}/40`}
                                      title="Push to Calendar"
                                    >
                                      <Calendar size={14} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <p className={`font-medium mb-2 ${colors.text}`}>{task.title}</p>
                              {task.due_date && (
                                <div className={`text-xs ${colors.muted} flex items-center gap-1`}>
                                  <Calendar size={12} />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </div>
                              )}
                              <div className="flex gap-1 mt-3">
                                {col.id !== 'todo' && (
                                  <button 
                                    onClick={() => moveTask(task.id, col.id === 'done' ? 'doing' : 'todo')}
                                    className={`text-xs px-2 py-1 rounded ${colors.border} ${colors.muted} hover:${colors.text}`}
                                  >
                                    ←
                                  </button>
                                )}
                                {col.id !== 'done' && (
                                  <button 
                                    onClick={() => moveTask(task.id, col.id === 'todo' ? 'doing' : 'done')}
                                    className={`text-xs px-2 py-1 rounded ${colors.primaryBg} text-white`}
                                  >
                                    →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {selectedTab === 'notes' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}>
                    <div className="flex gap-3 mb-3">
                      <input
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Note title..."
                        className={`flex-1 px-4 py-2 rounded-lg border ${colors.border} ${colors.text} ${colors.background}`}
                      />
                    </div>
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write your notes here (supports markdown)..."
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.text} ${colors.background} resize-none`}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddNote}
                        disabled={!newNoteTitle.trim()}
                        className={`px-4 py-2 rounded-lg ${colors.primaryBg} text-white font-medium disabled:opacity-50`}
                      >
                        Save Note
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectNotes.map(note => (
                      <div key={note.id} className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold ${colors.text}`}>{note.title}</h4>
                          <div className="flex gap-1">
                            <button onClick={() => deleteNote(note.id)} className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm ${colors.muted} whitespace-pre-wrap`}>{note.content}</p>
                      </div>
                    ))}
                    {projectNotes.length === 0 && (
                      <p className={`col-span-2 text-center py-8 ${colors.muted}`}>No notes yet. Create one above.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Doubts Tab */}
              {selectedTab === 'doubts' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}>
                    <div className="flex gap-3">
                      <input
                        value={newDoubtQuestion}
                        onChange={(e) => setNewDoubtQuestion(e.target.value)}
                        placeholder="Ask a question or note a doubt..."
                        className={`flex-1 px-4 py-2 rounded-lg border ${colors.border} ${colors.text} ${colors.background}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddDoubt()}
                      />
                      <button
                        onClick={handleAddDoubt}
                        disabled={!newDoubtQuestion.trim()}
                        className={`px-4 py-2 rounded-lg ${colors.primaryBg} text-white font-medium disabled:opacity-50`}
                      >
                        Ask
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {projectDoubts.map(doubt => (
                      <div 
                        key={doubt.id} 
                        className={`p-4 rounded-xl ${colors.cardBg} border ${doubt.resolved ? 'border-green-500/30' : colors.border}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${doubt.resolved ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                            <HelpCircle size={18} className={doubt.resolved ? 'text-green-400' : 'text-yellow-400'} />
                          </div>
                          <div className="flex-1">
                            <p className={`${colors.text} ${doubt.resolved ? 'line-through opacity-60' : ''}`}>{doubt.question}</p>
                            <p className={`text-xs mt-1 ${colors.muted}`}>
                              {doubt.resolved ? `Resolved ${new Date(doubt.resolved_at).toLocaleDateString()}` : 'Unresolved'}
                            </p>
                          </div>
                          {!doubt.resolved && (
                            <button
                              onClick={() => resolveDoubt(doubt.id)}
                              className={`px-3 py-1 rounded-lg text-sm ${colors.primaryBg} text-white`}
                            >
                              Resolve
                            </button>
                          )}
                          <button onClick={() => deleteDoubt(doubt.id)} className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {projectDoubts.length === 0 && (
                      <p className={`text-center py-8 ${colors.muted}`}>No doubts yet. Ask a question above.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`flex flex-col items-center justify-center h-64 ${colors.muted}`}>
              <Folder size={48} className="mb-4 opacity-50" />
              <p>Select a category to view projects</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentDeck;
