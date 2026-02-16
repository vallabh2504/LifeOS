import React, { useState } from 'react';
import useFinanceStore from './store/financeStore';
import { useTheme } from '../../shared/contexts/ThemeContext';

const BudgetManager = () => {
  const { budgets, updateBudget, loading } = useFinanceStore();
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const { theme } = useTheme();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    await updateBudget(newCategory, parseFloat(newAmount));
    setNewCategory('');
    setNewAmount('');
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
      <h2 className="text-xl font-bold mb-4">Budget Manager</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {budgets.map((b) => (
          <div key={b.id} className="flex justify-between items-center border-b p-2 border-gray-600">
            <span className="font-medium">{b.category}</span>
            <span className="font-bold">${b.amount}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleUpdate} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="e.g. Groceries"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Limit ($)</label>
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-full p-2 border rounded bg-transparent border-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Set Budget'}
        </button>
      </form>
    </div>
  );
};

export default BudgetManager;
