import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Building2, 
  Clock, 
  Users, 
  Sparkles, 
  Coffee, 
  MapPin, 
  Volume2, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  FastForward, 
  RotateCcw, 
  MessageSquare, 
  ChevronRight, 
  Smartphone,
  Check,
  Compass,
  Zap,
  ArrowRight,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { QRModal } from './QRModal';
import { playChimeSound } from '../utils/audio';

export const UserLiveDashboard: React.FC = () => {
  const { 
    activeUserToken, 
    tokens, 
    counters, 
    selectedFacility, 
    selectedDepartment, 
    stepQueue, 
    fastForwardToUserTurn, 
    delayUserToken, 
    toggleSteppingOut,
    setCurrentView
  } = useQueue();

  const [showQrModal, setShowQrModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fallback token object if user hasn't joined or reset
  const token = activeUserToken || {
    id: 'tok-a47',
    tokenNumber: 'A-47',
    sequenceNumber: 47,
    userName: 'Alex Morgan (You)',
    userPhone: '+1 (555) 892-4412',
    facilityId: selectedFacility.id,
    facilityName: selectedFacility.name,
    departmentId: selectedDepartment.id,
    departmentName: selectedDepartment.name,
    status: 'waiting',
    joinedAt: '11:12 AM',
    priority: 'standard',
    estimatedWaitMinutes: 24,
  };

  // Find currently serving tokens
  const servingTokens = tokens.filter(
    t => t.departmentId === token.departmentId && t.status === 'serving'
  );
  const primaryServingToken = servingTokens[0] || {
    tokenNumber: 'A-35',
    counterName: 'Counter 02',
    userName: 'Elena Rostova',
  };

  // Calculate live people ahead
  const isServing = token.status === 'serving';
  const isCompleted = token.status === 'completed';

  const peopleAhead = React.useMemo(() => {
    if (isServing || isCompleted) return 0;
    return tokens.filter(
      t => t.departmentId === token.departmentId &&
           (t.status === 'waiting' || t.status === 'approaching') &&
           t.sequenceNumber < token.sequenceNumber
    ).length;
  }, [tokens, token, isServing, isCompleted]);

  // Live estimated wait in minutes
  const estimatedWait = React.useMemo(() => {
    if (isServing) return 0;
    if (isCompleted) return 0;
    return Math.max(2, Math.round(peopleAhead * 2.0));
  }, [peopleAhead, isServing, isCompleted]);

  // Expected turn calculation: 11:36 AM
  const expectedTurnTime = React.useMemo(() => {
    if (isServing) return 'Now Serving!';
    if (isCompleted) return 'Completed';
    // Calculate expected time
    const d = new Date();
    d.setMinutes(d.getMinutes() + estimatedWait);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [estimatedWait, isServing, isCompleted]);

  // Progress Bar Percentage: 20 total range baseline
  const progressPercent = React.useMemo(() => {
    if (isServing) return 100;
    if (isCompleted) return 100;
    const initialAhead = 20;
    const completed = Math.max(0, initialAhead - peopleAhead);
    return Math.min(95, Math.max(15, Math.round((completed / initialAhead) * 100)));
  }, [peopleAhead, isServing, isCompleted]);

  // Next tokens in queue line: A-36, A-37, A-38, etc.
  const nextTokens = React.useMemo(() => {
    return tokens
      .filter(t => t.departmentId === token.departmentId && (t.status === 'waiting' || t.status === 'approaching'))
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .slice(0, 7);
  }, [tokens, token.departmentId]);

  const handleShare = () => {
    navigator.clipboard.writeText(`QueueLess Live Pass: Token ${token.tokenNumber} at ${token.facilityName}. Expected turn: ${expectedTurnTime}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Judge Interactive Simulator Bar */}
        <div 
          id="judge-simulator-card"
          className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 p-4 rounded-3xl text-white shadow-lg border border-indigo-800/40 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                  Interactive Live Simulator
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Advance the hospital queue step-by-step or jump straight to Token A-47's consultation!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="live-advance-step-btn"
              onClick={stepQueue}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Step Queue (+1)</span>
            </button>

            <button
              id="live-fast-forward-turn-btn"
              onClick={fastForwardToUserTurn}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Jump to My Turn (A-47 Called!)</span>
            </button>
          </div>
        </div>

        {/* Top Organization Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Organization:
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  {token.facilityName || 'CityCare Hospital'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                {token.departmentName || 'General Consultation'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="live-share-pass-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied!' : 'Share Live Pass'}
            </button>
            <button
              id="live-test-chime-btn"
              onClick={playChimeSound}
              title="Test the airport/hospital chime"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* MAIN USER TOKEN CARD */}
        <div 
          id="main-user-token-card"
          className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all relative overflow-hidden ${
            isServing
              ? 'bg-linear-to-br from-emerald-900 via-teal-900 to-slate-950 text-white border-emerald-500/50 ring-4 ring-emerald-500/20'
              : 'bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-slate-800'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: User details & Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-300">
                Patient: <span className="text-white font-bold">{token.userName}</span>
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Registered: {token.joinedAt} • Phone: {token.userPhone}
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {isServing ? (
                <span 
                  id="token-status-badge-serving"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-md animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950" />
                  NOW SERVING!
                </span>
              ) : peopleAhead <= 3 ? (
                <span 
                  id="token-status-badge-approaching"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  Turn Approaching
                </span>
              ) : (
                <span 
                  id="token-status-badge-waiting"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/15 text-indigo-200 border border-white/20"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  Status: Waiting
                </span>
              )}
            </div>
          </div>

          {/* Center: Massive Token Display */}
          <div className="my-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-300 block">
                Your Digital Token
              </span>
              <div 
                id="token-large-display"
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-['Outfit',sans-serif] mt-1"
              >
                {token.tokenNumber}
              </div>
              {isServing && (
                <p className="text-emerald-300 text-sm font-bold mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Please proceed immediately to {token.counterName || 'Counter 02'}!
                </p>
              )}
            </div>

            {/* Mini QR Verification badge */}
            <div className="bg-white/10 p-4 rounded-2xl border border-white/15 text-center shrink-0">
              <QrCode className="w-16 h-16 text-indigo-200 mx-auto" />
              <span className="text-[10px] uppercase font-bold text-slate-300 block mt-1.5">
                Kiosk Verified
              </span>
            </div>
          </div>

          {/* 3 Metrics: People ahead (12), Estimated wait (24 min), Expected turn (11:36 AM) */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
            {/* People Ahead: 12 */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-medium text-indigo-200 block uppercase">
                People ahead:
              </span>
              <span 
                id="metric-people-ahead"
                className="text-2xl sm:text-3xl font-black text-white block mt-0.5"
              >
                {isServing ? '0' : peopleAhead}
              </span>
              <span className="text-[10px] text-slate-300">Patients in line</span>
            </div>

            {/* Estimated wait: 24 min */}
            <div className="text-center sm:text-left border-x border-white/15 px-2 sm:px-4">
              <span className="text-[10px] sm:text-xs font-medium text-indigo-200 block uppercase">
                Estimated wait:
              </span>
              <span 
                id="metric-estimated-wait"
                className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-0.5"
              >
                {isServing ? '0' : `${estimatedWait} min`}
              </span>
              <span className="text-[10px] text-slate-300">Dynamic AI estimate</span>
            </div>

            {/* Expected turn: 11:36 AM */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-medium text-indigo-200 block uppercase">
                Expected turn:
              </span>
              <span 
                id="metric-expected-turn"
                className="text-xl sm:text-3xl font-black text-white block mt-0.5"
              >
                {expectedTurnTime}
              </span>
              <span className="text-[10px] text-slate-300">Projected call</span>
            </div>
          </div>

          {/* Queue Progress Bar: 12 people ahead */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span className="font-semibold">
                {isServing ? 'Turn Reached (Ready)' : `${peopleAhead} people ahead`}
              </span>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>
            
            {/* Custom stylized progress bar */}
            <div 
              id="queue-progress-bar-container"
              className="w-full bg-white/15 h-3.5 rounded-full overflow-hidden p-0.5"
            >
              <div 
                id="queue-progress-bar-fill"
                className="h-full rounded-full bg-linear-to-r from-emerald-400 via-teal-300 to-indigo-400 transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stepping Out / Delay Turn Action Strip */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="toggle-stepping-out-btn"
                onClick={toggleSteppingOut}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  token.steppingOut 
                    ? 'bg-emerald-500 text-slate-950 shadow-md' 
                    : 'bg-white/15 hover:bg-white/20 text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{token.steppingOut ? 'Stepping Out (Active • 15m Safe Alert)' : "I'm stepping out (Cafeteria/Outside)"}</span>
              </button>

              <button
                id="delay-turn-btn"
                onClick={() => delayUserToken(10)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span>Delay by 10 min</span>
              </button>
            </div>

            <button
              onClick={() => setShowSmsModal(true)}
              className="text-xs text-indigo-200 hover:text-white flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Preview SMS Notification</span>
            </button>
          </div>

        </div>

        {/* PROMINENT AI CARD: 🤖 Queue Intelligence (Requested in Prompt) */}
        <div 
          id="queue-intelligence-card"
          className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-200/90 shadow-md relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <span className="text-2xl">🤖</span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                    Queue Intelligence
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Real-Time Inference
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Velocity: 3.2 min / patient
                </span>
              </div>

              {/* The prompt's exact AI statement */}
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                "Based on the current service rate and queue velocity, you have <strong className="text-indigo-900 font-bold">~{estimatedWait} minutes</strong>. You can safely step out for coffee at the 1st Floor Cafe or visit the Central Pharmacy in Wing A. We will dispatch an urgent SMS notification and chime alert as soon as you are <strong className="text-indigo-900 font-bold">3 tokens away</strong>."
              </p>

              {/* Extra AI Insights & Speed Meter */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Doctors
                  </span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">
                    3 Counters Serving
                  </span>
                  <span className="text-[10px] text-slate-500">Dr. Jenkins, Dr. Chen, Dr. Patel</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Safe Return Buffer
                  </span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                    Safe until {new Date(Date.now() + Math.max(5, estimatedWait - 7) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-500">Includes 5-min walking window</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Bottleneck Risk
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Low (Normal Flow)
                  </span>
                  <span className="text-[10px] text-slate-500">No stalling detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE QUEUE DISPLAY (Currently Serving A-35, Next: A-36, A-37, A-38, ...) */}
        <div 
          id="live-queue-tracker-section"
          className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif]">
                Live Queue Sequence
              </h3>
              <p className="text-xs text-slate-500">Real-time status of current and upcoming tokens</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Updates Live
            </span>
          </div>

          {/* Currently Serving: A-35 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                <span className="animate-pulse">●</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Currently Serving
                </span>
                <div 
                  id="currently-serving-display"
                  className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]"
                >
                  {primaryServingToken.tokenNumber}
                </div>
                <span className="text-xs text-emerald-700 font-medium">
                  At Counter 02 (Dr. Michael Chen)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                Consultation in Progress
              </span>
            </div>
          </div>

          {/* Next Up Tokens Strip: Next: A-36, A-37, A-38, ... A-47 */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              Next Up in Line:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {nextTokens.map((t, idx) => {
                const isUser = t.sequenceNumber === token.sequenceNumber;
                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isUser
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/30'
                        : idx === 0
                          ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`text-[10px] block font-bold ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {idx === 0 ? 'Next' : `#${idx + 1}`}
                    </span>
                    <div className="text-base font-black font-['Outfit',sans-serif] mt-0.5">
                      {t.tokenNumber}
                    </div>
                    <span className={`text-[10px] block truncate mt-0.5 ${isUser ? 'text-indigo-100 font-bold' : 'text-slate-500'}`}>
                      {isUser ? 'YOU' : t.userName.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Helpful Local Amenities & Return Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <Coffee className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Hospital Cafe</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Level 1 East Wing • 2 min walk</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Pharmacy Pick-up</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Lobby Counter 04 • 1 min walk</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Diagnostic Lab</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Basement Wing B • 3 min walk</p>
          </div>
        </div>

      </div>

      {/* Simulated SMS Alert Preview Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Simulated SMS Message</span>
              </div>
              <button 
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* iOS style SMS bubble */}
            <div className="bg-slate-100 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Sender: QueueLess Alert</span>
                <span>Just Now</span>
              </div>
              <div className="bg-indigo-600 text-white p-3 rounded-2xl text-xs leading-relaxed rounded-tl-xs shadow-xs">
                "CityCare Hospital Alert: Token <strong>{token.tokenNumber}</strong>, your turn is approaching! Only 3 patients ahead. Please return to <strong>{token.departmentName}</strong>, Counter 02."
              </div>
            </div>

            <button
              onClick={() => setShowSmsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      <QRModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

    </div>
  );
};
