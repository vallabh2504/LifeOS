import React, { useEffect } from 'react';
import useFinanceStore from './store/financeStore';
import CategoryCard from './CategoryCard';
import ExpenseForm from './ExpenseForm';
import BudgetManager from './BudgetManager';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const FinanceDeck = () => {
  const { 
    fetchData, 
    expenses, 
    budgets, 
    getTotalSpent, 
    getTotalBudget, 
    getCategorySpending,
    loading 
  } = useFinanceStore();
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSpent = getTotalSpent();
  const totalBudget = getTotalBudget();
  const remainingBudget = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading && expenses.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-slate-100' : colors.bgGradient}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : colors.bgGradient} relative overflow-hidden`}>
      {/* Background effects */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${colors.primary}/10 rounded-full blur-[100px] pointer-events-none`}></div>
      <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] ${colors.primary.replace('text-', 'bg-')}/5 rounded-full blur-[80px] pointer-events-none`}></div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.glow}`}>
            <DollarSign size={28} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${theme === 'light' ? 'text-gray-900' : colors.text}`}>
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                Finance Tracker
              </span>
            </h1>
            <p className={`text-sm font-medium ${colors.muted}`}>Track expenses, manage budgets</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        {/* Left Column: Forms */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colors.text}`}>
              <TrendingUp size={18} className={colors.primary} />
              Add Transaction
            </h2>
            <ExpenseForm />
          </div>
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <BudgetManager />
          </div>
        </div>

        {/* Right Column: Overview & Categories */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Card */}
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-xl ${theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'} mb-3`}>
                  <TrendingDown size={24} className="text-red-500" />
                </div>
                <p className={`text-sm font-medium ${colors.muted} mb-1`}>Total Spent</p>
                <p className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>${totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-xl ${theme === 'light' ? 'bg-green-100' : 'bg-green-500/20'} mb-3`}>
                  <Wallet size={24} className="text-green-500" />
                </div>
                <p className={`text-sm font-medium ${colors.muted} mb-1`}>Remaining</p>
                <p className={`text-2xl font-black ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${remainingBudget.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-xl ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-500/20'} mb-3`}>
                  <TrendingUp size={24} className="text-blue-500" />
                </div>
                <p className={`text-sm font-medium ${colors.muted} mb-1`}>Total Budget</p>
                <p className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>${totalBudget.toFixed(2)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`mt-6 h-3 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} overflow-hidden`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${percentageUsed > 100 ? 'bg-red-500' : `bg-gradient-to-r ${colors.gradient}`}`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              ></div>
            </div>
            <p className={`text-xs mt-2 text-right ${colors.muted}`}>{percentageUsed.toFixed(1)}% used</p>
          </div>

          {/* Category Breakdown */}
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${colors.text}`}>
              <Wallet size={20} className={colors.primary} />
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => {
                const spent = getCategorySpending(budget.category);
                return (
                  <CategoryCard
                    key={budget.id}
                    category={budget.category}
                    spent={spent}
                    budget={budget.amount}
                  />
                );
              })}
              {budgets.length === 0 && (
                <p className={`italic ${colors.muted}`}>No budgets set. Use the manager to add categories.</p>
              )}
            </div>
            
            {/* Show expenses not in budget categories */}
            {(() => {
              const budgetedCategories = new Set(budgets.map(b => b.category));
              const unbudgetedExpenses = expenses.filter(e => !budgetedCategories.has(e.category));
              const unbudgetedCategories = [...new Set(unbudgetedExpenses.map(e => e.category))];
              
              if (unbudgetedCategories.length > 0) {
                return (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${colors.text}`}>
                      <span className="text-yellow-500">⚠️</span> Unbudgeted Spending
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unbudgetedCategories.map(cat => {
                        const spent = getCategorySpending(cat);
                        return (
                          <CategoryCard
                            key={cat}
                            category={cat}
                            spent={spent}
                            budget={0}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }
            })()}
          </div>

          {/* Recent Transactions */}
          <div className={`glass-card p-6 ${theme === 'light' ? 'bg-white/70' : ''}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${colors.text}`}>
              <TrendingUp size={20} className={colors.primary} />
              Recent Expenses
            </h2>
            <div className={`rounded-xl overflow-hidden border border-white/10 ${theme === 'light' ? 'bg-gray-50' : 'bg-black/20'}`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} border-b border-white/10`}>
                    <th className={`p-4 text-xs font-bold uppercase tracking-wider ${colors.muted}`}>Date</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-wider ${colors.muted}`}>Category</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-wider ${colors.muted}`}>Notes</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-wider ${colors.muted} text-right`}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      <td className="p-4 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className={`p-4 text-sm truncate max-w-xs ${colors.muted}`}>{expense.notes}</td>
                      <td className="p-4 text-sm text-right font-bold text-red-400">${expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                      <tr><td colSpan={4} className={`p-8 text-center ${colors.muted}`}>No expenses recorded yet.</td></tr>
                   )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinanceDeck;
