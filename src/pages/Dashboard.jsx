import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePersonalStore from '../decks/personal/store/personalStore';
import useDevelopmentStore from '../decks/development/store/developmentStore';
import useFinanceStore from '../decks/finance/store/financeStore';
import useHabitsStore from '../decks/habits/store/habitsStore';
import useJournalStore from '../decks/journal/store/journalStore';
import { calendarService } from '../shared/services/calendarService';

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
  const activeHabits = habits?.filter(h => h.active !== false) || []; // assuming active property or just count all
  const recentExpenses = expenses?.slice(0, 5) || [];
  const recentJournal = journalEntries?.slice(0, 3) || [];

  const handleCalendarSync = async () => {
    try {
      await calendarService.signIn();
      const events = await calendarService.listEvents();
      console.log('Synced Events:', events);
      alert(`Synced ${events.length} events from Google Calendar!`);
    } catch (error) {
      console.error("Calendar sync failed", error);
      alert("Calendar sync failed. See console.");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen text-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome back, Vallabh
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening today.</p>
        </div>
        <button 
          onClick={handleCalendarSync}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg flex items-center gap-2"
        >
          <span>📅</span> Sync Calendar
        </button>
      </header>

      {/* Today's Agenda */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-yellow-400">⚡</span> Today's Agenda
        </h2>
        <div className="space-y-3">
          {pendingPersonal.length === 0 && pendingDev.length === 0 && (
            <p className="text-gray-500 italic">No pending tasks for today. Enjoy!</p>
          )}
          
          {pendingPersonal.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg border-l-4 border-blue-500">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <span className="text-xs text-blue-300 uppercase tracking-wide">Personal</span>
              </div>
              <span className="text-xs text-gray-400">{task.due_date || 'No Date'}</span>
            </div>
          ))}

          {pendingDev.slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg border-l-4 border-purple-500">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <span className="text-xs text-purple-300 uppercase tracking-wide">Development</span>
              </div>
              <span className="text-xs text-gray-400">{task.due_date || 'No Date'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Deck Overviews */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* Personal Deck */}
        <Link to="/personal" className="block transform hover:scale-105 transition duration-200">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">👤</div>
            <h3 className="text-lg font-bold">Personal</h3>
            <div>
              <span className="text-3xl font-extrabold">{pendingPersonal.length}</span>
              <p className="text-blue-200 text-sm">Pending Tasks</p>
            </div>
          </div>
        </Link>

        {/* Development Deck */}
        <Link to="/development" className="block transform hover:scale-105 transition duration-200">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💻</div>
            <h3 className="text-lg font-bold">Development</h3>
            <div>
              <span className="text-3xl font-extrabold">{pendingDev.length}</span>
              <p className="text-purple-200 text-sm">Active Issues</p>
            </div>
          </div>
        </Link>

        {/* Finance Deck */}
        <Link to="/finance" className="block transform hover:scale-105 transition duration-200">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-5 shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💰</div>
            <h3 className="text-lg font-bold">Finance</h3>
            <div>
              <span className="text-3xl font-extrabold">{recentExpenses.length}</span>
              <p className="text-green-200 text-sm">Recent Txns</p>
            </div>
          </div>
        </Link>

        {/* Habits Deck */}
        <Link to="/habits" className="block transform hover:scale-105 transition duration-200">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-5 shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🔥</div>
            <h3 className="text-lg font-bold">Habits</h3>
            <div>
              <span className="text-3xl font-extrabold">{activeHabits.length}</span>
              <p className="text-orange-200 text-sm">Active Streaks</p>
            </div>
          </div>
        </Link>

        {/* Journal Deck */}
        <Link to="/journal" className="block transform hover:scale-105 transition duration-200">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-5 shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">📔</div>
            <h3 className="text-lg font-bold">Journal</h3>
            <div>
              <span className="text-3xl font-extrabold">{recentJournal.length}</span>
              <p className="text-indigo-200 text-sm">Recent Entries</p>
            </div>
          </div>
        </Link>

      </section>
    </div>
  );
};

export default Dashboard;
