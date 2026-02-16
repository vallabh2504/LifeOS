import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePersonalStore from '../decks/personal/store/personalStore';
import useDevelopmentStore from '../decks/development/store/developmentStore';
import useFinanceStore from '../decks/finance/store/financeStore';
import useHabitsStore from '../decks/habits/store/habitsStore';
import useJournalStore from '../decks/journal/store/journalStore';
import { calendarService } from '../shared/services/calendarService';
import { Calendar, Zap, Layout, User, Code, DollarSign, Flame, Book, RefreshCcw } from 'lucide-react';

const Dashboard = () => {
  // Use stores
  const { tasks: personalTasks, fetchTasks: fetchPersonal, loading: pLoading } = usePersonalStore();
  const { tasks: devTasks, fetchTasks: fetchDev, loading: dLoading } = useDevelopmentStore();
  const { expenses, fetchData: fetchFinance, loading: fLoading } = useFinanceStore();
  const { habits, fetchHabits, loading: hLoading } = useHabitsStore();
  const { entries: journalEntries, fetchEntries, loading: jLoading } = useJournalStore();

  useEffect(() => {
    fetchPersonal();
    fetchDev();
    fetchFinance();
    fetchHabits();
    fetchEntries();
  }, []);

  const pendingPersonal = personalTasks?.filter(t => t.status === 'pending') || [];
  const pendingDev = devTasks?.filter(t => t.status === 'pending') || [];
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
    <div className="p-6 lg:p-10 space-y-10 min-h-screen bg-primary relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter">
            SYSTEM.LifeOS
          </h1>
          <p className="text-muted mt-2 font-medium tracking-wide uppercase text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            Operator: Vallabh | Status: Optimal
          </p>
        </div>
        <button 
          onClick={handleCalendarSync}
          className="btn-primary flex items-center gap-3 group"
        >
          <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
          <span>Sync Neural Calendar</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Today's Agenda - Left Column */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Zap className="text-accent" size={20} />
              Current Priorities
            </h2>
            
            <div className="space-y-4">
              {pendingPersonal.length === 0 && pendingDev.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted italic">Clear schedule. All objectives met.</p>
                </div>
              )}
              
              {pendingPersonal.slice(0, 4).map(task => (
                <div key={task.id} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-accent rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{task.title}</h3>
                      <span className="text-[10px] text-muted uppercase tracking-widest">Personal</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted">{task.due_date ? task.due_date.split('T')[0] : 'STANDBY'}</span>
                </div>
              ))}

              {pendingDev.slice(0, 4).map(task => (
                <div key={task.id} className="group flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-purple-400 transition-colors">{task.title}</h3>
                      <span className="text-[10px] text-muted uppercase tracking-widest">Dev.Branch</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted">{task.due_date ? task.due_date.split('T')[0] : 'STANDBY'}</span>
                </div>
              ))}
            </div>
            
            {(pendingPersonal.length > 4 || pendingDev.length > 4) && (
              <button className="w-full mt-6 py-2 text-xs text-muted hover:text-accent font-bold uppercase tracking-widest transition-colors">
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
          />

          <DeckCard 
            to="/development" 
            title="Development" 
            count={pendingDev.length} 
            label="Active Issues" 
            icon={<Code size={24} />}
            color="from-purple-500/20 to-purple-900/40"
            accent="bg-purple-500"
          />

          <DeckCard 
            to="/finance" 
            title="Finance" 
            count={recentExpenses.length} 
            label="Recent Txns" 
            icon={<DollarSign size={24} />}
            color="from-emerald-500/20 to-emerald-900/40"
            accent="bg-emerald-500"
          />

          <DeckCard 
            to="/habits" 
            title="Habits" 
            count={activeHabits.length} 
            label="Active Streaks" 
            icon={<Flame size={24} />}
            color="from-orange-500/20 to-orange-900/40"
            accent="bg-orange-500"
          />

          <DeckCard 
            to="/journal" 
            title="Journal" 
            count={recentJournal.length} 
            label="Recent Entries" 
            icon={<Book size={24} />}
            color="from-indigo-500/20 to-indigo-900/40"
            accent="bg-indigo-500"
            className="md:col-span-2"
          />

        </section>
      </div>
    </div>
  );
};

const DeckCard = ({ to, title, count, label, icon, color, accent, className = "" }) => (
  <Link to={to} className={`group block ${className}`}>
    <div className={`h-full glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-8">
          <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black font-mono group-hover:text-white transition-colors">
              {count.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] text-muted uppercase tracking-tighter font-bold">{label}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold tracking-tight group-hover:translate-x-1 transition-transform">{title}</h3>
          <div className={`w-12 h-1 ${accent} mt-2 rounded-full group-hover:w-20 transition-all duration-500`}></div>
        </div>
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
    </div>
  </Link>
);

export default Dashboard;
