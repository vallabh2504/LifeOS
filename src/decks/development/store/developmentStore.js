import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const useDevelopmentStore = create((set, get) => ({
  // 3-level hierarchy data
  categories: [],
  projects: [],
  tasks: [],
  notes: [],
  doubts: [],
  
  loading: false,
  error: null,
  
  // Selected items
  selectedCategoryId: null,
  selectedProjectId: null,
  selectedTab: 'tasks', // tasks, notes, doubts

  // Set selected category
  setSelectedCategory: (id) => set({ selectedCategoryId: id, selectedProjectId: null }),
  
  // Set selected project
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  
  // Set active tab
  setSelectedTab: (tab) => set({ selectedTab: tab }),

  // Fetch all development data
  fetchAll: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Fetch categories
      const { data: categories } = await supabase
        .from('dev_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      // Fetch projects
      const { data: projects } = await supabase
        .from('dev_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('dev_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      // Fetch notes
      const { data: notes } = await supabase
        .from('dev_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      // Fetch doubts
      const { data: doubts } = await supabase
        .from('dev_doubts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      set({ 
        categories: categories || [], 
        projects: projects || [], 
        tasks: tasks || [],
        notes: notes || [],
        doubts: doubts || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching development data:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Category CRUD
  addCategory: async (category) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('dev_categories')
        .insert([{ ...category, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ categories: [...state.categories, data] }));
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('dev_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('dev_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        projects: state.projects.filter((p) => p.category_id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Project CRUD
  addProject: async (project) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('dev_projects')
        .insert([{ ...project, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ projects: [...state.projects, data] }));
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('dev_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? data : p))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('dev_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        tasks: state.tasks.filter((t) => t.project_id !== id),
        notes: state.notes.filter((n) => n.project_id !== id),
        doubts: state.doubts.filter((d) => d.project_id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Task CRUD (Kanban)
  addTask: async (task) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('dev_tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [...state.tasks, data] }));
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('dev_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  moveTask: async (id, newStatus, newOrderIndex) => {
    try {
      const { data, error } = await supabase
        .from('dev_tasks')
        .update({ status: newStatus, order_index: newOrderIndex || 0 })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('dev_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Notes CRUD
  addNote: async (note) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('dev_notes')
        .insert([{ ...note, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ notes: [data, ...state.notes] }));
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateNote: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('dev_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? data : n))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase
        .from('dev_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Doubts CRUD
  addDoubt: async (doubt) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('dev_doubts')
        .insert([{ ...doubt, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ doubts: [data, ...state.doubts] }));
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  resolveDoubt: async (id) => {
    try {
      const { data, error } = await supabase
        .from('dev_doubts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        doubts: state.doubts.map((d) => (d.id === id ? data : d))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteDoubt: async (id) => {
    try {
      const { error } = await supabase
        .from('dev_doubts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        doubts: state.doubts.filter((d) => d.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Get tasks for Today's Agenda
  getTodayTasks: () => {
    const { tasks } = get();
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => 
      t.status !== 'done' && 
      t.due_date && 
      t.due_date.split('T')[0] <= today
    );
  },

  // Get pending tasks count
  getPendingTasksCount: () => {
    const { tasks } = get();
    return tasks.filter(t => t.status !== 'done').length;
  }
}));

export default useDevelopmentStore;
