import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const useHabitsStore = create((set, get) => ({
  habits: [],
  logs: [], // This will hold logs for all habits, ideally filtered by time range if dataset grows
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true });
    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch logs. For scalability, we might restrict this later, but fetching all for now for charts
      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*');

      if (logsError) throw logsError;

      set({ habits: habitsData, logs: logsData, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addHabit: async (title, frequency = { type: 'daily' }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const newHabit = {
        user_id: user.id,
        title,
        frequency, // JSONB
        target_count: 1,
        current_streak: 0,
        longest_streak: 0,
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ habits: [data, ...state.habits] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteHabit: async (id) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        logs: state.logs.filter((l) => l.habit_id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  toggleHabit: async (habitId, dateStr) => {
    // dateStr should be YYYY-MM-DD
    const state = get();
    // Check if log exists for this habit on this date
    const existingLog = state.logs.find(
      (l) => l.habit_id === habitId && l.completed_date === dateStr
    );

    try {
      if (existingLog) {
        // Remove log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existingLog.id);

        if (error) throw error;

        set((state) => ({
          logs: state.logs.filter((l) => l.id !== existingLog.id)
        }));
      } else {
        // Add log
        const { data: { user } } = await supabase.auth.getUser();
         if (!user) throw new Error('No user logged in');

        const newLog = {
          habit_id: habitId,
          user_id: user.id,
          completed_date: dateStr,
          count: 1
        };

        const { data, error } = await supabase
          .from('habit_logs')
          .insert([newLog])
          .select()
          .single();

        if (error) throw error;

        set((state) => ({ logs: [...state.logs, data] }));
      }
      
      // Optionally refresh habits to get updated streak from DB trigger
      // But for UI responsiveness we might just wait or assume optimistically?
      // The trigger updates the habit row. Let's fetch just that habit to update streak.
      const { data: updatedHabit } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habitId)
        .single();
        
      if (updatedHabit) {
        set((state) => ({
            habits: state.habits.map(h => h.id === habitId ? updatedHabit : h)
        }));
      }

    } catch (error) {
      set({ error: error.message });
    }
  },

  getHabitLogs: (habitId) => {
    return get().logs.filter(l => l.habit_id === habitId);
  }
}));

export default useHabitsStore;
