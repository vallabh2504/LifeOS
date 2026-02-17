import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const useJournalStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],

  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchEntries: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      set({ entries: data, loading: false });
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      set({ entries: [], error: error.message, loading: false });
    }
  },

  // Check if today's entry exists, if not create a blank one
  ensureTodayEntry: async () => {
    const { entries } = get();
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(e => e.entry_date === today);
    
    if (!todayEntry) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const newEntry = { 
          user_id: user.id,
          title: `Journal - ${today}`,
          content: '',
          entry_date: today,
          template: 'blank'
        };
        
        const { data, error } = await supabase
          .from('journal_entries')
          .insert([newEntry])
          .select()
          .single();

        if (error) throw error;
        set((state) => ({ entries: [data, ...state.entries] }));
        return data;
      } catch (error) {
        console.error('Error creating today entry:', error);
      }
    }
    return todayEntry;
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
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateEntry: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? data : e))
      }));
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
  },

  // Get entries for a specific month (for calendar view)
  getEntriesForMonth: (year, month) => {
    const { entries } = get();
    return entries.filter(e => {
      const entryDate = new Date(e.entry_date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  },

  // Get today's entry if exists
  getTodayEntry: () => {
    const { entries } = get();
    const today = new Date().toISOString().split('T')[0];
    return entries.find(e => e.entry_date === today);
  }
}));

export default useJournalStore;
