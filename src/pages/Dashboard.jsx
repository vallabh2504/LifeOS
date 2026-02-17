import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePersonalStore from '../decks/personal/store/personalStore';
import useDevelopmentStore from '../decks/development/store/developmentStore';
import useFinanceStore from '../decks/finance/store/financeStore';
import useHabitsStore from '../decks/habits/store/habitsStore';
import useJournalStore from '../decks/journal/store/journalStore';
import { calendarService } from '../shared/services/calendarService';
import { useTheme } from '../shared/contexts/ThemeContext';
import { Calendar, Zap, Layout, User, Code, DollarSign, Flame, Book, RefreshCcw } from 'lucide-react';

const Dashboard = () => {
  // Use stores
  const { tasks: personalTasks, fetchTasks: fetchPersonal, loading: pLoading } = usePersonalStore();
  const { tasks: devTasks, fetchAll: fetchDev, loading: dLoading } = useDevelopmentStore();
  const { expenses, fetchData: fetchFinance, loading: fLoading } = useFinanceStore();
  const { habits, fetchHabits, loading: hLoading } = useHabitsStore();
  const { entries: journalEntries, fetchEntries, loading: jLoading } = useJournalStore();
  const { theme, getThemeColors, getThemeName } = useTheme();
  const colors = getThemeColors();

  useEffect(() => {
    fetchPersonal();
    fetchDev();
    fetchFinance();
    fetchHabits();
    fetchEntries();
  }, []);

  const pendingPersonal = personalTasks?.filter(t => t.status !== 'done') || [];
  const pendingDev = devTasks?.filter(t => t.status !== 'done') || [];
  const activeHabits = habits?.filter(h => h.active !== false) || []; 
  const recentExpenses = expenses?.slice(0, 5) || [];
  const recentJournal = journalEntries?.slice(0, 3) || [];

  const handleCalendarSync = async () => {
    try {
      await calendarService.signIn();
      const events = await calendarService.listEvents();
      alert(`Synced ${events.length} events from Google Calendar!`);
    } catch (error) {
      console.error("Calendar sync failed", error);
      alert("Calendar sync failed. See console.");
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' : colors.bgGradient}`}>
      {/* Background Decor */}
      <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] ${colors.primary}/5 rounded-full blur-[120px] pointer-events-none`}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tighter ${theme === 'light' ? 'text-gray-900' : colors.text}`}>
            <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              SYSTEM.LifeOS
            </span>
          </h1>
          <p className={`mt-2 font-medium tracking-wide uppercase text-xs flex items-center gap-2 ${colors.muted}`}>
            <span className={`w-2 h-2 ${colors.primary.replace('text-', 'bg-')} rounded-full animate-pulse shadow-[0_0_8px_currentColor]`}></span>
            Operator: Vallabh | Status: Optimal | Theme: {getThemeName()}
          </p>
        </div>
        <button 
          onClick={handleCalendarSync}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 backdrop-blur-xl border ${colors.border} ${colors.cardBg} ${colors.text} hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
        >
          <Calendar size={18} className={colors.primary} />
          <span>Sync Neural Calendar</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 mt-8">
        
        {/* Today's Agenda - Left Column */}
        <section className="lg:col-span-4 space-y-6">
          <div className={`glass-card h-full p-6 ${theme === 'light' ? 'bg-white/60' : ''}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-3 ${colors.text}`}>
              <Zap className={colors.primary} size={20} />
              Current Priorities
            </h2>
            
            <div className="space-y-4">
              {pendingPersonal.length === 0 && pendingDev.length === 0 && (
                <div className="text-center py-10">
                  <p className={`italic ${colors.muted}`}>Clear schedule. All objectives met.</p>
                </div>
              )}
              
              {pendingPersonal.slice(0, 4).map(task => (
                <div key={task.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${theme === 'light' ? 'bg-white/40 border-gray-200 hover:bg-white/60' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-8 ${colors.primary.replace('text-', 'bg-')} rounded-full shadow-[0_0_8px_currentColor]`}></div>
                    <div>
                      <h3 className={`font-semibold text-sm group-hover:${colors.primary} transition-colors ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{task.title}</h3>
                      <span className={`text-[10px] uppercase tracking-widest ${colors.muted}`}>Personal</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono ${colors.muted}`}>{task.due_date ? task.due_date.split('T')[0] : 'STANDBY'}</span>
                </div>
              ))}

              {pendingDev.slice(0, 4).map(task => (
                <div key={task.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${theme === 'light' ? 'bg-white/40 border-gray-200 hover:bg-white/60' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-purple-400 transition-colors text-white">{task.title}</h3>
                      <span className={`text-[10px] uppercase tracking-widest ${colors.muted}`}>Dev.Branch</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono ${colors.muted}`}>{task.due_date ? task.due_date.split('T')[0] : 'STANDBY'}</span>
                </div>
              ))}
            </div>
            
            {(pendingPersonal.length > 4 || pendingDev.length > 4) && (
              <button className={`w-full mt-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:${colors.primary} ${colors.muted}`}>
                + View All Uplinks
              </button>
            )}
          </div>
        </section>

        {/* Right Column - Decks Grid */}
        <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Deck Cards */}
          <DeckCard 
            to="/personal" 
            title="Personal" 
            count={pendingPersonal.length} 
            label="Pending Tasks" 
            icon={<User size={24} />}
            color="from-blue-500/20 to-blue-900/40"
            accent="bg-blue-500"
            colors={colors}
            theme={theme}
          />

          <DeckCard 
            to="/development" 
            title="Development" 
            count={pendingDev.length} 
            label="Active Issues" 
            icon={<Code size={24} />}
            color="from-purple-500/20 to-purple-900/40"
            accent="bg-purple-500"
            colors={colors}
            theme={theme}
          />

          <DeckCard 
            to="/finance" 
            title="Finance" 
            count={recentExpenses.length} 
            label="Recent Txns" 
            icon={<DollarSign size={24} />}
            color="from-emerald-500/20 to-emerald-900/40"
            accent="bg-emerald-500"
            colors={colors}
            theme={theme}
          />

          <DeckCard 
            to="/habits" 
            title="Habits" 
            count={activeHabits.length} 
            label="Active Streaks" 
            icon={<Flame size={24} />}
            color="from-orange-500/20 to-orange-900/40"
            accent="bg-orange-500"
            colors={colors}
            theme={theme}
          />

          <DeckCard 
            to="/journal" 
            title="Journal" 
            count={recentJournal.length} 
            label="Recent Entries" 
            icon={<Book size={24} />}
            color="from-indigo-500/20 to-indigo-900/40"
            accent="bg-indigo-500"
            colors={colors}
            theme={theme}
            className="md:col-span-2"
          />

        </section>
      </div>
    </div>
  );
};

const DeckCard = ({ to, title, count, label, icon, color, accent, colors, theme, className = "" }) => (
  <Link to={to} className={`group block ${className}`}>
    <div className={`h-full glass-card-hover rounded-2xl p-6 relative overflow-hidden ${theme === 'light' ? 'bg-white/70' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-8">
          <div className={`p-3 rounded-xl ${theme === 'light' ? 'bg-gray-100 border border-gray-200' : 'bg-white/5 border border-white/10'} group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-3xl font-black font-mono group-hover:text-white transition-colors ${theme === 'light' ? 'text-gray-800' : colors.text}`}>
              {count.toString().padStart(2, '0')}
            </span>
            <span className={`text-[10px] uppercase tracking-tighter font-bold ${colors.muted}`}>{label}</span>
          </div>
        </div>
        
        <div>
          <h3 className={`text-xl font-bold tracking-tight group-hover:translate-x-1 transition-transform ${theme === 'light' ? 'text-gray-900' : colors.text}`}>{title}</h3>
          <div className={`w-12 h-1 ${accent} mt-2 rounded-full group-hover:w-20 transition-all duration-500 shadow-lg`}></div>
        </div>
      </div>
      
      {/* Decorative inner glow */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${colors.primary}/10 rounded-full blur-2xl group-hover:${colors.primary}/20 transition-colors`}></div>
    </div>
  </Link>
);

export default Dashboard;
