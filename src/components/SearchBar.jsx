import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, CheckCircle, DollarSign, Flame, Book, Folder, HelpCircle } from 'lucide-react';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { supabase } from '../../shared/services/supabaseClient';

const SearchBar = () => {
  const { theme, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const searchTerm = `%${query.toLowerCase()}%`;
        const allResults = [];

        // Search personal tasks
        const { data: personalTasks } = await supabase
          .from('personal_tasks')
          .select('id, title, due_date')
          .ilike('title', searchTerm)
          .eq('user_id', user.id)
          .limit(5);
        
        if (personalTasks) {
          personalTasks.forEach(t => allResults.push({
            type: 'Personal',
            icon: <CheckCircle size={14} className="text-blue-400" />,
            title: t.title,
            subtext: t.due_date ? `Due: ${t.due_date.split('T')[0]}` : 'No due date',
            action: () => navigate('/personal')
          }));
        }

        // Search development tasks
        const { data: devTasks } = await supabase
          .from('dev_tasks')
          .select('id, title, status, project_id')
          .ilike('title', searchTerm)
          .eq('user_id', user.id)
          .limit(5);
        
        if (devTasks) {
          devTasks.forEach(t => allResults.push({
            type: 'Development',
            icon: <Folder size={14} className="text-purple-400" />,
            title: t.title,
            subtext: `Status: ${t.status}`,
            action: () => navigate('/development')
          }));
        }

        // Search development notes
        const { data: devNotes } = await supabase
          .from('dev_notes')
          .select('id, title, content')
          .ilike('title', searchTerm)
          .eq('user_id', user.id)
          .limit(3);
        
        if (devNotes) {
          devNotes.forEach(n => allResults.push({
            type: 'Notes',
            icon: <FileText size={14} className="text-indigo-400" />,
            title: n.title,
            subtext: n.content?.substring(0, 50) + '...',
            action: () => navigate('/development')
          }));
        }

        // Search development doubts
        const { data: devDoubts } = await supabase
          .from('dev_doubts')
          .select('id, question, resolved')
          .ilike('question', searchTerm)
          .eq('user_id', user.id)
          .limit(3);
        
        if (devDoubts) {
          devDoubts.forEach(d => allResults.push({
            type: 'Doubts',
            icon: <HelpCircle size={14} className="text-yellow-400" />,
            title: d.question,
            subtext: d.resolved ? 'Resolved' : 'Unresolved',
            action: () => navigate('/development')
          }));
        }

        // Search expenses
        const { data: expenses } = await supabase
          .from('expenses')
          .select('id, amount, description, category')
          .ilike('description', searchTerm)
          .eq('user_id', user.id)
          .limit(3);
        
        if (expenses) {
          expenses.forEach(e => allResults.push({
            type: 'Finance',
            icon: <DollarSign size={14} className="text-emerald-400" />,
            title: `$${e.amount} - ${e.category}`,
            subtext: e.description,
            action: () => navigate('/finance')
          }));
        }

        // Search habits
        const { data: habits } = await supabase
          .from('habits')
          .select('id, title')
          .ilike('title', searchTerm)
          .eq('user_id', user.id)
          .limit(3);
        
        if (habits) {
          habits.forEach(h => allResults.push({
            type: 'Habit',
            icon: <Flame size={14} className="text-orange-400" />,
            title: h.title,
            subtext: 'Habit tracker',
            action: () => navigate('/habits')
          }));
        }

        // Search journal entries
        const { data: journal } = await supabase
          .from('journal_entries')
          .select('id, title, content, entry_date')
          .ilike('title', searchTerm)
          .eq('user_id', user.id)
          .limit(3);
        
        if (journal) {
          journal.forEach(j => allResults.push({
            type: 'Journal',
            icon: <Book size={14} className="text-pink-400" />,
            title: j.title,
            subtext: j.entry_date,
            action: () => navigate('/journal')
          }));
        }

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${colors.border} ${colors.cardBg} ${colors.text} transition-all focus-within:border-opacity-100`} style={{ borderColor: colors.primaryLight }}>
        <Search size={18} className={colors.muted} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search everything..."
          className={`bg-transparent outline-none flex-1 ${colors.text} placeholder:${colors.muted}`}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className={colors.muted}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className={`absolute top-full mt-2 w-96 max-h-96 overflow-y-auto rounded-xl ${colors.cardBg} border ${colors.border} shadow-xl z-50`}>
          {loading ? (
            <div className={`p-4 text-center ${colors.muted}`}>Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    result.action();
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:${colors.primaryBg}/10 transition-colors`}
                >
                  <div className={`p-2 rounded-lg ${colors.primaryBg}/10`}>
                    {result.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${colors.text}`}>{result.title}</p>
                    <p className={`text-xs ${colors.muted}`}>{result.subtext}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${colors.primaryBg}/20 ${colors.primary}`}>
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-4 text-center ${colors.muted}`}>No results found</div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
