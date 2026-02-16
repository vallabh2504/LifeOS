import React, { useState } from 'react';
import useFinanceStore from './store/financeStore';
import { useTheme } from '../../shared/contexts/ThemeContext';

const ExpenseForm = () => {
  const { addExpense, budgets, loading } = useFinanceStore();
  const { theme } = useTheme();

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
      setFeedback('Expense added!');
      setAmount('');
      setCategory('');
      setNotes('');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('Error adding expense.');
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'midnight':
        return 'bg-slate-900 text-cyan-400 border-slate-700';
      case 'nature':
        return 'bg-green-900 text-green-100 border-green-700';
      case 'dark':
        return 'bg-gray-800 text-white border-gray-700';
      default:
        return 'bg-white text-gray-900 border-gray-200';
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md border ${getThemeStyles()} mb-6`}>
      <h2 className="text-xl font-bold mb-4">Log Expense</h2>

      {feedback && (
        <div className={`mb-4 p-2 rounded text-sm ${feedback.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            list="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="e.g. Food"
          />
          <datalist id="categories">
            {budgets.map((b) => (
              <option key={b.id} value={b.category} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
            rows="2"
            placeholder="Details about the expense..."
          />
        </div>
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
