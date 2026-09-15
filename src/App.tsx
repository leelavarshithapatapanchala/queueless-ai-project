import React from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { JoinQueueView } from './components/JoinQueueView';
import { UserLiveDashboard } from './components/UserLiveDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SignageDisplay } from './components/SignageDisplay';
import { NotificationToast } from './components/NotificationToast';
import { HeartPulse, Layers, ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useQueue();

  // If public TV signage view, render full-screen immersive display
  if (currentView === 'signage-screen') {
    return (
      <main id="app-main-signage">
        <SignageDisplay />
        <NotificationToast />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sticky Top Navigation & Hackathon Judge Quick Controls */}
      <Navbar />

      {/* Primary Page Views */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'join' && <JoinQueueView />}
        {currentView === 'live-token' && <UserLiveDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                QueueLess
              </span>
              <span className="text-slate-400 ml-1.5 font-medium">— Stop Waiting. Start Living.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <button 
              onClick={() => setCurrentView('landing')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button 
              onClick={() => setCurrentView('join')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Join Queue
            </button>
            <button 
              onClick={() => setCurrentView('live-token')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Live Token A-47
            </button>
            <button 
              onClick={() => setCurrentView('admin-dashboard')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Admin Console
            </button>
            <button 
              onClick={() => setCurrentView('signage-screen')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Waiting Room TV
            </button>
          </div>

          <div className="text-slate-400 text-center sm:text-right">
            <span>Built for Hackathon Demo</span>
            <span className="mx-1.5">•</span>
            <span>CityCare Hospital MVP</span>
          </div>
        </div>
      </footer>

      {/* Global Real-Time Toast Notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}
