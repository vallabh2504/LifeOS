import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const useJournalStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchEntries: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ entries: data, loading: false });
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      set({ entries: [], error: error.message, loading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const newEntry = { ...entry, user_id: user.id };
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ entries: [data, ...state.entries] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteEntry: async (id) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

export default useJournalStore;
