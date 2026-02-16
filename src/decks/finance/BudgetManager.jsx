import React, { useState } from 'react';
import useFinanceStore from './store/financeStore';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { Settings, Plus, DollarSign } from 'lucide-react';

const BudgetManager = () => {
  const { budgets, updateBudget, loading } = useFinanceStore();
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    await updateBudget(newCategory, parseFloat(newAmount));
    setNewCategory('');
    setNewAmount('');
  };

  return (
    <div>
      <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colors.text}`}>
        <Settings size={18} className={colors.primary} />
        Budget Manager
      </h2>
      
      {/* Existing Budgets */}
      <div className="space-y-2 mb-6">
        {budgets.map((b) => (
          <div key={b.id} className={`flex justify-between items-center p-3 rounded-xl border transition-all hover:scale-[1.01] ${
            theme === 'light'
              ? 'bg-white/40 border-gray-200'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary.replace('text-', 'bg-')} shadow-[0_0_6px_currentColor]`}></div>
              <span className={`font-medium text-sm ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{b.category}</span>
            </div>
            <span className={`font-bold text-sm font-mono ${colors.primary}`}>${b.amount}</span>
          </div>
        ))}
        {budgets.length === 0 && (
          <p className={`text-sm italic ${colors.muted}`}>No budgets set yet.</p>
        )}
      </div>

      {/* Add/Update Form */}
      <form onSubmit={handleUpdate} className="space-y-3">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Category</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg border backdrop-blur-sm transition-all ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500'
            } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
            placeholder="e.g. Groceries"
          />
        </div>
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Budget Limit</label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${colors.muted}`}>$</span>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
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
        <button 
          type="submit" 
          disabled={loading || !newCategory || !newAmount}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'light'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
              : `bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg ${colors.glow} hover:scale-[1.02]`
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : (
            <>
              <Plus size={18} />
              Set Budget
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BudgetManager;
