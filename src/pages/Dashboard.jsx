import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePersonalStore from '../decks/personal/store/personalStore';
import useDevelopmentStore from '../decks/development/store/developmentStore';
import useFinanceStore from '../decks/finance/store/financeStore';
import useHabitsStore from '../decks/habits/store/habitsStore';
import useJournalStore from '../decks/journal/store/journalStore';
import { Calendar, User, Code, DollarSign, Flame, Book, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const EnterpriseDashboard = () => {
  const { tasks: personalTasks, fetchTasks: fetchPersonal } = usePersonalStore();
  const { tasks: devTasks, fetchAll: fetchDev } = useDevelopmentStore();
  const { expenses, fetchData: fetchFinance } = useFinanceStore();
  const { habits, fetchHabits } = useHabitsStore();
  const { entries: journalEntries, fetchEntries } = useJournalStore();

  useEffect(() => {
    fetchPersonal(); fetchDev(); fetchFinance(); fetchHabits(); fetchEntries();
  }, []);

  const pendingPersonal = personalTasks?.filter(t => t.status !== 'done') || [];
  const pendingDev = devTasks?.filter(t => t.status !== 'done') || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="font-semibold text-slate-700">LifeOS Enterprise</span>
        </div>
        <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <Calendar size={20} />
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium text-sm">V</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Overview of your personal and professional metrics.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <KPICard title="Personal Tasks" value={pendingPersonal.length} sub="Active" color="blue" />
            <KPICard title="Dev Tasks" value={pendingDev.length} sub="In Progress" color="purple" />
            <KPICard title="Expenses" value={expenses?.length || 0} sub="This Month" color="emerald" />
            <KPICard title="Habits" value={habits?.length || 0} sub="Tracked" color="orange" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity Table */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800">Pending Items</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Task</th>
                            <th className="px-6 py-3 font-medium">Category</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Due</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[...pendingPersonal, ...pendingDev].slice(0, 6).map((task, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 font-medium text-slate-700">{task.title}</td>
                                <td className="px-6 py-3 text-slate-500">{i < pendingPersonal.length ? 'Personal' : 'Dev'}</td>
                                <td className="px-6 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                        <AlertCircle size={12} /> Pending
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-500">{task.due_date ? task.due_date.split('T')[0] : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sidebar Links */}
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <ActionBtn icon={<User size={16}/>} label="Add Task" />
                        <ActionBtn icon={<Code size={16}/>} label="Log Dev Work" />
                        <ActionBtn icon={<DollarSign size={16}/>} label="Add Expense" />
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Productivity Tip</h3>
                    <p className="text-sm text-blue-700">You have 3 tasks due today. Focus on the most complex one first when your energy is highest.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

const KPICard = ({ title, value, sub, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        purple: 'text-purple-600 bg-purple-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        orange: 'text-orange-600 bg-orange-50'
    };
    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-slate-500 text-sm font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    {color === 'blue' && <User size={16} />}
                    {color === 'purple' && <Code size={16} />}
                    {color === 'emerald' && <DollarSign size={16} />}
                    {color === 'orange' && <Flame size={16} />}
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </div>
    )
}

const ActionBtn = ({ icon, label }) => (
    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all group">
        <span className="text-slate-400 group-hover:text-blue-600">{icon}</span>
        {label}
        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
)

export default EnterpriseDashboard;