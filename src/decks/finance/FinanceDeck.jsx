import React, { useEffect } from 'react';
import useFinanceStore from './store/financeStore';
import CategoryCard from './CategoryCard';
import ExpenseForm from './ExpenseForm';
import BudgetManager from './BudgetManager';
import { useTheme } from '../../shared/contexts/ThemeContext';

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
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSpent = getTotalSpent();
  const totalBudget = getTotalBudget();
  const remainingBudget = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getThemeStyles = () => {
    switch (theme) {
      case 'midnight': return 'bg-slate-950 text-cyan-50';
      case 'nature': return 'bg-green-950 text-green-50';
      case 'dark': return 'bg-gray-900 text-gray-100';
      default: return 'bg-gray-50 text-gray-900';
    }
  };

  if (loading && expenses.length === 0) {
    return <div className="p-8 text-center">Loading Finance Data...</div>;
  }

  return (
    <div className={`min-h-screen p-6 ${getThemeStyles()}`}>
      <h1 className="text-3xl font-bold mb-8">Finance Tracker</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-1 space-y-8">
          <ExpenseForm />
          <BudgetManager />
        </div>

        {/* Right Column: Overview & Categories */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Card */}
          <div className="bg-opacity-50 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-around items-center text-center">
            <div>
              <p className="text-sm opacity-70">Total Spent</p>
              <p className="text-2xl font-bold text-red-400">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Remaining</p>
              <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-400'}`}>
                ${remainingBudget.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-70">Total Budget</p>
              <p className="text-2xl font-bold text-blue-400">${totalBudget.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress Bar for Total */}
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full ${percentageUsed > 100 ? 'bg-red-600' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
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
                <p className="text-gray-500 italic">No budgets set. Use the manager to add categories.</p>
              )}
            </div>
            
            {/* Show expenses not in budget categories */}
            {(() => {
              const budgetedCategories = new Set(budgets.map(b => b.category));
              const unbudgetedExpenses = expenses.filter(e => !budgetedCategories.has(e.category));
              const unbudgetedCategories = [...new Set(unbudgetedExpenses.map(e => e.category))];
              
              if (unbudgetedCategories.length > 0) {
                return (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-500">Unbudgeted Spending</h3>
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

          {/* Recent Transactions List (Optional but useful) */}
          <div>
             <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
             <div className="bg-gray-800 bg-opacity-40 rounded-lg overflow-hidden border border-gray-700">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-700 bg-opacity-50 text-sm uppercase tracking-wider">
                     <th className="p-3">Date</th>
                     <th className="p-3">Category</th>
                     <th className="p-3">Notes</th>
                     <th className="p-3 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody>
                   {expenses.slice(0, 5).map((expense) => (
                     <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30">
                       <td className="p-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                       <td className="p-3 text-sm">{expense.category}</td>
                       <td className="p-3 text-sm opacity-70 truncate max-w-xs">{expense.notes}</td>
                       <td className="p-3 text-sm text-right font-medium">${expense.amount}</td>
                     </tr>
                   ))}
                   {expenses.length === 0 && (
                      <tr><td colSpan="4" className="p-4 text-center opacity-50">No expenses recorded yet.</td></tr>
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
