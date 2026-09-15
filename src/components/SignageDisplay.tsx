import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Tv, 
  Volume2, 
  QrCode, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Maximize2, 
  Minimize2,
  Building2,
  Users
} from 'lucide-react';
import { playChimeSound } from '../utils/audio';

export const SignageDisplay: React.FC = () => {
  const { counters, tokens, selectedFacility, selectedDepartment, setCurrentView } = useQueue();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Next tokens in line
  const upcomingTokens = tokens
    .filter(t => t.departmentId === selectedDepartment.id && (t.status === 'waiting' || t.status === 'approaching'))
    .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            id="signage-back-btn"
            onClick={() => setCurrentView('admin-dashboard')}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Return to Admin Console"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Live Public Waiting Room Display
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif] mt-0.5">
              {selectedFacility.name} — {selectedDepartment.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Current Time
            </span>
            <div className="text-2xl font-black font-mono text-indigo-300">
              {currentTime}
            </div>
          </div>

          <button
            id="signage-sound-test-btn"
            onClick={playChimeSound}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer"
            title="Chime Audio Test"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            id="signage-fullscreen-btn"
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Split Body: Left is Large Now Serving Tiles, Right is Walk-in QR Standee & Next Up */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Left 8 Cols: NOW SERVING COUNTERS */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              NOW SERVING
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Please proceed to your called counter
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {counters.map((c) => {
              const token = c.currentServingToken;
              return (
                <div
                  key={c.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                    token 
                      ? 'bg-linear-to-br from-slate-900 to-indigo-950/80 border-indigo-500/40 shadow-xl ring-2 ring-indigo-500/20' 
                      : 'bg-slate-900/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-indigo-400 font-['Outfit',sans-serif]">
                      {c.name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      token ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {token ? 'Serving Patient' : 'Station Ready'}
                    </span>
                  </div>

                  <div className="my-6 text-center">
                    {token ? (
                      <div>
                        <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                          Token Number
                        </span>
                        <div className="text-6xl sm:text-7xl font-black tracking-tight text-white font-['Outfit',sans-serif] mt-1 animate-in fade-in zoom-in-95">
                          {token.tokenNumber}
                        </div>
                        <div className="text-sm font-bold text-slate-300 mt-2">
                          {token.userName}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-slate-500 font-bold text-lg">
                        NEXT PATIENT READY
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">{c.staffName}</span>
                    <span>{c.staffRole}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Scan QR to Join & Next Up Ticker */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Giant Lobby Standee QR Code */}
          <div className="bg-linear-to-b from-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-800/60 shadow-xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skip the Line with Mobile</span>
            </div>

            <h3 className="text-xl font-black text-white font-['Outfit',sans-serif]">
              Scan to Join Queue
            </h3>
            <p className="text-xs text-slate-400">
              Point your phone camera below to receive your digital token & SMS updates.
            </p>

            {/* SVG QR Code */}
            <div className="p-3 bg-white rounded-2xl w-48 h-48 mx-auto shadow-lg flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="9" y="9" width="18" height="18" rx="1" fill="white" />
                <rect x="13" y="13" width="10" height="10" fill="#4338ca" />
                <rect x="69" y="5" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="73" y="9" width="18" height="18" rx="1" fill="white" />
                <rect x="77" y="13" width="10" height="10" fill="#4338ca" />
                <rect x="5" y="69" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="9" y="73" width="18" height="18" rx="1" fill="white" />
                <rect x="13" y="77" width="10" height="10" fill="#4338ca" />
                <rect x="36" y="10" width="8" height="8" fill="#0f172a" />
                <rect x="48" y="15" width="6" height="6" fill="#4338ca" />
                <rect x="38" y="38" width="12" height="12" fill="#0f172a" />
                <rect x="54" y="44" width="8" height="8" fill="#4338ca" />
                <rect x="72" y="52" width="12" height="10" fill="#0f172a" />
                <rect x="40" y="70" width="14" height="14" fill="#4338ca" />
                <circle cx="50" cy="50" r="10" fill="#1e1b4b" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            <div className="text-[11px] font-mono text-indigo-300">
              queueless.app/join/citycare
            </div>
          </div>

          {/* Upcoming Tokens Ticker */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Up Next in Order
            </span>

            <div className="grid grid-cols-3 gap-2">
              {upcomingTokens.map((t, idx) => (
                <div 
                  key={t.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center"
                >
                  <span className="text-[10px] text-slate-400 block">#{idx + 1}</span>
                  <span className="text-base font-black text-white font-['Outfit',sans-serif]">
                    {t.tokenNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Announcement Marquee */}
      <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-bold">
            NOTICE
          </span>
          <span>Please retain your virtual token pass. You will receive an SMS reminder 3 tokens prior.</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span>Powered by QueueLess AI</span>
          <span>•</span>
          <span>Emergency Triage: Counter 01</span>
        </div>
      </div>

    </div>
  );
};
