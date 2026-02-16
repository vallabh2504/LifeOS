import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

// Decks
import PersonalDeck from './decks/personal/PersonalDeck';
import DevelopmentDeck from './decks/development/DevelopmentDeck';
import FinanceDeck from './decks/finance/FinanceDeck';
import HabitsDeck from './decks/habits/HabitsDeck';
import JournalDeck from './decks/journal/JournalDeck';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/personal" element={<PersonalDeck />} />
              <Route path="/development" element={<DevelopmentDeck />} />
              <Route path="/finance" element={<FinanceDeck />} />
              <Route path="/habits" element={<HabitsDeck />} />
              <Route path="/journal" element={<JournalDeck />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
