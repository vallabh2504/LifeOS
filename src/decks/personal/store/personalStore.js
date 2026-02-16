import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const usePersonalStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('personal_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      set({ tasks: data, loading: false });
    } catch (error) {
      console.error('Error fetching personal tasks:', error);
      // Fallback to empty if table doesn't exist
      set({ tasks: [], error: error.message, loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const newTask = { ...task, user_id: user.id, status: 'pending' };
      const { data, error } = await supabase
        .from('personal_tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  toggleTask: async (id, status) => {
    try {
      const { error } = await supabase
        .from('personal_tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t))
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('personal_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

export default usePersonalStore;
