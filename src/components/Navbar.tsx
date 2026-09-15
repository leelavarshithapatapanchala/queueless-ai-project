import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Tv, 
  Ticket, 
  Sparkles, 
  QrCode, 
  ChevronDown,
  Activity,
  Layers
} from 'lucide-react';
import { QRModal } from './QRModal';

export const Navbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole,
    currentView, 
    setCurrentView, 
    activeUserToken, 
    tokens,
    isSimulating, 
    setIsSimulating, 
    stepQueue, 
    fastForwardToUserTurn, 
    resetDemoData, 
    selectDemoAccount 
  } = useQueue();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Compute tokens ahead of user if user has an active token
  const userAheadCount = React.useMemo(() => {
    if (!activeUserToken) return 0;
    if (activeUserToken.status === 'serving') return 0;
    if (activeUserToken.status === 'completed') return 0;
    
    return tokens.filter(
      t => t.departmentId === activeUserToken.departmentId &&
           (t.status === 'waiting' || t.status === 'approaching') &&
           t.sequenceNumber < activeUserToken.sequenceNumber
    ).length;
  }, [activeUserToken, tokens]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        {/* Hackathon Judge Interactive Control Strip */}
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white tracking-wide">HACKATHON SIMULATOR:</span>
              <span className="text-slate-400 hidden sm:inline">Test live queue mechanics without waiting 25 real minutes</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Step Queue */}
              <button
                id="hackathon-step-queue-btn"
                onClick={stepQueue}
                title="Calls the next patient in line across counters"
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Call Next (+1)</span>
              </button>

              {/* Jump to User Turn */}
              <button
                id="hackathon-fast-forward-btn"
                onClick={fastForwardToUserTurn}
                title="Instantly calls Token A-47 to Counter 02"
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
              >
                <FastForward className="w-3 h-3" />
                <span className="hidden md:inline">Fast-Forward to My Turn (A-47)</span>
                <span className="md:hidden">My Turn</span>
              </button>

              {/* Auto simulate toggle */}
              <button
                id="hackathon-auto-sim-btn"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  isSimulating 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSimulating ? <Pause className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                <span className="hidden sm:inline">{isSimulating ? 'Auto-Advancing (ON)' : 'Auto-Advancing (OFF)'}</span>
              </button>

              {/* Reset */}
              <button
                id="hackathon-reset-btn"
                onClick={resetDemoData}
                title="Reset back to initial demo state"
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <button 
                id="nav-logo-btn"
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-3 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-slate-900 via-indigo-950 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                      Queue<span className="text-indigo-600">Less</span>
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      AI MVP
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 tracking-wide">
                    Stop Waiting. Start Living.
                  </p>
                </div>
              </button>

              {/* Primary Navigation items */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                <button
                  id="nav-landing-btn"
                  onClick={() => setCurrentView('landing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'landing'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Overview
                </button>

                <button
                  id="nav-join-btn"
                  onClick={() => setCurrentView('join')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'join'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Join Queue
                </button>

                <button
                  id="nav-live-token-btn"
                  onClick={() => setCurrentView('live-token')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'live-token'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>My Token Dashboard</span>
                  {activeUserToken && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      currentView === 'live-token' 
                        ? 'bg-white/20 text-white' 
                        : activeUserToken.status === 'serving'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {activeUserToken.tokenNumber} {activeUserToken.status === 'serving' ? '• Serving!' : `• ${userAheadCount} ahead`}
                    </span>
                  )}
                </button>

                <button
                  id="nav-admin-btn"
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('admin-dashboard');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'admin-dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Console
                </button>

                <button
                  id="nav-signage-btn"
                  onClick={() => setCurrentView('signage-screen')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'signage-screen'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-slate-500" />
                  <span>Waiting Room TV</span>
                </button>
              </nav>
            </div>

            {/* Right side: QR Scanner modal trigger & Demo Role Switcher */}
            <div className="flex items-center gap-2.5">
              {/* Scan QR simulator */}
              <button
                id="header-scan-qr-btn"
                onClick={() => setShowQrModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulate QR Standee</span>
              </button>

              {/* Demo Account Switcher */}
              <div className="relative">
                <button
                  id="role-switcher-toggle"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold ${
                    userRole === 'admin' ? 'bg-slate-900' : 'bg-indigo-600'
                  }`}>
                    {userRole === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-[10px] font-medium text-slate-400 leading-none">Role Switcher</span>
                    <span className="block text-xs font-bold text-slate-800 leading-tight">
                      {userRole === 'admin' ? 'Admin / Staff' : 'Patient / User'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {showRoleMenu && (
                  <div 
                    id="role-switcher-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Select Demo Experience
                      </p>
                      <p className="text-[11px] text-slate-500">No passwords required for hackathon judges</p>
                    </div>

                    <button
                      id="demo-user-select"
                      onClick={() => {
                        selectDemoAccount('user');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        userRole === 'user' ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">User / Patient</span>
                          {userRole === 'user' && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-semibold">Active</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">demo@queueless.app</span>
                      </div>
                    </button>

                    <button
                      id="demo-admin-select"
                      onClick={() => {
                        selectDemoAccount('admin');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        userRole === 'admin' ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">Admin / Org</span>
                          {userRole === 'admin' && (
                            <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-semibold">Active</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">admin@queueless.app</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Mobile Navigation bar */}
          <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'landing' ? 'bg-slate-200 font-bold' : 'text-slate-600'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('join')}
              className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'join' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-600'}`}
            >
              Join Queue
            </button>
            <button
              onClick={() => setCurrentView('live-token')}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 ${currentView === 'live-token' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'}`}
            >
              <Ticket className="w-3 h-3" />
              <span>Token {activeUserToken?.tokenNumber || 'A-47'}</span>
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'admin-dashboard' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setCurrentView('signage-screen')}
              className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'signage-screen' ? 'bg-slate-200 font-bold' : 'text-slate-600'}`}
            >
              TV
            </button>
          </div>
        </div>
      </header>

      {/* QR Code standee simulator */}
      <QRModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
    </>
  );
};
