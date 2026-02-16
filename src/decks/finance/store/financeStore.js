import { create } from 'zustand';
import { supabase } from '../../../shared/services/supabaseClient';

const useFinanceStore = create((set, get) => ({
  expenses: [],
  budgets: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true });
    try {
      // Fetch Expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // Fetch Budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*');

      if (budgetsError) throw budgetsError;

      set({ expenses: expensesData, budgets: budgetsData, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addExpense: async (expense) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const newExpense = {
        ...expense,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ expenses: [data, ...state.expenses] }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateBudget: async (category, amount) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Check if budget exists
      const existingBudget = get().budgets.find((b) => b.category === category);

      if (existingBudget) {
        const { data, error } = await supabase
          .from('budgets')
          .update({ amount })
          .eq('id', existingBudget.id)
          .select()
          .single();

        if (error) throw error;

        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === existingBudget.id ? data : b))
        }));
      } else {
        const { data, error } = await supabase
          .from('budgets')
          .insert([{ user_id: user.id, category, amount }])
          .select()
          .single();

        if (error) throw error;

        set((state) => ({ budgets: [...state.budgets, data] }));
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  getTotalSpent: () => {
    return get().expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  },

  getTotalBudget: () => {
    return get().budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  },

  getCategorySpending: (category) => {
    const expenses = get().expenses;
    return expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }
}));

export default useFinanceStore;
