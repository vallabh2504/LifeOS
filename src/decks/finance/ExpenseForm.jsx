import React, { useState } from 'react';
import useFinanceStore from './store/financeStore';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { Plus, Receipt } from 'lucide-react';

const ExpenseForm = () => {
  const { addExpense, budgets, loading } = useFinanceStore();
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    try {
      await addExpense({
        date,
        category,
        amount: parseFloat(amount),
        notes
      });
      setFeedback('Expense added successfully!');
      setAmount('');
      setCategory('');
      setNotes('');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('Error adding expense.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Success/Error feedback */}
      {feedback && (
        <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
          feedback.includes('Error') 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border backdrop-blur-sm transition-all ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  : 'bg-white/5 border-white/10 text-white focus:border-cyan-500'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            />
          </div>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Amount</label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${colors.muted}`}>$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-7 pr-3 py-2.5 rounded-lg border backdrop-blur-sm transition-all ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    : 'bg-white/5 border-white/10 text-white focus:border-cyan-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Category</label>
          <input
            type="text"
            list="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg border backdrop-blur-sm transition-all ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500'
            } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            placeholder="e.g. Food, Transport"
          />
          <datalist id="categories">
            {budgets.map((b) => (
              <option key={b.id} value={b.category} />
            ))}
          </datalist>
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg border backdrop-blur-sm transition-all resize-none ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500'
            } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            rows="2"
            placeholder="Details about the expense..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !amount || !category}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'light'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
              : `bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg ${colors.glow} hover:scale-[1.02]`
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Adding...
            </span>
          ) : (
            <>
              <Plus size={18} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
