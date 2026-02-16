import React, { useState, useEffect } from 'react';
import usePersonalStore from '../decks/personal/store/personalStore';
import useDevelopmentStore from '../decks/development/store/developmentStore';
import useFinanceStore from '../decks/finance/store/financeStore';
import useHabitsStore from '../decks/habits/store/habitsStore';
import useJournalStore from '../decks/journal/store/journalStore';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Access stores
  const personalTasks = usePersonalStore((state) => state.tasks);
  const devTasks = useDevelopmentStore((state) => state.tasks);
  const expenses = useFinanceStore((state) => state.expenses);
  const habits = useHabitsStore((state) => state.habits);
  const journalEntries = useJournalStore((state) => state.entries);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const combinedResults = [];

    // Search Personal
    personalTasks?.forEach(task => {
      if (task.title?.toLowerCase().includes(lowerQuery)) {
        combinedResults.push({ type: 'Personal', title: task.title, id: task.id, link: '/personal' });
      }
    });

    // Search Development
    devTasks?.forEach(task => {
      if (task.title?.toLowerCase().includes(lowerQuery)) {
        combinedResults.push({ type: 'Development', title: task.title, id: task.id, link: '/development' });
      }
    });

    // Search Finance
    expenses?.forEach(exp => {
      if (exp.description?.toLowerCase().includes(lowerQuery) || exp.category?.toLowerCase().includes(lowerQuery)) {
        combinedResults.push({ type: 'Finance', title: `${exp.description} ($${exp.amount})`, id: exp.id, link: '/finance' });
      }
    });

    // Search Habits
    habits?.forEach(habit => {
      if (habit.title?.toLowerCase().includes(lowerQuery)) {
        combinedResults.push({ type: 'Habit', title: habit.title, id: habit.id, link: '/habits' });
      }
    });

    // Search Journal
    journalEntries?.forEach(entry => {
      if (entry.content?.toLowerCase().includes(lowerQuery)) {
        combinedResults.push({ type: 'Journal', title: entry.content.substring(0, 30) + '...', id: entry.id, link: '/journal' });
      }
    });

    setResults(combinedResults);
  }, [query, personalTasks, devTasks, expenses, habits, journalEntries]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search LifeOS..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-none"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onFocus={() => setIsOpen(true)}
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.map((result, idx) => (
            <Link 
              key={`${result.type}-${result.id}-${idx}`}
              to={result.link}
              className="block px-4 py-3 hover:bg-gray-700 border-b border-gray-700 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{result.title}</span>
                <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-full">{result.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
