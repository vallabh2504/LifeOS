import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon,
  Activity,
  Heart,
  Target,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';

const CALENDAR_EVENTS = [
  { id: 1, title: 'Team Standup', time: '09:00', type: 'work', color: 'bg-blue-500' },
  { id: 2, title: 'Lunch Break', time: '12:30', type: 'personal', color: 'bg-emerald-500' },
  { id: 3, title: 'Code Review', time: '14:00', type: 'work', color: 'bg-purple-500' },
  { id: 4, title: 'Gym Session', time: '18:00', type: 'health', color: 'bg-pink-500' },
  { id: 5, title: 'Journal Entry', time: '21:00', type: 'journal', color: 'bg-amber-500' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarView = ({ theme = 'dark' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add padding for days before first of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentDate]);

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    // For demo, show random events on some days
    const dayOfMonth = date.getDate();
    if (dayOfMonth % 3 === 0) {
      return CALENDAR_EVENTS.filter(e => e.id % 3 === dayOfMonth % 5);
    }
    if (dayOfMonth % 5 === 0) {
      return [CALENDAR_EVENTS[0], CALENDAR_EVENTS[2]];
    }
    return [];
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'work': return Briefcase;
      case 'personal': return Target;
      case 'health': return Heart;
      case 'journal': return BookOpen;
      default: return Activity;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-400" />
              Calendar
            </h1>
            <p className="text-white/50 mt-1">High-tech OS style calendar view</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <h2 className="text-xl font-semibold text-white min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-white/10">
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-white/50 text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7">
                {daysInMonth.map((date, index) => (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={clsx(
                      'min-h-[100px] p-2 border-r border-b border-white/5 cursor-pointer transition-all relative',
                      !date && 'bg-black/20',
                      date && isSelected(date) && 'bg-blue-600/20',
                      date && !isSelected(date) && 'hover:bg-white/5'
                    )}
                  >
                    {date && (
                      <>
                        <span className={clsx(
                          'text-sm font-medium',
                          isToday(date) ? 'w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center' : 'text-white/70'
                        )}>
                          {date.getDate()}
                        </span>
                        
                        {/* Event indicators */}
                        <div className="mt-1 space-y-1">
                          {getEventsForDate(date).slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={clsx('text-xs px-1.5 py-0.5 rounded truncate', event.color, 'text-white/90')}
                            >
                              {event.time} {event.title}
                            </div>
                          ))}
                          {getEventsForDate(date).length > 2 && (
                            <div className="text-xs text-white/40">
                              +{getEventsForDate(date).length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day Detail View */}
          <div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              
              <div className="space-y-4">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No events scheduled</p>
                  </div>
                ) : (
                  getEventsForDate(selectedDate).map(event => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className={clsx('p-2 rounded-lg', event.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-white/50 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Add Button */}
            <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-white/20 text-white/50 hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
