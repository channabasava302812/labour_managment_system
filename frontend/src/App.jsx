import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import BffSummaryCards from './components/common/BffSummaryCards';
import LabourDirectory from './components/screens/LabourDirectory';
import AttendanceSheet from './components/screens/AttendanceSheet';
import ChatbotWidget from './components/common/ChatbotWidget';
import LoginPage from './components/common/LoginPage';
import { fetchBffSummary } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('labours');
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('labour_user');
    const token = localStorage.getItem('labour_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadSummary = async () => {
    try {
      const res = await fetchBffSummary();
      setSummary(res.data);
    } catch (err) {
      console.error('Error loading BFF summary', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadSummary();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('labour_token');
    localStorage.removeItem('labour_user');
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  const todayString = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar with the Two Modules */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onLogout={handleLogout} />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {activeTab === 'labours' && 'Labour Workforce Directory'}
                {activeTab === 'attendance' && 'Daily Attendance & Wage Calculator'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>{todayString}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-emerald-600">PostgreSQL Live Sync</span>
              </p>
            </div>
          </div>

          {/* 4 BFF KPI Summary Cards on Top */}
          <BffSummaryCards summary={summary} />

          {/* Active View */}
          {activeTab === 'labours' && <LabourDirectory onDataChange={loadSummary} />}
          {activeTab === 'attendance' && <AttendanceSheet onDataChange={loadSummary} />}
        </main>
      </div>

      {/* Floating AI Chatbot Interface (Friend's Python Assistant) */}
      <ChatbotWidget />
    </div>
  );
}

export default App;